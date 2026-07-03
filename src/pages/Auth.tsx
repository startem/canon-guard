import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Sparkles, GaugeCircle, Layers, KeyRound } from "lucide-react";

const TEST_EMAIL = "demo@brandops.dev";
const TEST_PASSWORD = "Demo123456!";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const from = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate(from, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — your agency workspace is ready.");
    navigate("/", { replace: true });
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate(from, { replace: true });
  };

  const handleReset = async () => {
    if (!email) {
      toast.error("Enter your email first, then click reset.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent to your email.");
  };

  const fillTestCredentials = () => {
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
    toast.message("Test credentials filled", { description: "Press Sign In to continue." });
  };

  const highlights = [
    { icon: Layers, title: "One canon per client", text: "Colors, pillars, boilerplate & legal in a single source of truth." },
    { icon: GaugeCircle, title: "Real AI audits", text: "Score any asset against the brand canon in seconds." },
    { icon: ShieldCheck, title: "Multi-tenant by design", text: "Every agency, client and brand isolated and secure." },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-70" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center border border-primary-foreground/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">BrandOps</div>
            <div className="text-xs text-primary-foreground/70">Multi-client brand operations</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Keep every client on-brand — everywhere, automatically.
          </h2>
          <div className="space-y-5">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center shrink-0">
                  <h.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{h.title}</div>
                  <div className="text-sm text-primary-foreground/75">{h.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/60 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Secured by Lovable Cloud
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">BrandOps</span>
          </div>

          <Card className="border-border/60 shadow-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in or create your agency workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin">
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="si-email">Email</Label>
                      <Input id="si-email" type="email" placeholder="you@agency.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="si-pass">Password</Label>
                        <button type="button" onClick={handleReset} className="text-xs text-muted-foreground hover:text-primary">
                          Forgot password?
                        </button>
                      </div>
                      <Input id="si-pass" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Sign In
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={fillTestCredentials}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Use test account — {TEST_EMAIL}
                  </button>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="su-name">Full name</Label>
                      <Input id="su-name" placeholder="Jane Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-email">Email</Label>
                      <Input id="su-email" type="email" placeholder="you@agency.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-pass">Password</Label>
                      <Input id="su-pass" type="password" placeholder="At least 6 characters" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Create workspace
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogle}>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
