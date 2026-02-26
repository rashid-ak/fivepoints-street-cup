import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Shield, Loader2, Clock } from "lucide-react";

const AdminSettings = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      // Check env vars via edge function
      const { data } = await supabase.functions.invoke("admin-diagnostics");

      // Get last webhook
      const { data: lastWebhook } = await supabase
        .from("webhook_logs")
        .select("created_at, event_type, processed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get last scheduled job
      const { data: lastJob } = await supabase
        .from("scheduled_jobs")
        .select("created_at, status, job_type")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get scheduled jobs stats
      const { count: pendingJobs } = await supabase
        .from("scheduled_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled");

      const { count: failedJobs } = await supabase
        .from("scheduled_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "failed");

      setDiagnostics({
        envVars: data || {},
        lastWebhook,
        lastJob,
        pendingJobs: pendingJobs || 0,
        failedJobs: failedJobs || 0,
      });
    } catch (err) {
      console.error("Diagnostics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDiagnostics(); }, []);

  const EnvBadge = ({ exists }: { exists: boolean }) => (
    <Badge className={exists ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}>
      {exists ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Set</> : <><XCircle className="w-3 h-3 mr-1" /> Missing</>}
    </Badge>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Settings</h1>
          <Button variant="ghost" size="sm" onClick={loadDiagnostics} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />} Refresh
          </Button>
        </div>

        {/* Integrations */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Stripe Payments", desc: "Accept payments via Stripe Checkout" },
              { name: "Resend Email", desc: "Transactional emails for confirmations & reminders" },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{integration.name}</p>
                  <p className="text-sm text-muted-foreground">{integration.desc}</p>
                </div>
                <Badge className="bg-green-600/20 text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Roles */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">Roles & Permissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { role: "admin", desc: "Full access to all features" },
                { role: "event_staff", desc: "View events, participants, and check-in" },
                { role: "finance", desc: "View payments and issue refunds" },
                { role: "content_manager", desc: "Manage media and homepage modules" },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground capitalize">{r.role.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{r.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification / Diagnostics Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> System Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading diagnostics...</div>
            ) : diagnostics ? (
              <>
                {/* Environment Variables */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Environment Variables</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: "SUPABASE_URL", exists: diagnostics.envVars?.supabase_url },
                      { key: "SUPABASE_SERVICE_ROLE_KEY", exists: diagnostics.envVars?.supabase_service_role },
                      { key: "STRIPE_SECRET_KEY", exists: diagnostics.envVars?.stripe_key },
                      { key: "STRIPE_WEBHOOK_SECRET", exists: diagnostics.envVars?.webhook_secret },
                      { key: "RESEND_API_KEY", exists: diagnostics.envVars?.resend_key },
                    ].map((v) => (
                      <div key={v.key} className="flex items-center justify-between p-2 rounded bg-muted/20">
                        <span className="text-xs font-mono text-muted-foreground">{v.key}</span>
                        <EnvBadge exists={!!v.exists} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Webhook */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Last Webhook Received</p>
                  {diagnostics.lastWebhook ? (
                    <div className="flex items-center gap-3 p-2 rounded bg-muted/20">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-foreground">{diagnostics.lastWebhook.event_type}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(diagnostics.lastWebhook.created_at).toLocaleString()}</p>
                      </div>
                      <Badge className={diagnostics.lastWebhook.processed ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                        {diagnostics.lastWebhook.processed ? "Processed" : "Pending"}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground p-2">No webhooks received yet</p>
                  )}
                </div>

                {/* Scheduled Jobs */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Scheduled Jobs</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
                      <span className="text-xs text-muted-foreground">Pending:</span>
                      <span className="text-sm font-medium text-foreground">{diagnostics.pendingJobs}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
                      <span className="text-xs text-muted-foreground">Failed:</span>
                      <span className="text-sm font-medium text-destructive">{diagnostics.failedJobs}</span>
                    </div>
                    {diagnostics.lastJob && (
                      <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
                        <span className="text-xs text-muted-foreground">Last run:</span>
                        <span className="text-[10px] text-foreground">{new Date(diagnostics.lastJob.created_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to load diagnostics</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
