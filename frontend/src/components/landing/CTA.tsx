import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          style={{ background: "var(--hero-gradient)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Glow */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "hsl(24 95% 53%)" }}
          />

          <h2 className="relative font-display text-3xl md:text-5xl font-bold" style={{ color: "hsl(0 0% 98%)" }}>
            Ready to Power Your Next Event?
          </h2>
          <p className="relative mt-4 text-lg max-w-xl mx-auto" style={{ color: "hsl(220 15% 70%)" }}>
            Whether you're organizing a college fest or looking to expand your brand — join the platform that makes sponsorship simple.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="hero-outline" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
