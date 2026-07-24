import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Star, IndianRupee, ArrowLeft, Send, Loader2,
  ChevronLeft, ChevronRight, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useSponsor } from "@/hooks/useSponsors";
import { useMyEvents } from "@/hooks/useEvents";
import { useCreateInterest } from "@/hooks/useInterests";
import { useChat } from "@/hooks/useChat";

const SponsorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: sponsor, isLoading, isError } = useSponsor(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // An organizer reaching out needs to say which of their events this is for
  const isOrganizer = user?.role === "organizer";
  const { data: myEvents } = useMyEvents(isOrganizer);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const createInterest = useCreateInterest();
  const [interestId, setInterestId] = useState<string | undefined>();

  const sponsorUserId = sponsor && typeof sponsor.user === "object" ? sponsor.user._id : undefined;

  const startConversation = () => {
    if (!selectedEventId || !sponsorUserId) return;
    createInterest.mutate(
      { eventId: selectedEventId, sponsorId: sponsorUserId },
      { onSuccess: (interest) => setInterestId(interest._id) }
    );
  };

  const { messages, loading: chatLoading, sendMessage, sending, peerTyping, notifyTyping } =
    useChat(interestId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !sponsor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Sponsor not found.</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const gallery = sponsor.images.length > 0 ? sponsor.images : ["/placeholder.svg"];
  const nextImage = () => setCurrentImage((p) => (p + 1) % gallery.length);
  const prevImage = () => setCurrentImage((p) => (p - 1 + gallery.length) % gallery.length);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-24 pb-8 flex-1 container">
        <Link to="/sponsors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Sponsors
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Sponsor Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={gallery[currentImage]}
                alt={`${sponsor.name} - Photo ${currentImage + 1}`}
                className="w-full h-[320px] md:h-[400px] object-cover"
              />
              {gallery.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImage ? "bg-primary" : "bg-background/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{sponsor.category}</Badge>
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display font-bold text-3xl text-card-foreground">{sponsor.name}</h1>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium mt-1">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    {sponsor.rating}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                  <IndianRupee className="w-5 h-5" />
                  {sponsor.budget}
                </div>
              </div>

              <p className="text-muted-foreground mt-4 leading-relaxed">{sponsor.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <MapPin className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-card-foreground">{sponsor.location}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <IndianRupee className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Budget Range</p>
                  <p className="text-sm font-semibold text-card-foreground">{sponsor.budget}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Star className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold text-card-foreground">{sponsor.category}</p>
                </div>
              </div>

              {/* Interests */}
              {sponsor.interests.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-3">Interested In</h3>
                  <div className="flex flex-wrap gap-2">
                    {sponsor.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-sm py-1 px-3">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            className="rounded-2xl bg-card border border-border flex flex-col overflow-hidden h-[calc(100vh-12rem)] lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={gallery[0]} alt={sponsor.name} className="object-cover" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {sponsor.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-card-foreground">{sponsor.name}</p>
                <p className="text-xs text-primary">{peerTyping ? "Typing…" : "Online"}</p>
              </div>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Sign in as an organizer to reach out to this sponsor.
                </p>
                <Link to="/organizer-register">
                  <Button variant="hero" size="sm">Sign in as Organizer</Button>
                </Link>
              </div>
            ) : !isOrganizer ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Sponsors reply to organizer requests from the dashboard inbox.
                </p>
              </div>
            ) : !interestId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Which event is this sponsorship for?</p>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="w-full max-w-[240px]">
                    <SelectValue placeholder="Select your event" />
                  </SelectTrigger>
                  <SelectContent>
                    {myEvents?.map((e) => (
                      <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="hero"
                  size="sm"
                  disabled={!selectedEventId || createInterest.isPending}
                  onClick={startConversation}
                >
                  {createInterest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Conversation"}
                </Button>
                {myEvents?.length === 0 && (
                  <p className="text-xs text-muted-foreground">List an event first from your dashboard.</p>
                )}
              </div>
            ) : chatLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center mt-6">
                      Introduce your event and the sponsorship slots you have open.
                    </p>
                  )}
                  {messages.map((msg) => {
                    const mine =
                      typeof msg.sender === "object" ? msg.sender._id === user.id : msg.sender === user.id;
                    return (
                      <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          mine
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-muted-foreground rounded-bl-md"
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/60" : "text-muted-foreground/60"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="px-4 py-3 border-t border-border flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      notifyTyping(true);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!input.trim() || sending} className="shrink-0">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDetail;
