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
        {/* Banner Google Ads */}
        <div className="mt-16 flex justify-center">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-4xl text-center">
            <div className="text-gray-500 text-sm mb-4">Publicidade</div>
            <div className="bg-white border border-gray-200 rounded p-6 h-32 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Google Ads Banner<br/>728x90</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
