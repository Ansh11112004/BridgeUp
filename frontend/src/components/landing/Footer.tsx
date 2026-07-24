import { Handshake } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-secondary">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Handshake className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-secondary-foreground">BridgeUp</span>
          </div>
          <p className="text-sm text-secondary-foreground/50">
            © 2026 BridgeUp. Connecting events with sponsors.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
