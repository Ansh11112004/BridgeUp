import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Users, IndianRupee, ArrowLeft, Send, Loader2,
  Calendar, Store, Megaphone, ChevronLeft, ChevronRight, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useEvent } from "@/hooks/useEvents";
import { useCreateInterest } from "@/hooks/useInterests";
import { useChat } from "@/hooks/useChat";

const categoryColors: Record<string, string> = {
  Tech: "bg-accent text-accent-foreground",
  Cultural: "bg-primary/10 text-primary",
  Business: "bg-secondary text-secondary-foreground",
  Sports: "bg-muted text-muted-foreground",
};

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: event, isLoading, isError } = useEvent(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // A sponsor viewing this page gets (or starts) a conversation thread with the organizer
  const createInterest = useCreateInterest();
  const [interestId, setInterestId] = useState<string | undefined>();
  const canChat = user?.role === "sponsor";

  useEffect(() => {
    if (canChat && id && !interestId && !createInterest.isPending) {
      createInterest.mutate(
        { eventId: id },
        { onSuccess: (interest) => setInterestId(interest._id) }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canChat, id]);

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

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % event.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + event.images.length) % event.images.length);

  const organizerName =
    typeof event.organizer === "object" ? event.organizer.org || event.organizer.name : "Organizer";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-24 pb-8 flex-1 container">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Event Details Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={event.images[currentImage] || "/placeholder.svg"}
                alt={`${event.name} - Photo ${currentImage + 1}`}
                className="w-full h-[320px] md:h-[400px] object-cover"
              />
              {event.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {event.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImage ? "bg-primary" : "bg-background/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <Badge className={`absolute top-4 left-4 ${categoryColors[event.category] || "bg-muted text-muted-foreground"}`}>
                {event.category}
              </Badge>
            </div>

            {/* Thumbnail strip */}
            {event.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {event.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImage ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Event Info */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display font-bold text-3xl text-card-foreground">{event.name}</h1>
                  <p className="text-muted-foreground mt-1">{event.college}</p>
                </div>
                <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                  <IndianRupee className="w-5 h-5" />
                  {event.budget}
                </div>
              </div>

              <p className="text-muted-foreground mt-4 leading-relaxed">{event.description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Calendar className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-card-foreground">{event.date}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Users className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Footfall</p>
                  <p className="text-sm font-semibold text-card-foreground">{event.attendees}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <MapPin className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-card-foreground">{event.location}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Store className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Stall Types</p>
                  <p className="text-sm font-semibold text-card-foreground">{event.stallTypes.length}</p>
                </div>
              </div>

              {/* Highlights */}
              {event.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.highlights.map((h) => (
                      <span key={h} className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stall Types */}
              {event.stallTypes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    Types of Stalls
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.stallTypes.map((stall) => (
                      <Badge key={stall} variant="outline" className="text-sm py-1 px-3">
                        {stall}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sponsors Required */}
              {event.sponsorsRequired.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-3 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    Sponsors Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.sponsorsRequired.map((s) => (
                      <Badge key={s} className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-3">
                        {s}
                      </Badge>
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
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-border">
              <p className="font-semibold text-sm text-card-foreground">{event.name} — {organizerName}</p>
              <p className="text-xs text-primary">{peerTyping ? "Typing…" : "Online"}</p>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Sign in as a sponsor to message this event's organizer directly.
                </p>
                <Link to="/sponsor-register">
                  <Button variant="hero" size="sm">Sign in as Sponsor</Button>
                </Link>
              </div>
            ) : !canChat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Organizer accounts reply to sponsors from the dashboard inbox.
                </p>
              </div>
            ) : chatLoading || !interestId ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center mt-6">
                      Say hello — ask about sponsorship packages, stall availability, or footfall.
                    </p>
                  )}
                  {messages.map((msg) => {
                    const mine =
                      typeof msg.sender === "object"
                        ? msg.sender._id === user.id
                        : msg.sender === user.id;
                    return (
                      <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            mine
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-muted-foreground rounded-bl-md"
                          }`}
                        >
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

                {/* Input */}
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

export default EventDetail;
