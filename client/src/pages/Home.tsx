import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WellnessStories from "@/components/EllaStories";
import LatestArticles from "@/components/LatestArticles";
import BookRecommendations from "@/components/BookRecommendations";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <WellnessStories />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LatestArticles />
        <BookRecommendations />
      </div>
      <Footer />
    </div>
  );
}
