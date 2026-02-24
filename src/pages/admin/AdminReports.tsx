import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, Download, Users, DollarSign, TrendingUp,
  UserCheck, Percent, CalendarDays,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["hsl(30,100%,55%)", "hsl(48,100%,50%)", "hsl(220,100%,50%)", "hsl(160,60%,45%)", "hsl(0,75%,55%)"];

const AdminReports = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const [evRes, regRes] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: false }),
        supabase.from("registrants").select("*, events(title, price, date)").order("created_at", { ascending: false }),
      ]);
      setEvents(evRes.data || []);
      setRegistrants(regRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = eventFilter === "all"
    ? registrants
    : registrants.filter((r) => r.event_id === eventFilter);

  // Metrics
  const totalRegs = filtered.length;
  const paidRegs = filtered.filter((r) => r.payment_status === "paid");
  const checkedIn = filtered.filter((r) => r.checked_in);
  const totalRevenue = paidRegs.reduce((sum, r) => sum + Number((r.events as any)?.price || 0), 0);
  const refunded = filtered.filter((r) => r.payment_status === "refunded");
  const netRevenue = totalRevenue - refunded.reduce((sum, r) => sum + Number((r.events as any)?.price || 0), 0);

  // Repeat participants
  const emailCounts: Record<string, number> = {};
  registrants.forEach((r) => { emailCounts[r.email] = (emailCounts[r.email] || 0) + 1; });
  const repeatCount = Object.values(emailCounts).filter((c) => c > 1).length;

  // Conversion rate
  const conversionRate = totalRegs > 0 ? Math.round((paidRegs.length / totalRegs) * 100) : 0;

  // Charts data
  const eventBreakdown = events.map((ev) => {
    const evRegs = registrants.filter((r) => r.event_id === ev.id);
    const evPaid = evRegs.filter((r) => r.payment_status === "paid");
    return {
      name: ev.title.length > 20 ? ev.title.slice(0, 20) + "…" : ev.title,
      registrations: evRegs.length,
      revenue: evPaid.reduce((sum, r) => sum + Number((r.events as any)?.price || 0), 0),
      checkins: evRegs.filter((r) => r.checked_in).length,
    };
  }).filter((e) => e.registrations > 0);

  const statusBreakdown = [
    { name: "Paid", value: paidRegs.length },
    { name: "Unpaid", value: filtered.filter((r) => r.payment_status === "unpaid").length },
    { name: "Refunded", value: refunded.length },
  ].filter((s) => s.value > 0);

  // Monthly trend
  const monthlyData: Record<string, { month: string; regs: number; revenue: number }> = {};
  registrants.forEach((r) => {
    const month = new Date(r.created_at).toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthlyData[month]) monthlyData[month] = { month, regs: 0, revenue: 0 };
    monthlyData[month].regs++;
    if (r.payment_status === "paid") monthlyData[month].revenue += Number((r.events as any)?.price || 0);
  });
  const trendData = Object.values(monthlyData).slice(-12);

  // CSV exports
  const exportRoster = () => {
    const headers = ["Name", "Email", "Phone", "Event", "Status", "Checked In", "Team", "Date"];
    const rows = filtered.map((r) => [
      r.full_name, r.email, r.phone || "", (r.events as any)?.title || "",
      r.payment_status, r.checked_in ? "Yes" : "No", r.team_name || "", new Date(r.created_at).toLocaleDateString(),
    ]);
    downloadCSV([headers, ...rows], "roster-export.csv");
  };

  const exportFinancial = () => {
    const headers = ["Event", "Name", "Email", "Amount", "Status", "Stripe ID", "Date"];
    const rows = filtered.filter((r) => r.stripe_payment_id).map((r) => [
      (r.events as any)?.title || "", r.full_name, r.email,
      Number((r.events as any)?.price || 0), r.payment_status,
      r.stripe_payment_id || "", new Date(r.created_at).toLocaleDateString(),
    ]);
    downloadCSV([headers, ...rows], "financial-export.csv");
  };

  const downloadCSV = (data: any[][], filename: string) => {
    const csv = data.map((row) => row.map((c: any) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></AdminLayout>;
  }

  const metricCards = [
    { label: "Total Registrations", value: totalRegs, icon: Users },
    { label: "Checked In", value: checkedIn.length, icon: UserCheck },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Net Revenue", value: `$${netRevenue.toLocaleString()}`, icon: TrendingUp },
    { label: "Refunds", value: refunded.length, icon: DollarSign },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: Percent },
    { label: "Repeat Participants", value: repeatCount, icon: Users },
    { label: "Events", value: events.length, icon: CalendarDays },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-black text-foreground">Reports</h1>
          <div className="flex gap-2 flex-wrap">
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportRoster}>
              <Download className="w-4 h-4 mr-1" /> Roster CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportFinancial}>
              <Download className="w-4 h-4 mr-1" /> Financial CSV
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metricCards.map((m) => (
            <Card key={m.label} className="bg-card border-border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-2xl font-bold text-primary mt-1">{m.value}</p>
                  </div>
                  <m.icon className="h-6 w-6 text-muted-foreground/40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registrations by Event */}
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Registrations by Event</CardTitle></CardHeader>
            <CardContent>
              {eventBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No data</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,20%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(220,5%,65%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220,5%,65%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220,15%,8%)", border: "1px solid hsl(220,10%,20%)", borderRadius: 8, color: "#fff" }} />
                    <Bar dataKey="registrations" fill="hsl(30,100%,55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="checkins" fill="hsl(160,60%,45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Payment Status</CardTitle></CardHeader>
            <CardContent>
              {statusBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No data</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(220,15%,8%)", border: "1px solid hsl(220,10%,20%)", borderRadius: 8, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card className="border-border lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle></CardHeader>
            <CardContent>
              {trendData.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No data</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,20%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(220,5%,65%)", fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fill: "hsl(220,5%,65%)", fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,5%,65%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220,15%,8%)", border: "1px solid hsl(220,10%,20%)", borderRadius: 8, color: "#fff" }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="regs" stroke="hsl(30,100%,55%)" name="Registrations" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(160,60%,45%)" name="Revenue ($)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Event Table */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Event Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Event</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Registrations</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Check-ins</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Attendance %</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {eventBreakdown.map((ev, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground">{ev.name}</td>
                      <td className="py-2 px-3 text-right text-foreground">{ev.registrations}</td>
                      <td className="py-2 px-3 text-right text-foreground">{ev.checkins}</td>
                      <td className="py-2 px-3 text-right">
                        <Badge className={ev.registrations > 0 && ev.checkins / ev.registrations >= 0.7 ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                          {ev.registrations > 0 ? Math.round((ev.checkins / ev.registrations) * 100) : 0}%
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-right text-primary font-medium">${ev.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
