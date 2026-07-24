import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, IndianRupee, ArrowRight, Search, Filter, ImageIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useEvents } from "@/hooks/useEvents";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const categoryColors: Record<string, string> = {
  Tech: "bg-accent text-accent-foreground",
  Cultural: "bg-primary/10 text-primary",
  Business: "bg-secondary text-secondary-foreground",
  Sports: "bg-muted text-muted-foreground",
};

const categories = ["All", "Tech", "Cultural", "Business", "Sports", "Other"];

const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedSearch = useDebouncedValue(search, 350);

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, category: category === "All" ? undefined : category }),
    [debouncedSearch, category]
  );
  const { data: events, isLoading, isError } = useEvents(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Browse <span className="text-gradient-primary">Events</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Discover college events looking for sponsors. Find the perfect match for your brand.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events, colleges..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px] gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Event Grid */}
          {isLoading && (
            <div className="mt-16 flex justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {isError && (
            <p className="mt-16 text-center text-muted-foreground">
              Couldn't load events right now. Please try again in a moment.
            </p>
          )}

          {!isLoading && !isError && events && events.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">No events match your search yet.</p>
          )}

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event, i) => (
              <Link key={event._id} to={`/events/${event._id}`}>
              <motion.div
                className="group rounded-2xl bg-card border border-border overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {/* Image section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.images[0] || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
                      <ImageIcon className="w-3 h-3" />
                      +{event.images.length - 1} more
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${categoryColors[event.category] || "bg-muted text-muted-foreground"}`}>
                    {event.category}
                  </Badge>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display font-bold text-xl text-card-foreground">{event.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{event.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.college}</p>
                  <p className="text-sm text-muted-foreground mt-3 flex-1">{event.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {event.attendees}
                    </div>
                    <div className="flex items-center gap-1.5 text-primary font-medium col-span-2">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {event.budget}
                    </div>
                  </div>

                  <Button variant="hero" size="sm" className="w-full mt-5 gap-2">
                    Sponsor This Event
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
