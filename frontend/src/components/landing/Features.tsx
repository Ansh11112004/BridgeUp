import { motion } from "framer-motion";
import { Shield, Zap, Users, BarChart3, MessageSquare, Globe } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Listings", desc: "Every event and sponsor is verified for trust and authenticity." },
  { icon: Zap, title: "Instant Matching", desc: "Smart algorithms match sponsors with the most relevant events." },
  { icon: Users, title: "Large Network", desc: "Hundreds of colleges and businesses across the country." },
  { icon: BarChart3, title: "Analytics & ROI", desc: "Sponsors get detailed reports on reach and engagement." },
  { icon: MessageSquare, title: "In-App Chat", desc: "Negotiate deals directly on the platform with built-in messaging." },
  { icon: Globe, title: "Pan-India Reach", desc: "From IITs to local colleges — events from every corner." },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Features</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
            Built for Both Sides
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Everything you need to find, connect, and close sponsorship deals — all in one place.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-card-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
