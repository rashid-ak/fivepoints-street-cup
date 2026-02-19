import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EventRow {
  id: string;
  title: string;
  date: string;
  location: string | null;
  price: number;
  capacity: number | null;
  registrant_count: number;
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", description: "", date: "", start_time: "09:00", end_time: "", location: "", price: "0", capacity: "",
  });
  const { toast } = useToast();
  const { signOut } = useAuth();

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

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", start_time: "09:00", end_time: "", location: "", price: "0", capacity: "" });
    setEditingEvent(null);
  };

  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || "",
      date: ev.date,
      start_time: ev.start_time,
      end_time: ev.end_time || "",
      location: ev.location || "",
      price: String(ev.price),
      capacity: ev.capacity ? String(ev.capacity) : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time || null,
      location: form.location || "TBD",
      price: Number(form.price) || 0,
      capacity: form.capacity ? Number(form.capacity) : null,
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

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-1" /> Create Event</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-foreground">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                  <div><label className="text-sm font-medium text-foreground">Description</label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-foreground">Date *</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                    <div><label className="text-sm font-medium text-foreground">Location</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-foreground">Start Time *</label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
                    <div><label className="text-sm font-medium text-foreground">End Time</label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-foreground">Price ($)</label><Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                    <div><label className="text-sm font-medium text-foreground">Capacity</label><Input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Unlimited" /></div>
                  </div>
                  <Button className="w-full" onClick={handleSave}>{editingEvent ? "Save Changes" : "Create Event"}</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : events.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No events yet</TableCell></TableRow>
              ) : events.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell><Link to={`/admin/events/${ev.id}`} className="text-primary hover:underline font-medium">{ev.title}</Link></TableCell>
                  <TableCell className="text-muted-foreground">{ev.date}</TableCell>
                  <TableCell className="text-muted-foreground">{ev.location || "TBD"}</TableCell>
                  <TableCell>{Number(ev.price) === 0 ? <Badge className="bg-green-600/20 text-green-400">Free</Badge> : `$${Number(ev.price)}`}</TableCell>
                  <TableCell className="text-muted-foreground">{ev.capacity || "∞"}</TableCell>
                  <TableCell>{ev.registrant_count}</TableCell>
                  <TableCell className="text-primary font-medium">${ev.registrant_count * Number(ev.price)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(ev)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ev.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/admin/transactions"><Button variant="outline">View Transactions</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
