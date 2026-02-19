import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-3xl font-black text-foreground">Check Your Email</h1>
          <p className="text-muted-foreground">We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.</p>
          <Link to="/login"><Button variant="outline">Back to Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-foreground">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Join the 5 Points Cup community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-lg border border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
