import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LatestComparisons from "@/components/LatestComparisons";
import FeaturedDeals from "@/components/FeaturedDeals";
import CategoriesGrid from "@/components/CategoriesGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Admin Bar for authenticated users */}
      {isAuthenticated && user && (
        <div className="bg-primary text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome back, {user.firstName || user.email}!</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              <a href="/api/logout">
                <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                  Logout
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      <main>
        <HeroSection />
        <LatestComparisons />
        <FeaturedDeals />
        <CategoriesGrid />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
}
