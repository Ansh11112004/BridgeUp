import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, Calendar, Building2, IndianRupee, CheckCircle2, Clock, Sparkles, Search, TrendingUp, MapPin, Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMyInterests } from "@/hooks/useInterests";
import { InterestRecord, InterestStatus } from "@/lib/types";
import ConversationDialog from "@/components/ConversationDialog";

const statusMeta: Record<InterestStatus, { label: string; icon: any; cls: string }> = {
  new: { label: "New", icon: Sparkles, cls: "bg-primary/15 text-primary" },
  "in-talks": { label: "In Talks", icon: Clock, cls: "bg-amber-500/15 text-amber-400" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
};

const SponsorDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.org || user?.name || "there";
  const [activeConversation, setActiveConversation] = useState<InterestRecord | null>(null);

  const { data: interests, isLoading } = useMyInterests(Boolean(user));
  const inbox = interests || [];

  // The events the sponsor has an active thread on, deduplicated
  const engagedEvents = useMemo(() => {
    const seen = new Map<string, InterestRecord>();
    for (const i of inbox) {
      const event = typeof i.event === "object" ? i.event : null;
      if (event && !seen.has(event._id)) seen.set(event._id, i);
    }
    return Array.from(seen.values());
  }, [inbox]);

  const stats = [
    { label: "Events Engaged", value: engagedEvents.length, icon: Calendar },
    { label: "Organizer Requests", value: inbox.length, icon: Building2 },
    { label: "Confirmed Deals", value: inbox.filter((i) => i.status === "confirmed").length, icon: CheckCircle2 },
    { label: "In Talks", value: inbox.filter((i) => i.status === "in-talks").length, icon: TrendingUp },
  ];

  const renderInbox = (items: InterestRecord[]) => (
    <div className="space-y-3">
      {items.map((item) => {
        const meta = statusMeta[item.status];
        const Icon = meta.icon;
        const organizer = typeof item.organizer === "object" ? item.organizer : null;
        const event = typeof item.event === "object" ? item.event : null;
        return (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">
              {(event?.name || "?").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={event ? `/events/${event._id}` : "#"} className="font-display font-bold text-card-foreground hover:text-primary">
                  {event?.name || "Event"}
                </Link>
                <Badge variant="outline" className="text-xs">{organizer?.org || organizer?.name}</Badge>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${meta.cls}`}>
                  <Icon className="w-3 h-3" /> {meta.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                <span className="text-foreground/80">{organizer?.name}:</span> {item.message || "No message yet"}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {item.amount && (
                  <>
                    <span className="inline-flex items-center gap-1 text-primary font-medium">
                      <IndianRupee className="w-3 h-3" /> {item.amount}
                    </span>
                    <span>·</span>
                  </>
                )}
                <span>{new Date(item.lastMessageAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button size="sm" variant="hero" className="gap-2 sm:self-center" onClick={() => setActiveConversation(item)}>
              <MessageSquare className="w-4 h-4" /> Chat
            </Button>
          </motion.div>
        );
      })}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">No requests in this bucket yet.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {/* <p className="text-sm text-primary font-medium">Sponsor Dashboard</p> */}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-1">
                Hello, <span className="text-gradient-primary">{displayName}</span>
              </h1>
              <p className="text-muted-foreground mt-2">Manage incoming event requests and your active sponsorships.</p>
            </div>
            <Button variant="hero" className="gap-2" asChild>
              <Link to="/events"><Search className="w-4 h-4" /> Discover events</Link>
            </Button>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
                  <s.icon className="w-4 h-4" /> {s.label}
                </div>
                <p className="font-display text-3xl font-bold text-card-foreground mt-2">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Organizer Inbox</h2>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : (
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All ({inbox.length})</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="in-talks">In Talks</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">{renderInbox(inbox)}</TabsContent>
                  <TabsContent value="new" className="mt-4">{renderInbox(inbox.filter((i) => i.status === "new"))}</TabsContent>
                  <TabsContent value="in-talks" className="mt-4">{renderInbox(inbox.filter((i) => i.status === "in-talks"))}</TabsContent>
                  <TabsContent value="confirmed" className="mt-4">{renderInbox(inbox.filter((i) => i.status === "confirmed"))}</TabsContent>
                </Tabs>
              )}
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Events I'm Engaged With</h2>
              <div className="space-y-4">
                {engagedEvents.map((item) => {
                  const event = typeof item.event === "object" ? item.event : null;
                  if (!event) return null;
                  const meta = statusMeta[item.status];
                  return (
                    <Link key={event._id} to={`/events/${event._id}`} className="block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
                      <img src={event.images[0] || "/placeholder.svg"} alt={event.name} className="w-full h-32 object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-card-foreground">{event.name}</h3>
                          <Badge className={`${meta.cls} hover:${meta.cls}`}>{meta.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{event.college} · {event.date}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {engagedEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-10 rounded-2xl border border-dashed border-border">
                    No active sponsorships yet — browse events to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ConversationDialog
        interestId={activeConversation?._id || null}
        title={
          activeConversation
            ? `${typeof activeConversation.organizer === "object" ? activeConversation.organizer.org || activeConversation.organizer.name : "Organizer"} — ${typeof activeConversation.event === "object" ? activeConversation.event.name : ""}`
            : ""
        }
        currentStatus={activeConversation?.status}
        onClose={() => setActiveConversation(null)}
      />
    </div>
  );
};

export default SponsorDashboard;
