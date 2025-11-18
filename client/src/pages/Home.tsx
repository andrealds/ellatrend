import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WellnessStories from "@/components/EllaStories";
import LatestArticles from "@/components/LatestArticles";
import BookRecommendations from "@/components/BookRecommendations";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="EllaTrend - Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal"
        description="Dicas de beleza, receitas saudáveis, bem-estar mental e desenvolvimento pessoal. Tudo para você se sentir bem e confiante. Artigos exclusivos sobre moda, alimentação e saúde mental."
        keywords="beleza, bem-estar, desenvolvimento pessoal, receitas saudáveis, moda, alimentação, saúde mental, dicas de vida, autoestima, lifestyle"
        url="https://ellatrend.com"
      />
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
