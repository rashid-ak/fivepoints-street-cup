import AdminLayout from "@/components/admin/AdminLayout";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">Reports</h1>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Reports are coming soon. You'll be able to view registration trends, revenue breakdowns, and event performance analytics here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
