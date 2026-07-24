import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}>
      
      {/* Animated floating blobs */}
      {/* Blob 1 - Orange, starts top-left */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full blur-[50px]"
        style={{ background: "hsl(24 95% 53% / 0.3)", top: "5%", left: "10%" }}
        animate={{
          x: [0, 150, 280, 200, 50, -80, -120, -40, 0],
          y: [0, -60, 80, 180, 120, 200, 60, -40, 0],
          scale: [1, 1.2, 0.9, 1.3, 1.1, 0.85, 1.15, 1.05, 1],
          rotate: [0, 45, 120, 200, 280, 200, 100, 30, 0],
          opacity: [0.25, 0.4, 0.3, 0.45, 0.25, 0.35, 0.4, 0.3, 0.25],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      {/* Blob 2 - Purple, starts bottom-right */}
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full blur-[45px]"
        style={{ background: "hsl(260 60% 55% / 0.3)", bottom: "10%", right: "5%" }}
        animate={{
          x: [0, -180, -100, -250, -150, 30, -60, -200, 0],
          y: [0, -120, -200, -80, 40, -150, -220, -60, 0],
          scale: [1, 0.85, 1.25, 1.1, 0.9, 1.3, 0.95, 1.15, 1],
          rotate: [0, -60, -150, -240, -180, -90, -270, -330, -360],
          opacity: [0.3, 0.2, 0.4, 0.35, 0.2, 0.45, 0.3, 0.25, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Blob 3 - Gold, starts center */}
      <motion.div
        className="absolute w-[240px] h-[240px] rounded-full blur-[45px]"
        style={{ background: "hsl(35 95% 55% / 0.3)", top: "40%", left: "50%" }}
        animate={{
          x: [0, -120, -200, -60, 100, 180, 80, -50, 0],
          y: [0, 100, -30, -150, -100, 50, 150, 60, 0],
          scale: [1, 1.15, 0.9, 1.25, 0.85, 1.2, 1.05, 0.95, 1],
          rotate: [0, 80, 160, 90, 220, 300, 180, 60, 0],
          opacity: [0.3, 0.35, 0.2, 0.4, 0.3, 0.2, 0.45, 0.35, 0.3],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            
            <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide uppercase mb-6"
              style={{
                background: "linear-gradient(135deg, hsl(24 95% 53% / 0.15), hsl(35 95% 60% / 0.1))",
                border: "1px solid hsl(24 95% 53% / 0.3)",
                color: "hsl(35 95% 65%)",
                boxShadow: "0 0 20px hsl(24 95% 53% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}>
              <Rocket className="w-4 h-4" />
              Bridging Events & Brands
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mt-6"
            style={{ color: "hsl(0 0% 98%)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}>
            
            Connect Events with{" "}
            <span className="text-gradient-primary">Sponsors</span>
            {" "}Seamlessly
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "hsl(220 15% 70%)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}>
            
            College event organizers find sponsors. Small businesses get reach.
            One platform that brings both sides together.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}>
            
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link to="/organizer-register">
                <Megaphone className="w-5 h-5" />
                I Need Sponsors
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="gap-2" asChild>
              <Link to="/sponsor-register">
                I Want to Sponsor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}>
            
            {[
            { value: "500+", label: "Events Listed" },
            { value: "200+", label: "Sponsors" },
            { value: "₹2Cr+", label: "Deals Made" }].
            map((stat) =>
            <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold font-display text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "hsl(220 15% 55%)" }}>
                  {stat.label}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>);

};

export default Hero;