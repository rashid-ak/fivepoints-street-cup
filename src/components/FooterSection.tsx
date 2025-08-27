import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
const FooterSection = () => {
  const backgroundConfig = getSectionBackground('footer');
  return <BackgroundSection {...backgroundConfig} className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black text-foreground mb-4">
                5 POINTS <span className="text-primary">CUP</span>
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Street football in the heart of the city. Join us for Atlanta's premier 3v3 futsal tournament 
                at the historic Underground Atlanta.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                    About the Tournament
                  </a>
                </li>
                <li>
                  <a href="#rules" className="text-muted-foreground hover:text-primary transition-colors">
                    Rules & Format
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="text-muted-foreground hover:text-primary transition-colors">
                    Event Schedule
                  </a>
                </li>
                <li>
                  <a href="#partners" className="text-muted-foreground hover:text-primary transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">rashid@akanni.marketing</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Underground Atlanta</p>
                  <p>Upper Alabama St</p>
                  <p>Atlanta, GA 30303</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Partners Logos */}
          

          <Separator className="mb-6" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Code of Conduct</a>
            </div>
            <div className="text-center md:text-right">
              <p>© 2024 5 Points Cup. All rights reserved.</p>
              <p className="text-xs mt-1">Part of the World Cup 2026 series</p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundSection>;
};
export default FooterSection;