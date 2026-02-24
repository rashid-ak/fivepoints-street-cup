import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  X,
  Plus,
  GripVertical,
  Copy,
  Check,
} from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  tags: string[];
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

interface SiteModule {
  id: string;
  module_key: string;
  label: string;
  enabled: boolean;
  display_order: number;
}

const AdminContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingMedia, setEditingMedia] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Site modules state
  const [modules, setModules] = useState<SiteModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);

  useEffect(() => {
    loadMedia();
    loadModules();
  }, []);

  const loadMedia = async () => {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setMedia(data || []);
    setMediaLoading(false);
  };

  const loadModules = async () => {
    const { data, error } = await supabase
      .from("site_modules")
      .select("*")
      .order("display_order", { ascending: true });
    if (!error) setModules(data || []);
    setModulesLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(path);

      await supabase.from("media").insert({
        filename: file.name,
        storage_path: path,
        url: urlData.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id,
        tags: [],
      });
    }

    await loadMedia();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast({ title: "Upload complete" });
  };

  const deleteMedia = async (item: MediaItem) => {
    await supabase.storage.from("event-images").remove([item.storage_path]);
    await supabase.from("media").delete().eq("id", item.id);
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
    toast({ title: "Deleted" });
  };

  const addTag = async (id: string) => {
    if (!newTag.trim()) return;
    const item = media.find((m) => m.id === id);
    if (!item) return;
    const updated = [...(item.tags || []), newTag.trim()];
    await supabase.from("media").update({ tags: updated }).eq("id", id);
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, tags: updated } : m)));
    setNewTag("");
  };

  const removeTag = async (id: string, tag: string) => {
    const item = media.find((m) => m.id === id);
    if (!item) return;
    const updated = (item.tags || []).filter((t) => t !== tag);
    await supabase.from("media").update({ tags: updated }).eq("id", id);
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, tags: updated } : m)));
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleModule = async (mod: SiteModule) => {
    const newEnabled = !mod.enabled;
    await supabase.from("site_modules").update({ enabled: newEnabled }).eq("id", mod.id);
    setModules((prev) =>
      prev.map((m) => (m.id === mod.id ? { ...m, enabled: newEnabled } : m))
    );
  };

  // Filtering
  const allTags = Array.from(new Set(media.flatMap((m) => m.tags || [])));
  const filtered = media.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || m.filename.toLowerCase().includes(q) || (m.alt_text || "").toLowerCase().includes(q);
    const matchesTag = !tagFilter || (m.tags || []).includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-black text-foreground">Content</h1>

        {/* ===== MEDIA LIBRARY ===== */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ImageIcon className="w-5 h-5 text-primary" />
              Media Library
              <Badge variant="secondary" className="ml-2">{media.length}</Badge>
            </CardTitle>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-1" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {allTags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap items-center">
                  <Badge
                    variant={!tagFilter ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTagFilter("")}
                  >
                    All
                  </Badge>
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={tagFilter === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Grid */}
            {mediaLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No media files yet. Upload images to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-lg border border-border overflow-hidden bg-muted/30"
                  >
                    <div className="aspect-square">
                      <img
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-white hover:bg-white/20"
                          onClick={() => copyUrl(item.url, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-white hover:bg-red-500/50"
                          onClick={() => deleteMedia(item)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div>
                        <p className="text-white text-xs truncate">{item.filename}</p>
                        <p className="text-white/60 text-[10px]">
                          {item.size_bytes ? `${(item.size_bytes / 1024).toFixed(0)}KB` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Tags below image */}
                    <div className="p-2 space-y-1.5">
                      <p className="text-xs text-foreground truncate">{item.filename}</p>
                      <div className="flex gap-1 flex-wrap">
                        {(item.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                            {tag}
                            <X
                              className="w-2.5 h-2.5 cursor-pointer ml-0.5"
                              onClick={() => removeTag(item.id, tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      {editingMedia === item.id ? (
                        <div className="flex gap-1">
                          <Input
                            className="h-6 text-xs"
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTag(item.id)}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0"
                            onClick={() => addTag(item.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="text-[10px] text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setEditingMedia(item.id);
                            setNewTag("");
                          }}
                        >
                          + Add tag
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===== SITE MODULES ===== */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <GripVertical className="w-5 h-5 text-primary" />
              Homepage Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {modulesLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : modules.length === 0 ? (
              <p className="text-muted-foreground">No modules configured.</p>
            ) : (
              <div className="space-y-3">
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                  >
                    <div>
                      <p className="font-medium text-foreground">{mod.label}</p>
                      <p className="text-xs text-muted-foreground">{mod.module_key}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`mod-${mod.id}`} className="text-xs text-muted-foreground">
                        {mod.enabled ? "Enabled" : "Disabled"}
                      </Label>
                      <Switch
                        id={`mod-${mod.id}`}
                        checked={mod.enabled}
                        onCheckedChange={() => toggleModule(mod)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
