import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, RefreshCw, Send, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailLog {
  id: string;
  recipient_email: string;
  email_type: string;
  status: string;
  error_message?: string;
  sent_at?: string;
  retry_count: number;
  created_at: string;
}

interface WebhookLog {
  id: string;
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  error_message?: string;
  created_at: string;
}

export const DiagnosticsTab = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-diagnostics', {
        body: { action: "get_logs" }
      });

      if (error) throw error;

      setEmailLogs(data.emailLogs || []);
      setWebhookLogs(data.webhookLogs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const runTest = async (testType: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-diagnostics', {
        body: { action: testType }
      });

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        [testType]: { success: true, message: data.message }
      }));

      // Refresh logs after test
      setTimeout(loadLogs, 1000);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testType]: { success: false, message: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async (emailLogId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-diagnostics', {
        body: { action: "resend_email", emailLogId }
      });

      if (error) throw error;

      // Refresh logs
      loadLogs();
    } catch (error) {
      console.error('Failed to resend email:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, processed?: boolean) => {
    if (processed === false) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    if (processed === true) {
      return <Badge variant="default">Processed</Badge>;
    }
    switch (status) {
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Diagnostics</h2>
        <Button onClick={loadLogs} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>System Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button 
                onClick={() => runTest('test_rsvp')} 
                disabled={loading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Run Test RSVP
              </Button>
              {testResults.test_rsvp && (
                <Alert>
                  {testResults.test_rsvp.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {testResults.test_rsvp.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => runTest('test_team')} 
                disabled={loading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Run Test Team (No Charge)
              </Button>
              {testResults.test_team && (
                <Alert>
                  {testResults.test_team.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {testResults.test_team.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Test emails will be sent to media@akanni.marketing to verify the email integration is working properly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email Logs ({emailLogs.length})</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Logs ({webhookLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs (Last 50)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No email logs found</p>
                ) : (
                  emailLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(log.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.recipient_email}</span>
                            {getStatusBadge(log.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.email_type} • {new Date(log.created_at).toLocaleString()}
                            {log.retry_count > 0 && ` • ${log.retry_count} retries`}
                          </div>
                          {log.error_message && (
                            <div className="text-sm text-red-600 mt-1">{log.error_message}</div>
                          )}
                        </div>
                      </div>
                      {log.status === 'failed' && (
                        <Button 
                          onClick={() => resendEmail(log.id)} 
                          variant="outline" 
                          size="sm"
                        >
                          Resend
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Logs (Last 20)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhookLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No webhook logs found</p>
                ) : (
                  webhookLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {log.processed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.event_type}</span>
                            {getStatusBadge('', log.processed)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.stripe_event_id} • {new Date(log.created_at).toLocaleString()}
                          </div>
                          {log.error_message && (
                            <div className="text-sm text-red-600 mt-1">{log.error_message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};