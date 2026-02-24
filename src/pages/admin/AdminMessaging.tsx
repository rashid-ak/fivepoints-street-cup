import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, Send, Clock, FileText, Plus, Search, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, Users,
} from "lucide-react";

const AdminMessaging = () => {
  const { toast } = useToast();

  // Compose state
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [recipients, setRecipients] = useState<any[]>([]);

  // Templates state
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: "", subject: "", body_html: "", template_type: "manual" });
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  // Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logSearch, setLogSearch] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [evRes, logRes, tplRes] = await Promise.all([
      supabase.from("events").select("id, title, date").order("date", { ascending: false }),
      supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("email_templates").select("*").order("created_at", { ascending: false }),
    ]);
    setEvents(evRes.data || []);
    setLogs(logRes.data || []);
    setTemplates(tplRes.data || []);
    setLogsLoading(false);
  };

  // Load recipients based on event + audience
  useEffect(() => {
    const loadRecipients = async () => {
      let query = supabase.from("registrants").select("id, full_name, email, payment_status, checked_in, waitlisted, event_id, events(title)");
      if (selectedEvent !== "all") query = query.eq("event_id", selectedEvent);
      if (audience === "paid") query = query.eq("payment_status", "paid");
      else if (audience === "waitlist") query = query.eq("waitlisted", true);
      else if (audience === "checked_in") query = query.eq("checked_in", true);
      const { data } = await query;
      setRecipients(data || []);
    };
    loadRecipients();
  }, [selectedEvent, audience]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Missing fields", description: "Subject and message body are required", variant: "destructive" });
      return;
    }
    if (recipients.length === 0) {
      toast({ title: "No recipients", description: "No participants match this filter", variant: "destructive" });
      return;
    }
    if (!confirm(`Send email to ${recipients.length} recipient(s)?`)) return;

    setSending(true);
    let successCount = 0;
    let failCount = 0;

    for (const r of recipients) {
      try {
        const response = await fetch(
          `https://ifbidnkycpzloiveytke.supabase.co/functions/v1/send-confirmation-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYmlkbmt5Y3B6bG9pdmV5dGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjA3MTcsImV4cCI6MjA3MTM5NjcxN30.yShVKUxop3KKIWYYEkK8yALZJZMMnhLfDIxyjylNi5s",
            },
            body: JSON.stringify({
              emailType: "manual_blast",
              recipientEmail: r.email,
              data: { subject, body, name: r.full_name },
            }),
          }
        );
        if (response.ok) successCount++;
        else failCount++;
      } catch {
        failCount++;
      }
    }

    setSending(false);
    toast({
      title: "Blast complete",
      description: `${successCount} sent, ${failCount} failed`,
    });
    loadAll();
  };

  const saveTemplate = async () => {
    const payload = {
      name: templateForm.name,
      subject: templateForm.subject,
      body_html: templateForm.body_html,
      template_type: templateForm.template_type,
    };
    if (editingTemplate) {
      await supabase.from("email_templates").update(payload).eq("id", editingTemplate.id);
    } else {
      await supabase.from("email_templates").insert(payload);
    }
    setTemplateDialog(false);
    setEditingTemplate(null);
    setTemplateForm({ name: "", subject: "", body_html: "", template_type: "manual" });
    toast({ title: editingTemplate ? "Template updated" : "Template created" });
    loadAll();
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await supabase.from("email_templates").delete().eq("id", id);
    toast({ title: "Template deleted" });
    loadAll();
  };

  const applyTemplate = (tpl: any) => {
    setSubject(tpl.subject);
    setBody(tpl.body_html);
    toast({ title: "Template applied" });
  };

  const statusIcon = (status: string) => {
    if (status === "sent") return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
    if (status === "failed") return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
  };

  const filteredLogs = logs.filter((l) => {
    const q = logSearch.toLowerCase();
    return !q || l.recipient_email.toLowerCase().includes(q) || l.email_type.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">Messaging</h1>

        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="compose"><Send className="w-3.5 h-3.5 mr-1" />Compose</TabsTrigger>
            <TabsTrigger value="templates"><FileText className="w-3.5 h-3.5 mr-1" />Templates</TabsTrigger>
            <TabsTrigger value="logs"><Mail className="w-3.5 h-3.5 mr-1" />Logs</TabsTrigger>
          </TabsList>

          {/* Compose */}
          <TabsContent value="compose" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-border">
                  <CardHeader><CardTitle className="text-base">Compose Email</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Event</Label>
                        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            {events.map((ev) => (
                              <SelectItem key={ev.id} value={ev.id}>{ev.title} ({ev.date})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Audience</Label>
                        <Select value={audience} onValueChange={setAudience}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Registrants</SelectItem>
                            <SelectItem value="paid">Paid Only</SelectItem>
                            <SelectItem value="waitlist">Waitlisted</SelectItem>
                            <SelectItem value="checked_in">Checked In</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject line..." />
                    </div>
                    <div>
                      <Label>Message Body (HTML)</Label>
                      <textarea
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px] font-mono"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="<h1>Hello {{name}}</h1><p>Your message here...</p>"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <Users className="w-3.5 h-3.5 inline mr-1" />
                        {recipients.length} recipient(s)
                      </p>
                      <Button onClick={handleSend} disabled={sending}>
                        {sending ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                        {sending ? "Sending..." : "Send Blast"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Templates */}
              <div className="space-y-4">
                <Card className="border-border">
                  <CardHeader><CardTitle className="text-base">Quick Templates</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {templates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No templates yet</p>
                    ) : templates.slice(0, 5).map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => applyTemplate(tpl)}
                        className="w-full text-left p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{tpl.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{tpl.subject}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader><CardTitle className="text-base">Automated Emails</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {[
                      { name: "Registration Confirmation", status: "active" },
                      { name: "24hr Reminder", status: "active" },
                      { name: "2hr Reminder", status: "planned" },
                      { name: "Waitlist Promotion", status: "active" },
                      { name: "Event Update", status: "active" },
                    ].map((a) => (
                      <div key={a.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <span className="text-foreground">{a.name}</span>
                        <Badge className={a.status === "active" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                          {a.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">{templates.length} template(s)</p>
              <Button size="sm" onClick={() => { setEditingTemplate(null); setTemplateForm({ name: "", subject: "", body_html: "", template_type: "manual" }); setTemplateDialog(true); }}>
                <Plus className="w-4 h-4 mr-1" /> New Template
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((tpl) => (
                <Card key={tpl.id} className="border-border">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{tpl.name}</p>
                        <p className="text-xs text-muted-foreground">{tpl.subject}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{tpl.template_type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-3 font-mono bg-muted/30 rounded p-2">
                      {tpl.body_html?.replace(/<[^>]*>/g, "").slice(0, 120)}...
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => applyTemplate(tpl)}>Use</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditingTemplate(tpl);
                        setTemplateForm({ name: tpl.name, subject: tpl.subject, body_html: tpl.body_html, template_type: tpl.template_type });
                        setTemplateDialog(true);
                      }}>Edit</Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteTemplate(tpl.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="space-y-4 mt-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search logs..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)} />
            </div>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                  ) : filteredLogs.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No email logs</TableCell></TableRow>
                  ) : filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusIcon(log.status)}
                          <span className="text-sm capitalize">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.recipient_email}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{log.email_type}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.sent_at ? new Date(log.sent_at).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="text-destructive text-xs max-w-[200px] truncate">{log.error_message || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Dialog */}
      <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "New Template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} /></div>
            <div><Label>Subject</Label><Input value={templateForm.subject} onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={templateForm.template_type} onValueChange={(v) => setTemplateForm({ ...templateForm, template_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="confirmation">Confirmation</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="update">Event Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body (HTML)</Label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px] font-mono"
                value={templateForm.body_html}
                onChange={(e) => setTemplateForm({ ...templateForm, body_html: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={saveTemplate}>
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessaging;
