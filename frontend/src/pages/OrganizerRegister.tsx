import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Mail, Lock, User, ArrowRight, Megaphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const OrganizerRegister = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "");
    const org = String(data.get("college") || "");

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("Logged in successfully!");
      } else {
        await register({ name, email, password, role: "organizer", org });
        toast.success("Account created successfully!");
      }
      const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(redirectTo || "/organizer/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--hero-gradient)" }}>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]" style={{ background: "hsl(24 95% 53%)" }} />
        <div className="relative text-center max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Handshake className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-2xl" style={{ color: "hsl(0 0% 98%)" }}>BridgeUp</span>
          </Link>
          <h2 className="font-display text-4xl font-bold" style={{ color: "hsl(0 0% 98%)" }}>
            Find Sponsors for Your College Event
          </h2>
          <p className="mt-4 text-lg" style={{ color: "hsl(220 15% 70%)" }}>
            List your event, get matched with relevant brands, and secure sponsorships effortlessly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">For Event Organizers</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Handshake className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg text-card-foreground">BridgeUp</span>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-card-foreground">
            {isLogin ? "Welcome Back, Organizer" : "Register as Organizer"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Log in to manage your events" : "Create an account to list your events"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="Your name" className="pl-10" required />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="you@college.edu" className="pl-10" required />
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="college">College / Organization</Label>
                <Input id="college" name="college" placeholder="e.g. IIT Delhi" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10" required minLength={6} />
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isLogin ? "Log In" : "Create Account"}<ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Register" : "Log in"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/sponsor-register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Want to sponsor events instead? →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerRegister;
