import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Search } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";

const AdminRegistrants = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const fetch = async () => {
      const { data: ev } = await supabase.from("events").select("*").eq("id", eventId).single();
      if (ev) {
        setEvent(ev);
        setEmailTemplate((ev as any).email_template || "");
      }
      const { data: regs } = await supabase.from("registrants").select("*").eq("event_id", eventId).order("created_at", { ascending: false });
      setRegistrants(regs || []);
      setLoading(false);
    };
    fetch();
  }, [eventId]);

  const filtered = registrants.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.payment_status || "").toLowerCase().includes(q);
  });

  const paidCount = registrants.filter((r) => r.payment_status === "paid").length;
  const revenue = paidCount * (event ? Number(event.price) : 0);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Team", "Status", "Stripe ID", "Date"];
    const rows = filtered.map((r) => [
      r.full_name, r.email, r.phone || "", r.team_name || "", r.payment_status,
      r.stripe_payment_id || "", new Date(r.created_at).toLocaleDateString(),
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

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Link to="/admin" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-black text-foreground mb-2">{event?.title || "Event"} — Registrants</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{registrants.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-primary">{paidCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold text-primary">${revenue}</p>
          </div>
        </div>

        {/* Search + Export */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by name, email, or status..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> CSV</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No registrants</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">{r.phone || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.team_name || "—"}</TableCell>
                  <TableCell>{statusBadge(r.payment_status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{r.stripe_payment_id ? r.stripe_payment_id.slice(0, 16) + "..." : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Email template editor */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">Confirmation Email Template</h2>
          <p className="text-sm text-muted-foreground mb-4">Custom message to include in the confirmation email for this event. Leave blank for default.</p>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            value={emailTemplate}
            onChange={(e) => setEmailTemplate(e.target.value)}
            placeholder="e.g., Bring your cleats and shin guards! Parking available on-site."
          />
          <Button className="mt-2" onClick={saveTemplate} disabled={saving}>
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrants;
