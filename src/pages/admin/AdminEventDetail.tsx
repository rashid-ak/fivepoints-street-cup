import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Search, CheckCircle2 } from "lucide-react";

const AdminEventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      const [{ data: ev }, { data: regs }] = await Promise.all([
        supabase.from("events").select("*").eq("id", eventId).single(),
        supabase.from("registrants").select("*").eq("event_id", eventId).order("created_at", { ascending: false }),
      ]);
      if (ev) { setEvent(ev); setEmailTemplate((ev as any).email_template || ""); }
      setRegistrants(regs || []);
      setLoading(false);
    };
    load();
  }, [eventId]);

  const filtered = registrants.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  });

  const paidCount = registrants.filter((r) => r.payment_status === "paid").length;
  const checkedInCount = registrants.filter((r) => r.checked_in).length;
  const revenue = paidCount * (event ? Number(event.price) : 0);

  const handleCheckIn = async (id: string, currentVal: boolean) => {
    await supabase.from("registrants").update({
      checked_in: !currentVal,
      checked_in_at: !currentVal ? new Date().toISOString() : null,
    }).eq("id", id);
    setRegistrants((prev) => prev.map((r) => r.id === id ? { ...r, checked_in: !currentVal, checked_in_at: !currentVal ? new Date().toISOString() : null } : r));
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Team", "Status", "Checked In", "Date"];
    const rows = filtered.map((r) => [
      r.full_name, r.email, r.phone || "", r.team_name || "", r.payment_status,
      r.checked_in ? "Yes" : "No", new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c: string) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrants-${eventId}.csv`;
    a.click();
  };

  const saveTemplate = async () => {
    if (!eventId) return;
    setSaving(true);
    await supabase.from("events").update({ email_template: emailTemplate || null }).eq("id", eventId);
    setSaving(false);
    toast({ title: "Template saved" });
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-600/20 text-green-400",
      unpaid: "bg-yellow-600/20 text-yellow-400",
      refunded: "bg-blue-600/20 text-blue-400",
      failed: "bg-red-600/20 text-red-400",
    };
    return <Badge className={colors[status] || "bg-muted text-muted-foreground"}>{status}</Badge>;
  };

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link to="/admin/events" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">{event?.title}</h1>
            <p className="text-sm text-muted-foreground">{event?.date} · {event?.location || "TBD"}</p>
          </div>
          <Badge className={event?.status === "published" ? "bg-green-600/20 text-green-400" : "bg-muted text-muted-foreground"}>
            {event?.status || "draft"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: registrants.length },
            { label: "Paid", value: paidCount },
            { label: "Checked In", value: checkedInCount },
            { label: "Revenue", value: `$${revenue}` },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Export */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search registrants..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> CSV</Button>
        </div>

        {/* Registrants Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">✓</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No registrants</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <button onClick={() => handleCheckIn(r.id, r.checked_in)} className="p-1">
                      <CheckCircle2 className={`w-5 h-5 ${r.checked_in ? "text-green-400" : "text-muted-foreground/30"}`} />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{r.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">{r.phone || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.team_name || "—"}</TableCell>
                  <TableCell>{statusBadge(r.payment_status)}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Email Template */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">Confirmation Email Template</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Custom message for confirmation emails. Leave blank for default.</p>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              placeholder="e.g., Bring your cleats and shin guards!"
            />
            <Button onClick={saveTemplate} disabled={saving}>{saving ? "Saving..." : "Save Template"}</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEventDetail;
