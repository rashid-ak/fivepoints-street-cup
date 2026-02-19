import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get all paid registrants with event info
      const { data: regs } = await supabase
        .from("registrants")
        .select("*, events(title, price)")
        .not("stripe_payment_id", "is", null)
        .order("created_at", { ascending: false });
      setTransactions(regs || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => {
    const price = (t.events as any)?.price || 0;
    return sum + Number(price);
  }, 0);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-600/20 text-green-400",
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

        <h1 className="text-3xl font-black text-foreground mb-2">Transactions</h1>
        <p className="text-lg text-primary font-bold mb-8">Total Revenue: ${totalRevenue}</p>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : transactions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions yet</TableCell></TableRow>
              ) : transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-foreground">{(t.events as any)?.title || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.email}</TableCell>
                  <TableCell className="text-primary font-medium">${Number((t.events as any)?.price || 0)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{t.stripe_payment_id?.slice(0, 20)}...</TableCell>
                  <TableCell>{statusBadge(t.payment_status)}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
