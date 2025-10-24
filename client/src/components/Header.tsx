import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu, Search, X, Home, FileText, Heart as HeartIcon, Brain, Apple } from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Artigos", href: "/artigos", icon: FileText },
    { name: "Beleza", href: "/beleza", icon: HeartIcon },
    { name: "Saúde Mental", href: "/saude-mental", icon: Brain },
    { name: "Alimentação", href: "/alimentacao", icon: Apple },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Heart className="h-8 w-8 text-pink-500 mr-2" />
              <div className="flex items-center">
                <span className="text-4xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>EllaTrend</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <span className="flex items-center gap-2 text-gray-600 hover:text-pink-500 px-4 py-3 text-base font-semibold transition-all duration-300 ease-in-out cursor-pointer rounded-lg hover:bg-pink-50 hover:shadow-sm">
                    <item.icon size={18} />
                    <span>{item.name}</span>
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
              className="text-gray-600 hover:text-pink-500"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-gray-600 hover:text-pink-500"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center mb-8">
                  <Heart className="h-6 w-6 text-pink-500 mr-2" />
                  <div className="flex items-center">
                    <span className="text-2xl font-serif font-light text-gray-900">Ella</span>
                    <span className="text-2xl font-bold text-purple-600 ml-1">Trend</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link key={item.name} to={item.href}>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-pink-500 py-3 px-4 text-base font-semibold cursor-pointer rounded-lg hover:bg-pink-50 transition-all duration-300 ease-in-out">
                        <item.icon size={20} />
                        <span>{item.name}</span>
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
                placeholder="Buscar dicas de beleza, receitas, bem-estar..."
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
                Funcionalidade de busca em breve...
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
