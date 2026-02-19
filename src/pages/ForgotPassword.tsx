import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-3xl font-black text-foreground">Check Your Email</h1>
          <p className="text-muted-foreground">If an account exists for {email}, you'll receive a password reset link.</p>
          <Link to="/login"><Button variant="outline">Back to Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-foreground">Forgot Password</h1>
          <p className="mt-2 text-muted-foreground">Enter your email to reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-lg border border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <p className="text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
