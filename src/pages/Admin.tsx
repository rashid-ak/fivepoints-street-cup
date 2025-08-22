import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, UserCheck, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DiagnosticsTab } from "@/components/DiagnosticsTab";

interface Team {
  id: string;
  team_name: string;
  captain_name: string;
  captain_email: string;
  captain_phone: string;
  players: string[];
  skill_level: string;
  payment_status: string;
  created_at: string;
}

interface RSVP {
  id: string;
  full_name: string;
  email: string;
  zip_code: string;
  party_size: number;
  created_at: string;
}

interface AdminSettings {
  id: string;
  team_entry_price: number;
  event_date: string;
  event_time: string;
  email_sender_name: string;
  email_sender_email: string;
}

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("teams");
  const { toast } = useToast();

  useEffect(() => {
    // Check if we should navigate to diagnostics tab
    if (location.hash === "#diagnostics" && isAuthenticated) {
      setActiveTab("diagnostics");
    }
  }, [location.hash, isAuthenticated]);

  useEffect(() => {
    // Check for existing session
    const sessionToken = localStorage.getItem("admin_session");
    if (sessionToken) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { password }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem("admin_session", data.sessionToken);
        setIsAuthenticated(true);
        await loadData();
        toast({
          title: "Success",
          description: "Admin login successful",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load teams
      const { data: teamsData } = await supabase.functions.invoke('admin-data', {
        body: { table: 'teams' }
      });

      if (teamsData?.teams) {
        setTeams(teamsData.teams);
      }

      // Load RSVPs
      const { data: rsvpData } = await supabase.functions.invoke('admin-data', {
        body: { table: 'rsvps' }
      });
      if (rsvpData?.rsvps) {
        setRSVPs(rsvpData.rsvps);
      }

      // Load settings
      const { data: settingsData } = await supabase.functions.invoke('admin-data', {
        body: { table: 'settings' }
      });
      if (settingsData?.settings) {
        setSettings(settingsData.settings);
      }

    } catch (error) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStatus = async (teamId: string, paymentStatus: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'update-team-status',
          teamId,
          paymentStatus
        }
      });

      if (error) throw error;

      setTeams(teams.map(team => 
        team.id === teamId ? { ...team, payment_status: paymentStatus } : team
      ));

      toast({
        title: "Success",
        description: "Team payment status updated",
      });
    } catch (error) {
      console.error('Update team status error:', error);
      toast({
        title: "Error",
        description: "Failed to update team status",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-black">ADMIN ACCESS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              variant="cta"
              disabled={loading || !password}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Default password: changeme
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paidTeams = teams.filter(team => team.payment_status === 'paid');
  const unpaidTeams = teams.filter(team => team.payment_status === 'unpaid');
  const totalRevenue = paidTeams.length * (settings?.team_entry_price || 7500);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">5 POINTS CUP ADMIN</h1>
            <p className="text-muted-foreground">Tournament management dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Teams</p>
                  <p className="text-2xl font-bold text-accent">{paidTeams.length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total RSVPs</p>
                  <p className="text-2xl font-bold">{rsvps.length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-accent">${(totalRevenue / 100).toFixed(0)}</p>
                </div>
                <Settings className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs ({rsvps.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Team Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Captain</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.team_name}</TableCell>
                        <TableCell>{team.captain_name}</TableCell>
                        <TableCell>{team.captain_email}</TableCell>
                        <TableCell>{team.captain_phone}</TableCell>
                        <TableCell>{team.skill_level}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={team.payment_status === 'paid' ? 'default' : 'secondary'}
                            className={team.payment_status === 'paid' ? 'bg-accent' : ''}
                          >
                            {team.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {team.players.length > 0 ? team.players.join(', ') : 'None'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {team.payment_status !== 'paid' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTeamStatus(team.id, 'paid')}
                              >
                                Mark Paid
                              </Button>
                            )}
                            {team.payment_status === 'paid' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTeamStatus(team.id, 'unpaid')}
                              >
                                Mark Unpaid
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsvps">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Spectator RSVPs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Zip Code</TableHead>
                      <TableHead>Party Size</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvps.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.full_name}</TableCell>
                        <TableCell>{rsvp.email}</TableCell>
                        <TableCell>{rsvp.zip_code || 'N/A'}</TableCell>
                        <TableCell>{rsvp.party_size}</TableCell>
                        <TableCell>{new Date(rsvp.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Tournament Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Team Entry Price (cents)</Label>
                    <Input 
                      value={settings?.team_entry_price || 7500} 
                      readOnly 
                      placeholder="7500"
                    />
                  </div>
                  <div>
                    <Label>Event Date</Label>
                    <Input 
                      value={settings?.event_date || '2024-06-15'} 
                      readOnly 
                      placeholder="2024-06-15"
                    />
                  </div>
                  <div>
                    <Label>Event Time</Label>
                    <Input 
                      value={settings?.event_time || '9:00 AM'} 
                      readOnly 
                      placeholder="9:00 AM"
                    />
                  </div>
                  <div>
                    <Label>Email Sender Name</Label>
                    <Input 
                      value={settings?.email_sender_name || '5 Points Cup'} 
                      readOnly 
                      placeholder="5 Points Cup"
                    />
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Settings are currently read-only. Contact admin to modify tournament settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics">
            <DiagnosticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;