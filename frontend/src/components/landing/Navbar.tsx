import { Handshake, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, dashboardPath } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const homeHref = user ? dashboardPath(user.role) : "/";
  const isHero = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const darkNav = isHero && !scrolled;

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-[0_4px_30px_-10px_hsl(220_40%_10%_/0.12)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        <Link to={homeHref} className="flex items-center gap-2.5 group">
          <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${darkNav ? "bg-white/10" : "bg-primary/10"}`}>
            <Handshake className={`w-6 h-6 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 ${darkNav ? "text-white" : "text-primary"}`} />
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${darkNav ? "text-white" : "text-foreground"}`}>
            BridgeUp
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Events", href: "/events" },
            { label: "Sponsors", href: "/sponsors" },
            ...(user
              ? [{ label: "Dashboard", href: dashboardPath(user.role) }]
              : [
                  { label: "How It Works", href: "#" },
                  { label: "Features", href: "#" },
                ]),
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                darkNav
                  ? "text-white/85 hover:text-white hover:bg-white/10"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/8"
              }`}
            >
              {item.label}
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 group-hover:w-4 ${
                darkNav ? "bg-white" : "bg-primary"
              } w-0`} />
            </Link>
          ))}
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`group flex items-center gap-2.5 h-10 pl-1.5 pr-4 rounded-full transition-all duration-300 border ${
                darkNav
                  ? "bg-white/10 border-white/20 hover:bg-white/15 text-white backdrop-blur-sm"
                  : "bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
              }`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  darkNav ? "bg-white text-secondary" : "bg-primary text-primary-foreground"
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                <LogOut className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-2xl border-border/60 shadow-xl">
              <DropdownMenuLabel className="p-3 rounded-xl bg-muted/50">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold mt-1">{user.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="rounded-xl py-2 px-3 cursor-pointer">
                <Link to={dashboardPath(user.role)} className="gap-3 text-sm font-medium">
                  <UserIcon className="w-4 h-4 text-primary" /> My Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2 px-3 gap-3 text-sm font-medium text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant={darkNav ? "hero" : "default"} size="default" className="rounded-full h-10 px-6 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300" asChild>
            <Link to="/organizer-register">Get Started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;