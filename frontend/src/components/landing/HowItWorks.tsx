import { motion } from "framer-motion";
import { CalendarPlus, Search, Handshake, Store, Eye, TrendingUp } from "lucide-react";

const organizerSteps = [
  { icon: CalendarPlus, title: "List Your Event", desc: "Post your college event with details, audience size, and sponsorship tiers." },
  { icon: Search, title: "Get Matched", desc: "Our platform connects you with businesses looking to sponsor relevant events." },
  { icon: Handshake, title: "Close the Deal", desc: "Negotiate terms, finalize sponsorship, and run a fully-funded event." },
];

const sponsorSteps = [
  { icon: Store, title: "Create Your Profile", desc: "Showcase your business, products, and the kind of events you want to sponsor." },
  { icon: Eye, title: "Discover Events", desc: "Browse college events that match your target audience and budget." },
  { icon: TrendingUp, title: "Get Reach", desc: "Sponsor events, set up stalls, and get your brand in front of thousands." },
];

const StepCard = ({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) => (
  <motion.div
    className="flex gap-4 items-start"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
      <Icon className="w-6 h-6 text-accent-foreground" />
    </div>
    <div>
      <h4 className="font-display font-semibold text-lg text-foreground">{title}</h4>
      <p className="text-muted-foreground text-sm mt-1">{desc}</p>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">How It Works</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
            Two Paths, One Platform
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Organizers */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground text-sm font-semibold mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              🎓 For Event Organizers
            </motion.div>
            <div className="space-y-8">
              {organizerSteps.map((step, i) => (
                <StepCard key={step.title} {...step} index={i} />
              ))}
            </div>
          </div>

          {/* Sponsors */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm font-semibold mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              💼 For Sponsors
            </motion.div>
            <div className="space-y-8">
              {sponsorSteps.map((step, i) => (
                <StepCard key={step.title} {...step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
