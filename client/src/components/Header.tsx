import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Microchip, Menu, Search, X } from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Comparatives", href: "/category/comparatives" },
    { name: "Deals", href: "/deals" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Microchip className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-gray-900">TecReview</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <span className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Mobile menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="text-gray-600 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-gray-600 hover:text-primary"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center mb-8">
                  <Microchip className="h-6 w-6 text-primary mr-2" />
                  <span className="text-xl font-bold text-gray-900">TecReview</span>
                </div>
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link key={item.name} to={item.href}>
                      <div className="block text-gray-600 hover:text-primary py-2 text-sm font-medium cursor-pointer">
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center space-x-4 mb-4">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products, articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg border-none focus:ring-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {searchQuery && (
              <div className="text-sm text-gray-500">
                Search functionality coming soon...
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
