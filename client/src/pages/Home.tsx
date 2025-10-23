import { useEffect } from "react";
import { useStaticData } from "@/hooks/useStaticData";
import { Oferta } from "@/types/ofertas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WellnessStories from "@/components/EllaStories";
import LatestArticles from "@/components/LatestArticles";
import DealList from "@/components/DealList";

export default function Home() {
  const { data: ofertasData, loading: loadingOfertas } = useStaticData<{ ofertas: Oferta[] }>("ofertas");

  if (loadingOfertas) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ofertas = ofertasData?.ofertas || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <WellnessStories />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LatestArticles />
        <div className="mt-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
              <span className="text-3xl lg:text-4xl font-bold text-gray-900 ml-2">Ofertas</span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Produtos de beleza, bem-estar e desenvolvimento pessoal com preços especiais.
            </p>
          </div>
          <DealList destaque limite={6} />
          <div className="text-center mt-12">
            <Link to="/deals">
              <Button size="lg" className="bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-gray-800">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ver Todas as Ofertas
              </Button>
            </Link>
          </div>
        </div>
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
