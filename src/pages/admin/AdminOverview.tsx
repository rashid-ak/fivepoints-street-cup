import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays, Users, DollarSign, TrendingUp, AlertTriangle,
  ChevronRight, Clock, Calendar as CalendarIcon, List, LayoutGrid,
} from "lucide-react";

interface Stats {
  totalRegistrations: number;
  revenueThisMonth: number;
  upcomingEvents: number;
  recentRegistrations: any[];
  upcomingEventsList: any[];
  attentionEvents: any[];
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-600/20 text-green-400",
  sold_out: "bg-yellow-600/20 text-yellow-400",
  closed: "bg-red-600/20 text-red-400",
  completed: "bg-blue-600/20 text-blue-400",
  cancelled: "bg-red-600/20 text-red-400",
};

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0, revenueThisMonth: 0, upcomingEvents: 0,
    recentRegistrations: [], upcomingEventsList: [], attentionEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [calView, setCalView] = useState<"list" | "week" | "month">("list");

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const todayStr = now.toISOString().split("T")[0];

      const [eventsRes, regsRes, recentRegsRes, allEventsRes] = await Promise.all([
        supabase.from("events").select("*").gte("date", todayStr).order("date"),
        supabase.from("registrants").select("*, events(title, price)").gte("created_at", monthStart).eq("payment_status", "paid"),
        supabase.from("registrants").select("*, events(title)").order("created_at", { ascending: false }).limit(8),
        supabase.from("events").select("*").order("date", { ascending: false }),
      ]);

      const revenue = (regsRes.data || []).reduce((sum, r) => sum + Number((r.events as any)?.price || 0), 0);

      // Events needing attention: draft, or upcoming with low registrations
      const attention = (allEventsRes.data || []).filter((ev: any) => {
        if (ev.status === "draft") return true;
        if (ev.date >= todayStr && ev.capacity && ev.status === "published") return true;
        return false;
      }).slice(0, 5);

      setStats({
        totalRegistrations: (regsRes.data || []).length,
        revenueThisMonth: revenue,
        upcomingEvents: (eventsRes.data || []).length,
        recentRegistrations: recentRegsRes.data || [],
        upcomingEventsList: (eventsRes.data || []).slice(0, 8),
        attentionEvents: attention,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Calendar helpers
  const getWeekDays = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const getMonthDays = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDay = start.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) days.push(null);
    for (let d = 1; d <= end.getDate(); d++) days.push(new Date(now.getFullYear(), now.getMonth(), d));
    return days;
  };

  const eventsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return stats.upcomingEventsList.filter((ev: any) => ev.date === dateStr);
  };

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const statCards = [
    { label: "Registrations This Month", value: stats.totalRegistrations, icon: Users, trend: "+12%" },
    { label: "Revenue This Month", value: `$${stats.revenueThisMonth.toLocaleString()}`, icon: DollarSign, trend: "" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: CalendarDays, trend: "" },
    { label: "Needs Attention", value: stats.attentionEvents.length, icon: AlertTriangle, trend: "" },
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Overview</h1>
          <div className="flex gap-2">
            <Link to="/admin/events?create=true">
              <Button size="sm">Create Event</Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold text-primary mt-1">{s.value}</p>
                    {s.trend && <p className="text-xs text-green-400 mt-1">{s.trend}</p>}
                  </div>
                  <s.icon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar View */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" /> Event Calendar
            </CardTitle>
            <div className="flex gap-1">
              {(["list", "week", "month"] as const).map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={calView === v ? "default" : "ghost"}
                  onClick={() => setCalView(v)}
                  className="h-7 text-xs capitalize"
                >
                  {v === "list" ? <List className="w-3.5 h-3.5 mr-1" /> :
                   v === "week" ? <LayoutGrid className="w-3.5 h-3.5 mr-1" /> :
                   <CalendarIcon className="w-3.5 h-3.5 mr-1" />}
                  {v}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {calView === "list" && (
              <div className="space-y-2">
                {stats.upcomingEventsList.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">No upcoming events</p>
                ) : stats.upcomingEventsList.map((ev: any) => (
                  <Link key={ev.id} to={`/admin/events/${ev.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">{ev.date} · {ev.start_time} · {ev.location || "TBD"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[ev.status] || statusColors.draft}>{ev.status}</Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {calView === "week" && (
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays().map((day, i) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayEvents = eventsOnDate(day);
                  return (
                    <div key={i} className={`min-h-[100px] rounded-lg p-2 ${isToday ? "bg-primary/10 border border-primary/30" : "bg-muted/20"}`}>
                      <p className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                        {dayNames[i]} {day.getDate()}
                      </p>
                      {dayEvents.map((ev: any) => (
                        <Link key={ev.id} to={`/admin/events/${ev.id}`}
                          className="block text-[10px] bg-primary/20 text-primary rounded px-1.5 py-0.5 mb-1 truncate hover:bg-primary/30">
                          {ev.title}
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {calView === "month" && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((d) => (
                    <p key={d} className="text-[10px] text-muted-foreground text-center font-medium py-1">{d}</p>
                  ))}
                  {getMonthDays().map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} />;
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayEvents = eventsOnDate(day);
                    return (
                      <div key={i} className={`min-h-[60px] rounded p-1 text-xs ${isToday ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"}`}>
                        <p className={`text-[10px] ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day.getDate()}</p>
                        {dayEvents.slice(0, 2).map((ev: any) => (
                          <Link key={ev.id} to={`/admin/events/${ev.id}`}
                            className="block text-[9px] bg-primary/20 text-primary rounded px-1 py-0.5 mt-0.5 truncate">
                            {ev.title}
                          </Link>
                        ))}
                        {dayEvents.length > 2 && <p className="text-[9px] text-muted-foreground mt-0.5">+{dayEvents.length - 2}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Needs Attention */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" /> Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.attentionEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">Everything looks good! 🎉</p>
              ) : (
                <div className="space-y-2">
                  {stats.attentionEvents.map((ev: any) => (
                    <Link key={ev.id} to={`/admin/events/${ev.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-foreground text-sm">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {ev.status === "draft" ? "Still in draft — publish to open registration" : `${ev.date} · Capacity: ${ev.capacity || "∞"}`}
                        </p>
                      </div>
                      <Badge className={statusColors[ev.status] || statusColors.draft}>{ev.status}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Registrations */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Recent Registrations</CardTitle>
              <Link to="/admin/participants">
                <Button variant="ghost" size="sm" className="text-xs">View All <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              {stats.recentRegistrations.length === 0 ? (
                <p className="text-muted-foreground text-sm">No registrations yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentRegistrations.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {r.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{r.full_name}</p>
                          <p className="text-xs text-muted-foreground">{(r.events as any)?.title || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={r.payment_status === "paid" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                          {r.payment_status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
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
