import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Copy, Search } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-600/20 text-green-400",
  sold_out: "bg-yellow-600/20 text-yellow-400",
  closed: "bg-red-600/20 text-red-400",
  completed: "bg-blue-600/20 text-blue-400",
  cancelled: "bg-red-600/20 text-red-400",
};

const defaultForm = {
  title: "", short_description: "", description: "", date: "", start_time: "09:00", end_time: "",
  location: "", venue_name: "", address: "", location_notes: "", map_link: "",
  price: "0", capacity: "", event_type: "individual", status: "draft",
  waitlist_enabled: false, waitlist_capacity: "", registration_close_at: "",
  match_duration: "10", target_score: "5", surface_type: "", custom_rules_notes: "",
  min_roster_size: "", max_roster_size: "", roster_lock_at: "",
  featured: false, pinned: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("create") === "true") setDialogOpen(true);
  }, [searchParams]);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    if (data) {
      const withCounts = await Promise.all(
        data.map(async (ev: any) => {
          const { count } = await supabase.from("registrants").select("*", { count: "exact", head: true }).eq("event_id", ev.id).eq("payment_status", "paid");
          return { ...ev, registrant_count: count || 0 };
        })
      );
      setEvents(withCounts);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => { setForm({ ...defaultForm }); setEditingEvent(null); };

  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title || "", short_description: ev.short_description || "", description: ev.description || "",
      date: ev.date || "", start_time: ev.start_time || "09:00", end_time: ev.end_time || "",
      location: ev.location || "", venue_name: ev.venue_name || "", address: ev.address || "",
      location_notes: ev.location_notes || "", map_link: ev.map_link || "",
      price: String(ev.price ?? 0), capacity: ev.capacity ? String(ev.capacity) : "",
      event_type: ev.event_type || "individual", status: ev.status || "draft",
      waitlist_enabled: ev.waitlist_enabled || false, waitlist_capacity: ev.waitlist_capacity ? String(ev.waitlist_capacity) : "",
      registration_close_at: ev.registration_close_at ? ev.registration_close_at.slice(0, 16) : "",
      match_duration: String(ev.match_duration ?? 10), target_score: String(ev.target_score ?? 5),
      surface_type: ev.surface_type || "", custom_rules_notes: ev.custom_rules_notes || "",
      min_roster_size: ev.min_roster_size ? String(ev.min_roster_size) : "",
      max_roster_size: ev.max_roster_size ? String(ev.max_roster_size) : "",
      roster_lock_at: ev.roster_lock_at ? ev.roster_lock_at.slice(0, 16) : "",
      featured: ev.featured || false, pinned: ev.pinned || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      title: form.title, short_description: form.short_description || null, description: form.description || null,
      date: form.date, start_time: form.start_time, end_time: form.end_time || null,
      location: form.location || "TBD", venue_name: form.venue_name || null, address: form.address || null,
      location_notes: form.location_notes || null, map_link: form.map_link || null,
      price: Number(form.price) || 0, capacity: form.capacity ? Number(form.capacity) : null,
      event_type: form.event_type, status: form.status,
      waitlist_enabled: form.waitlist_enabled, waitlist_capacity: form.waitlist_capacity ? Number(form.waitlist_capacity) : null,
      registration_close_at: form.registration_close_at || null,
      match_duration: Number(form.match_duration) || 10, target_score: Number(form.target_score) || 5,
      surface_type: form.surface_type || null, custom_rules_notes: form.custom_rules_notes || null,
      min_roster_size: form.min_roster_size ? Number(form.min_roster_size) : null,
      max_roster_size: form.max_roster_size ? Number(form.max_roster_size) : null,
      roster_lock_at: form.roster_lock_at || null,
      featured: form.featured, pinned: form.pinned,
    };

    if (editingEvent) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editingEvent ? "Event updated" : "Event created" });
    setDialogOpen(false);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Event deleted" });
    fetchEvents();
  };

  const handleClone = async (ev: any) => {
    const { id, created_at, updated_at, registrant_count, ...rest } = ev;
    const { error } = await supabase.from("events").insert({ ...rest, title: `${ev.title} (Copy)`, status: "draft" });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Event cloned" });
    fetchEvents();
  };

  const filtered = events.filter((ev) => {
    const q = search.toLowerCase();
    return !q || ev.title.toLowerCase().includes(q) || (ev.location || "").toLowerCase().includes(q);
  });

  const f = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Events</h1>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Create Event</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No events</TableCell></TableRow>
              ) : filtered.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <Link to={`/admin/events/${ev.id}`} className="text-primary hover:underline font-medium">{ev.title}</Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ev.date}</TableCell>
                  <TableCell><Badge className={statusColors[ev.status] || statusColors.draft}>{ev.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground capitalize">{ev.event_type}</TableCell>
                  <TableCell>{Number(ev.price) === 0 ? <Badge className="bg-green-600/20 text-green-400">Free</Badge> : `$${Number(ev.price)}`}</TableCell>
                  <TableCell className="text-muted-foreground">{ev.capacity || "∞"}</TableCell>
                  <TableCell>{ev.registrant_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(ev)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleClone(ev)} title="Clone"><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ev.id)} title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Event Creation / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => f("title", e.target.value)} />
              </div>
              <div>
                <Label>Short Description</Label>
                <Input value={form.short_description} onChange={(e) => f("short_description", e.target.value)} placeholder="Brief tagline" />
              </div>
              <div>
                <Label>Full Description</Label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={form.description} onChange={(e) => f("description", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={(e) => f("date", e.target.value)} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => f("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Time *</Label><Input type="time" value={form.start_time} onChange={(e) => f("start_time", e.target.value)} /></div>
                <div><Label>End Time</Label><Input type="time" value={form.end_time} onChange={(e) => f("end_time", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(v) => f("featured", v)} id="featured" />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.pinned} onCheckedChange={(v) => f("pinned", v)} id="pinned" />
                  <Label htmlFor="pinned">Pinned</Label>
                </div>
              </div>
            </TabsContent>

            {/* Registration */}
            <TabsContent value="registration" className="space-y-4">
              <div>
                <Label>Event Type</Label>
                <Select value={form.event_type} onValueChange={(v) => f("event_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Registration</SelectItem>
                    <SelectItem value="team">Team Registration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price ($)</Label><Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => f("price", e.target.value)} /></div>
                <div><Label>Capacity</Label><Input type="number" min="1" value={form.capacity} onChange={(e) => f("capacity", e.target.value)} placeholder="Unlimited" /></div>
              </div>
              <div>
                <Label>Registration Cutoff</Label>
                <Input type="datetime-local" value={form.registration_close_at} onChange={(e) => f("registration_close_at", e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.waitlist_enabled} onCheckedChange={(v) => f("waitlist_enabled", v)} id="waitlist" />
                <Label htmlFor="waitlist">Enable Waitlist</Label>
              </div>
              {form.waitlist_enabled && (
                <div><Label>Waitlist Capacity</Label><Input type="number" min="1" value={form.waitlist_capacity} onChange={(e) => f("waitlist_capacity", e.target.value)} placeholder="Unlimited" /></div>
              )}
              {form.event_type === "team" && (
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Min Roster Size</Label><Input type="number" min="1" value={form.min_roster_size} onChange={(e) => f("min_roster_size", e.target.value)} /></div>
                  <div><Label>Max Roster Size</Label><Input type="number" min="1" value={form.max_roster_size} onChange={(e) => f("max_roster_size", e.target.value)} /></div>
                </div>
              )}
              {form.event_type === "team" && (
                <div><Label>Roster Lock Deadline</Label><Input type="datetime-local" value={form.roster_lock_at} onChange={(e) => f("roster_lock_at", e.target.value)} /></div>
              )}
            </TabsContent>

            {/* Location */}
            <TabsContent value="location" className="space-y-4">
              <div><Label>Venue Name</Label><Input value={form.venue_name} onChange={(e) => f("venue_name", e.target.value)} /></div>
              <div><Label>Display Location</Label><Input value={form.location} onChange={(e) => f("location", e.target.value)} placeholder="e.g. Atlanta, GA" /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => f("address", e.target.value)} /></div>
              <div><Label>Location Notes</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} value={form.location_notes} onChange={(e) => f("location_notes", e.target.value)} placeholder="Parking info, entry instructions..." /></div>
              <div><Label>Google Maps Link</Label><Input value={form.map_link} onChange={(e) => f("map_link", e.target.value)} placeholder="https://maps.google.com/..." /></div>
            </TabsContent>

            {/* Rules */}
            <TabsContent value="rules" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Match Duration (min)</Label><Input type="number" value={form.match_duration} onChange={(e) => f("match_duration", e.target.value)} /></div>
                <div><Label>Target Score (goals)</Label><Input type="number" value={form.target_score} onChange={(e) => f("target_score", e.target.value)} /></div>
              </div>
              <div>
                <Label>Surface Type</Label>
                <Select value={form.surface_type} onValueChange={(v) => f("surface_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select surface" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turf">Turf</SelectItem>
                    <SelectItem value="futsal">Futsal Court</SelectItem>
                    <SelectItem value="street">Street Surface</SelectItem>
                    <SelectItem value="grass">Grass</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Custom Rules Notes</Label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={form.custom_rules_notes} onChange={(e) => f("custom_rules_notes", e.target.value)} placeholder="Additional rules or notes for this event..." />
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full mt-4" onClick={handleSave}>{editingEvent ? "Save Changes" : "Create Event"}</Button>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
