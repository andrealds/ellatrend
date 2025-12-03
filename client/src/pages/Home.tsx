import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WellnessStories from "@/components/EllaStories";
import EllaDica from "@/components/EllaDica";
import LatestArticles from "@/components/LatestArticles";
import BookRecommendations from "@/components/BookRecommendations";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="EllaTrend - Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal"
        description="Dicas de beleza, receitas saudáveis, bem-estar mental e desenvolvimento pessoal. Use nossa calculadora de hidratação para descobrir quanta água beber por dia e nossa calculadora de calorias para calcular suas necessidades diárias. Artigos exclusivos sobre moda, alimentação e saúde mental."
        keywords="beleza, bem-estar, desenvolvimento pessoal, receitas saudáveis, moda, alimentação, saúde mental, dicas de vida, autoestima, lifestyle, calculadora de hidratação, calculadora de água, quanto de água beber, calculadora de calorias, calculadora de calorias diárias, TMB, TDEE, metabolismo basal, calorias diárias, hidratação diária, água por dia, calorias para emagrecer, calorias para ganhar peso, calculadora nutricional"
        url="https://ellatrend.com"
      />
      <Header />
      <HeroSection />
      <WellnessStories />
      <EllaDica />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LatestArticles />
        <BookRecommendations />
      </div>
      <Footer />
    </div>
  );
}
