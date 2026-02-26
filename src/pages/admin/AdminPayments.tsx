import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, DollarSign, RefreshCw, Search, Undo2, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-green-600/20 text-green-400",
  requires_payment: "bg-yellow-600/20 text-yellow-400",
  failed: "bg-red-600/20 text-red-400",
  refunded: "bg-blue-600/20 text-blue-400",
  partially_refunded: "bg-purple-600/20 text-purple-400",
};

const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Refund modal
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundPayment, setRefundPayment] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  const loadPayments = async () => {
    setLoading(true);
    // Load from payments table, fall back to registrants for legacy data
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*, registrants(full_name, email, phone), events(title, price)")
      .order("created_at", { ascending: false });

    // Also load legacy registrants with stripe_payment_id but no payments record
    const { data: legacyRegs } = await supabase
      .from("registrants")
      .select("*, events(title, price)")
      .not("stripe_payment_id", "is", null)
      .order("created_at", { ascending: false });

    const paymentsList = paymentData || [];
    
    // Add legacy registrants that don't have a payments record
    const existingRegIds = new Set(paymentsList.map((p: any) => p.registration_id).filter(Boolean));
    const legacyPayments = (legacyRegs || [])
      .filter((r: any) => !existingRegIds.has(r.id))
      .map((r: any) => ({
        id: `legacy-${r.id}`,
        registration_id: r.id,
        event_id: r.event_id,
        stripe_payment_intent_id: r.stripe_payment_id,
        amount_cents: Math.round(Number((r.events as any)?.price || 0) * 100),
        status: r.payment_status === "paid" ? "paid" : r.payment_status,
        refunded_cents: 0,
        created_at: r.created_at,
        registrants: { full_name: r.full_name, email: r.email, phone: r.phone },
        events: r.events,
        _legacy: true,
      }));

    setPayments([...paymentsList, ...legacyPayments]);
    setLoading(false);
  };

  useEffect(() => { loadPayments(); }, []);

  const totalRevenue = payments.filter(p => p.status === "paid" || p.status === "partially_refunded")
    .reduce((sum, p) => sum + (p.amount_cents - p.refunded_cents), 0);
  const totalRefunded = payments.reduce((sum, p) => sum + (p.refunded_cents || 0), 0);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const name = (p.registrants as any)?.full_name || "";
    const email = (p.registrants as any)?.email || "";
    const event = (p.events as any)?.title || "";
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || event.toLowerCase().includes(q);
  });

  const openRefundModal = (payment: any) => {
    setRefundPayment(payment);
    setRefundAmount(((payment.amount_cents - payment.refunded_cents) / 100).toFixed(2));
    setRefundReason("");
    setRefundOpen(true);
  };

  const handleRefund = async () => {
    if (!refundPayment) return;
    setRefundLoading(true);
    try {
      const amountCents = Math.round(parseFloat(refundAmount) * 100);
      if (isNaN(amountCents) || amountCents <= 0) throw new Error("Invalid amount");
      
      const maxRefundable = refundPayment.amount_cents - refundPayment.refunded_cents;
      if (amountCents > maxRefundable) throw new Error(`Max refundable: $${(maxRefundable / 100).toFixed(2)}`);

      const { data, error } = await supabase.functions.invoke("issue-refund", {
        body: { paymentId: refundPayment.id, amountCents, reason: refundReason },
      });

      if (error || data?.error) throw new Error(data?.error || error?.message);

      toast({ title: "Refund issued", description: `$${(amountCents / 100).toFixed(2)} refunded successfully` });
      setRefundOpen(false);
      loadPayments();
    } catch (err: any) {
      toast({ title: "Refund failed", description: err.message, variant: "destructive" });
    } finally {
      setRefundLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Event", "Name", "Email", "Amount", "Refunded", "Status", "Stripe PI", "Date"];
    const rows = payments.map((p) => [
      (p.events as any)?.title || "",
      (p.registrants as any)?.full_name || "",
      (p.registrants as any)?.email || "",
      (p.amount_cents / 100).toFixed(2),
      (p.refunded_cents / 100).toFixed(2),
      p.status,
      p.stripe_payment_intent_id || "",
      new Date(p.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c: any) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payments-export.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-black text-foreground">Payments</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={loadPayments}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border"><CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Revenue</p>
            <p className="text-3xl font-bold text-primary">${(totalRevenue / 100).toFixed(2)}</p>
          </CardContent></Card>
          <Card className="bg-card border-border"><CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-3xl font-bold text-foreground">{payments.length}</p>
          </CardContent></Card>
          <Card className="bg-card border-border"><CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Refunded</p>
            <p className="text-3xl font-bold text-destructive">${(totalRefunded / 100).toFixed(2)}</p>
          </CardContent></Card>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search by name, email, event..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Refunded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payments</TableCell></TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{(p.events as any)?.title || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{(p.registrants as any)?.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{(p.registrants as any)?.email || "—"}</TableCell>
                  <TableCell className="text-primary font-medium">${(p.amount_cents / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.refunded_cents > 0 ? `$${(p.refunded_cents / 100).toFixed(2)}` : "—"}</TableCell>
                  <TableCell><Badge className={statusColors[p.status] || "bg-muted text-muted-foreground"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {(p.status === "paid" || p.status === "partially_refunded") && !p._legacy && (
                      <Button variant="ghost" size="sm" onClick={() => openRefundModal(p)} className="text-xs">
                        <Undo2 className="w-3 h-3 mr-1" /> Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Refund Modal */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
          </DialogHeader>
          {refundPayment && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-foreground font-medium">Event:</span> <span className="text-muted-foreground">{(refundPayment.events as any)?.title}</span></p>
                <p><span className="text-foreground font-medium">Registrant:</span> <span className="text-muted-foreground">{(refundPayment.registrants as any)?.full_name}</span></p>
                <p><span className="text-foreground font-medium">Original:</span> <span className="text-muted-foreground">${(refundPayment.amount_cents / 100).toFixed(2)}</span></p>
                {refundPayment.refunded_cents > 0 && (
                  <p><span className="text-foreground font-medium">Already refunded:</span> <span className="text-muted-foreground">${(refundPayment.refunded_cents / 100).toFixed(2)}</span></p>
                )}
              </div>
              <div>
                <Label>Refund Amount ($)</Label>
                <Input type="number" step="0.01" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Max: ${((refundPayment.amount_cents - refundPayment.refunded_cents) / 100).toFixed(2)}</p>
              </div>
              <div>
                <Label>Reason (optional)</Label>
                <Textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason for refund..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund} disabled={refundLoading}>
              {refundLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Undo2 className="w-4 h-4 mr-1" />}
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPayments;
