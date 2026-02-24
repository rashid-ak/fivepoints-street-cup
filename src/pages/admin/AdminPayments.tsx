import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, DollarSign } from "lucide-react";

const AdminPayments = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("registrants")
        .select("*, events(title, price)")
        .not("stripe_payment_id", "is", null)
        .order("created_at", { ascending: false });
      setTransactions(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + Number((t.events as any)?.price || 0), 0);
  const refundedCount = transactions.filter((t) => t.payment_status === "refunded").length;

  const exportCSV = () => {
    const headers = ["Event", "Name", "Email", "Amount", "Status", "Stripe ID", "Date"];
    const rows = transactions.map((t) => [
      (t.events as any)?.title || "", t.full_name, t.email,
      Number((t.events as any)?.price || 0), t.payment_status,
      t.stripe_payment_id || "", new Date(t.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payments-export.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Payments</h1>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> Export</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">${totalRevenue}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-3xl font-bold text-foreground">{transactions.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Refunds</p>
              <p className="text-3xl font-bold text-destructive">{refundedCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : transactions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions</TableCell></TableRow>
              ) : transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-foreground">{(t.events as any)?.title || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.email}</TableCell>
                  <TableCell className="text-primary font-medium">${Number((t.events as any)?.price || 0)}</TableCell>
                  <TableCell>
                    <Badge className={
                      t.payment_status === "paid" ? "bg-green-600/20 text-green-400" :
                      t.payment_status === "refunded" ? "bg-blue-600/20 text-blue-400" :
                      "bg-red-600/20 text-red-400"
                    }>{t.payment_status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{t.stripe_payment_id?.slice(0, 20)}...</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
