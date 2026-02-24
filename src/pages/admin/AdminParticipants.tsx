import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download } from "lucide-react";

const AdminParticipants = () => {
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("registrants")
        .select("*, events(title)")
        .order("created_at", { ascending: false });
      setRegistrants(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = registrants.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || ((r.events as any)?.title || "").toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Event", "Status", "Checked In", "Date"];
    const rows = filtered.map((r) => [
      r.full_name, r.email, r.phone || "", (r.events as any)?.title || "", r.payment_status,
      r.checked_in ? "Yes" : "No", new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c: string) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "all-participants.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">Participants</h1>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by name, email, event..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checked In</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No participants</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">{(r.events as any)?.title || "—"}</TableCell>
                  <TableCell>
                    <Badge className={r.payment_status === "paid" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                      {r.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={r.checked_in ? "bg-green-600/20 text-green-400" : "bg-muted text-muted-foreground"}>
                      {r.checked_in ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminParticipants;
