import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Trophy, Users, Calendar, Newspaper } from "lucide-react";
import { useDatabase } from "@/hooks/useDatabase";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { teamBranding } = useDatabase();

  const navItems = [
    { name: "Home", href: "/", icon: Trophy },
    { name: "Matches", href: "/matches", icon: Calendar },
    { name: "Players", href: "/players", icon: Users },
    { name: "News", href: "/news", icon: Newspaper },
  ];

  const handleNavigation = (href: string) => {
    window.location.href = href;
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-500/25">
              {teamBranding?.logo_url ? (
                <img
                  src={teamBranding.logo_url}
                  alt="Team Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Trophy className="h-6 w-6 text-white" />
              )}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {teamBranding?.team_name || "GG Masters FC"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-all duration-200"
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-cyan-400"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-gray-900 border-gray-700"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="flex items-center justify-start space-x-3 w-full text-gray-300 hover:bg-gray-800 hover:text-cyan-400"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
