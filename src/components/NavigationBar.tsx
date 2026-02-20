import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const homeNavItems = [
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/e4145787-35ca-4832-9839-e472dd1fdd50.png" alt="5 Points Cup Logo" className="w-8 h-8" />
            <Link to="/" className="text-xl font-black text-foreground hover:text-primary transition-colors">
              POINTS <span className="text-primary">CUP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isHome &&
              homeNavItems.map((item) => (
                <button key={item.name} onClick={() => scrollToSection(item.href)} className="text-foreground hover:text-primary transition-colors font-medium text-sm">
                  {item.name}
                </button>
              ))}
            <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Events</Link>
          </div>

          {/* Desktop CTA / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isHome && (
              <Link to="/events">
                <Button variant="cta" className="font-semibold text-sm">Enter a Team</Button>
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin"><Button variant="ghost" size="sm"><Shield className="w-4 h-4 mr-1" />Admin</Button></Link>
                )}
                <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
              </div>
            ) : (
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
              {isHome &&
                homeNavItems.map((item) => (
                  <button key={item.name} onClick={() => scrollToSection(item.href)} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors font-medium">
                    {item.name}
                  </button>
                ))}
              <Link to="/events" className="block px-3 py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Events</Link>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" className="block px-3 py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Admin</Link>}
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary font-medium">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Sign In</Link>
              )}
              {isHome && (
                <div className="pt-4">
                  <Link to="/events" onClick={() => setIsOpen(false)}>
                    <Button variant="cta" className="w-full font-semibold">Enter a Team</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
