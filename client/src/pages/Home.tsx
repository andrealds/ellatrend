import { useEffect } from "react";
import { useStaticData } from "@/hooks/useStaticData";
import { Comparativo } from "@/types/comparativos";
import { Oferta } from "@/types/ofertas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LatestComparisons from "@/components/LatestComparisons";
import CategoriesGrid from "@/components/CategoriesGrid";
import DealList from "@/components/DealList";

export default function Home() {
  const { data: comparativosData, loading: loadingComparativos } = useStaticData<{ comparativos: Comparativo[] }>("comparativos");
  const { data: ofertasData, loading: loadingOfertas } = useStaticData<{ ofertas: Oferta[] }>("ofertas");

  if (loadingComparativos || loadingOfertas) {
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

  const comparativos = comparativosData?.comparativos || [];
  const ofertas = ofertasData?.ofertas || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LatestComparisons />
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ofertas em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              As melhores ofertas selecionadas especialmente para você.
            </p>
          </div>
          <DealList destaque limite={6} />
          <div className="text-center mt-12">
            <Link to="/deals">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ver Todas as Ofertas
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-16">
          <CategoriesGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
}
