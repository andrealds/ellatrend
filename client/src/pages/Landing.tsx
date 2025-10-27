import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LatestArticles from "@/components/LatestArticles";
import FeaturedDeals from "@/components/FeaturedDeals";
import CategoriesGrid from "@/components/CategoriesGrid";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <LatestArticles />
        <FeaturedDeals />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
