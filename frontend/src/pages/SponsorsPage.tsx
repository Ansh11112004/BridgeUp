import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, IndianRupee, ArrowRight, Search, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useSponsors } from "@/hooks/useSponsors";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const categories = ["All", "Food & Beverage", "EdTech", "Fitness", "Printing & Merch", "Electronics", "Other"];

const SponsorsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedSearch = useDebouncedValue(search, 350);

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, category: category === "All" ? undefined : category }),
    [debouncedSearch, category]
  );
  const { data: sponsors, isLoading, isError } = useSponsors(filters);

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
              Browse <span className="text-gradient-primary">Sponsors</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Find businesses ready to sponsor your college event. Filter by budget, category, and location.
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
                placeholder="Search sponsors, industries..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[200px] gap-2">
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

          {isLoading && (
            <div className="mt-16 flex justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {isError && (
            <p className="mt-16 text-center text-muted-foreground">
              Couldn't load sponsors right now. Please try again in a moment.
            </p>
          )}

          {!isLoading && !isError && sponsors && sponsors.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">No sponsors match your search yet.</p>
          )}

          {/* Sponsors Grid */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors?.map((sponsor, i) => (
              <motion.div
                key={sponsor._id}
                className="group rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {/* Avatar */}
                <Avatar className="w-20 h-20 ring-4 ring-primary/10 mb-4">
                  <AvatarImage src={sponsor.images[0]} alt={sponsor.name} className="object-cover" />
                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                    {sponsor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent text-accent-foreground">{sponsor.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    {sponsor.rating}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-card-foreground">{sponsor.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{sponsor.description}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {sponsor.interests.map((interest) => (
                    <span key={interest} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {sponsor.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-medium">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {sponsor.budget}
                  </div>
                </div>

                <Link to={`/sponsors/${sponsor._id}`} className="w-full">
                  <Button variant="hero" size="sm" className="w-full gap-2">
                    Contact Sponsor
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SponsorsPage;
