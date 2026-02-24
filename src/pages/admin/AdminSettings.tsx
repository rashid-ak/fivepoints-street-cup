import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">Settings</h1>

        <div className="grid gap-4">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Integrations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Stripe Payments</p>
                  <p className="text-sm text-muted-foreground">Accept payments via Stripe Checkout</p>
                </div>
                <Badge className="bg-green-600/20 text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Resend Email</p>
                  <p className="text-sm text-muted-foreground">Transactional emails for confirmations & reminders</p>
                </div>
                <Badge className="bg-green-600/20 text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</Badge>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
