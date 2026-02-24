import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalRegistrations: number;
  revenueThisMonth: number;
  upcomingEvents: number;
  recentRegistrations: any[];
  upcomingEventsList: any[];
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0,
    revenueThisMonth: 0,
    upcomingEvents: 0,
    recentRegistrations: [],
    upcomingEventsList: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [eventsRes, regsRes, recentRegsRes] = await Promise.all([
        supabase.from("events").select("*").gte("date", now.toISOString().split("T")[0]).order("date"),
        supabase.from("registrants").select("*, events(title, price)").gte("created_at", monthStart).eq("payment_status", "paid"),
        supabase.from("registrants").select("*, events(title)").order("created_at", { ascending: false }).limit(5),
      ]);

      const revenue = (regsRes.data || []).reduce((sum, r) => sum + Number((r.events as any)?.price || 0), 0);

      setStats({
        totalRegistrations: (regsRes.data || []).length,
        revenueThisMonth: revenue,
        upcomingEvents: (eventsRes.data || []).length,
        recentRegistrations: recentRegsRes.data || [],
        upcomingEventsList: (eventsRes.data || []).slice(0, 5),
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Registrations This Month", value: stats.totalRegistrations, icon: Users, color: "text-primary" },
    { label: "Revenue This Month", value: `$${stats.revenueThisMonth}`, icon: DollarSign, color: "text-primary" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: CalendarDays, color: "text-primary" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">Overview</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.upcomingEventsList.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingEventsList.map((ev: any) => (
                    <Link key={ev.id} to={`/admin/events/${ev.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-foreground text-sm">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">{ev.date} · {ev.location || "TBD"}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {ev.status === "published" ? "Live" : ev.status || "draft"}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Registrations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentRegistrations.length === 0 ? (
                <p className="text-muted-foreground text-sm">No registrations yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentRegistrations.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground text-sm">{r.full_name}</p>
                        <p className="text-xs text-muted-foreground">{(r.events as any)?.title || "—"}</p>
                      </div>
                      <Badge className={r.payment_status === "paid" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                        {r.payment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
