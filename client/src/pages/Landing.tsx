import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LatestComparisons from "@/components/LatestComparisons";
import FeaturedDeals from "@/components/FeaturedDeals";
import CategoriesGrid from "@/components/CategoriesGrid";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
