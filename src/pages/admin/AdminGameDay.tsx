import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  QrCode, UserCheck, Search, Lock, UserPlus, Users,
  CheckCircle2, XCircle, RefreshCw, Clock, ScanLine,
} from "lucide-react";

const AdminGameDay = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Walk-up registration
  const [walkUpOpen, setWalkUpOpen] = useState(false);
  const [walkUpForm, setWalkUpForm] = useState({ full_name: "", email: "", phone: "" });
  const [walkUpEnabled, setWalkUpEnabled] = useState(true);

  // QR scanner
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const scanRef = useRef<HTMLInputElement>(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, remaining: 0, walkUps: 0 });

  useEffect(() => {
    const loadEvents = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("events").select("*")
        .gte("date", today).eq("status", "published").order("date");
      const allEvents = data || [];
      setEvents(allEvents);
      if (allEvents.length > 0) setSelectedEvent(allEvents[0].id);
      setLoading(false);
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    loadRegistrants();
  }, [selectedEvent]);

  const loadRegistrants = async () => {
    const { data } = await supabase.from("registrants").select("*")
      .eq("event_id", selectedEvent).order("full_name");
    const regs = data || [];
    setRegistrants(regs);
    const checkedIn = regs.filter((r) => r.checked_in).length;
    setStats({
      total: regs.length,
      checkedIn,
      remaining: regs.length - checkedIn,
      walkUps: regs.filter((r) => r.payment_status === "walk-up").length,
    });
  };

  const toggleCheckIn = async (reg: any) => {
    const newCheckedIn = !reg.checked_in;
    await supabase.from("registrants").update({
      checked_in: newCheckedIn,
      checked_in_at: newCheckedIn ? new Date().toISOString() : null,
    }).eq("id", reg.id);
    toast({ title: newCheckedIn ? `${reg.full_name} checked in ✓` : `${reg.full_name} check-in removed` });
    loadRegistrants();
  };

  const handleWalkUp = async () => {
    if (!walkUpForm.full_name.trim() || !walkUpForm.email.trim()) {
      toast({ title: "Name and email required", variant: "destructive" });
      return;
    }
    // Check duplicate
    const existing = registrants.find((r) =>
      r.email.toLowerCase() === walkUpForm.email.toLowerCase()
    );
    if (existing) {
      toast({ title: "Already registered", description: `${existing.full_name} is already on the roster`, variant: "destructive" });
      return;
    }

    await supabase.from("registrants").insert({
      event_id: selectedEvent,
      full_name: walkUpForm.full_name,
      email: walkUpForm.email,
      phone: walkUpForm.phone || null,
      payment_status: "walk-up",
      checked_in: true,
      checked_in_at: new Date().toISOString(),
      waiver_accepted: true,
      source: "walkup",
    });

    toast({ title: `${walkUpForm.full_name} added & checked in` });
    setWalkUpForm({ full_name: "", email: "", phone: "" });
    setWalkUpOpen(false);
    loadRegistrants();
  };

  const handleQrScan = async () => {
    const input = scanInput.trim().toLowerCase();
    if (!input) return;

    // Try to match by email, ID, or check_in_code
    const match = registrants.find((r: any) =>
      r.email.toLowerCase() === input || r.id === input || r.check_in_code === scanInput.trim()
    );

    if (match) {
      if (match.checked_in) {
        toast({ title: "Already checked in", description: match.full_name });
      } else {
        await supabase.from("registrants").update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        }).eq("id", match.id);
        toast({ title: `${match.full_name} checked in ✓` });
        loadRegistrants();
      }
    } else {
      toast({ title: "Not found", description: "No matching registration found", variant: "destructive" });
    }
    setScanInput("");
    scanRef.current?.focus();
  };

  const lockRoster = async () => {
    if (!confirm("Lock the roster? This will close registration for this event.")) return;
    await supabase.from("events").update({ status: "closed" }).eq("id", selectedEvent);
    toast({ title: "Roster locked — registration closed" });
  };

  const filtered = registrants.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  });

  const paidOnly = filtered.filter((r) => r.payment_status === "paid" || r.payment_status === "walk-up");
  const selectedEventData = events.find((e) => e.id === selectedEvent);

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-black text-foreground">Game Day</h1>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={ev.id}>{ev.title} — {ev.date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedEvent ? (
          <Card className="border-border"><CardContent className="py-12 text-center text-muted-foreground">Select an event to begin game day operations</CardContent></Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Roster", value: stats.total, icon: Users },
                { label: "Checked In", value: stats.checkedIn, icon: CheckCircle2 },
                { label: "Remaining", value: stats.remaining, icon: Clock },
                { label: "Walk-ups", value: stats.walkUps, icon: UserPlus },
              ].map((s) => (
                <Card key={s.label} className="bg-card border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-3xl font-bold text-primary mt-1">{s.value}</p>
                      </div>
                      <s.icon className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Check-in Progress</p>
                  <p className="text-sm font-medium text-foreground">
                    {stats.checkedIn}/{stats.total} ({stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%)
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.checkedIn / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => setScannerOpen(true)}>
                <ScanLine className="w-4 h-4 mr-1" /> QR Check-in
              </Button>
              <Button variant="outline" onClick={() => setWalkUpOpen(true)} disabled={!walkUpEnabled}>
                <UserPlus className="w-4 h-4 mr-1" /> Walk-up Registration
              </Button>
              <Button variant="outline" onClick={lockRoster}>
                <Lock className="w-4 h-4 mr-1" /> Lock Roster
              </Button>
              <Button variant="ghost" onClick={loadRegistrants}>
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Switch checked={walkUpEnabled} onCheckedChange={setWalkUpEnabled} id="walkup-toggle" />
                <Label htmlFor="walkup-toggle" className="text-sm">Allow Walk-ups</Label>
              </div>
            </div>

            {/* Roster */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Roster</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10 h-8" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {filtered.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">No registrants</p>
                  ) : filtered.map((r) => (
                    <div key={r.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                        r.checked_in ? "bg-green-600/10 border border-green-600/20" : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => toggleCheckIn(r)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          r.checked_in ? "bg-green-600/20" : "bg-muted"
                        }`}>
                          {r.checked_in ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{r.full_name}</p>
                          <p className="text-xs text-muted-foreground">{r.email} {r.team_name ? `· ${r.team_name}` : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          r.payment_status === "paid" ? "bg-green-600/20 text-green-400" :
                          r.payment_status === "walk-up" ? "bg-blue-600/20 text-blue-400" :
                          "bg-yellow-600/20 text-yellow-400"
                        }>{r.payment_status}</Badge>
                        {r.checked_in && r.checked_in_at && (
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(r.checked_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* QR Scanner Dialog */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-primary" /> QR Check-in Scanner
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Scan a QR code or manually enter a participant's email or registration ID.
            </p>
            <div className="flex gap-2">
              <Input
                ref={scanRef}
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan or type email / ID..."
                onKeyDown={(e) => e.key === "Enter" && handleQrScan()}
                autoFocus
                className="font-mono"
              />
              <Button onClick={handleQrScan}>
                <UserCheck className="w-4 h-4 mr-1" /> Check In
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <QrCode className="w-16 h-16 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">Point your scanner at a QR code — it will auto-fill the field above</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Walk-up Registration Dialog */}
      <Dialog open={walkUpOpen} onOpenChange={setWalkUpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Walk-up Registration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={walkUpForm.full_name} onChange={(e) => setWalkUpForm({ ...walkUpForm, full_name: e.target.value })} /></div>
            <div><Label>Email *</Label><Input type="email" value={walkUpForm.email} onChange={(e) => setWalkUpForm({ ...walkUpForm, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={walkUpForm.phone} onChange={(e) => setWalkUpForm({ ...walkUpForm, phone: e.target.value })} /></div>
            <Button className="w-full" onClick={handleWalkUp}>
              <UserPlus className="w-4 h-4 mr-1" /> Register & Check In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminGameDay;
