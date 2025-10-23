import React from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Post from "@/pages/Post";
import Noticia from "@/pages/Noticia";
import Category from "@/pages/Category";
import Deals from "@/pages/Deals";
import Beleza from "@/pages/Beleza";
import SaudeMental from "@/pages/SaudeMental";
import Alimentacao from "@/pages/Alimentacao";
import Artigos from "@/pages/Artigos";
import NotFound from "@/pages/not-found";

// Admin imports (preserved for future use)
// import AdminLogin from "@/pages/admin/Login";
// import AdminDashboard from "@/pages/admin/Dashboard";
// import TestLogin from "@/pages/admin/TestLogin";
// import OfertasList from "@/pages/admin/OfertasList";
// import OfertaForm from "@/pages/admin/OfertaForm";
// import CategoriasList from "@/pages/admin/CategoriasList";
// import CategoriaForm from "@/pages/admin/CategoriaForm";
// import ArtigosList from "@/pages/admin/ArtigosList";
// import ArtigoForm from "@/pages/admin/ArtigoForm";
// import ConfiguracoesPage from "@/pages/admin/ConfiguracoesPage";
// import { AdminLayout } from "@/components/admin/AdminLayout";
// import { useAdmin } from "@/hooks/useAdmin";

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const { toast } = useToast();

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/landing" component={Landing} />
        <Route path="/post/:slug" component={Post} />
        <Route path="/artigo/:slug" component={Post} />
        <Route path="/noticia/:slug" component={Noticia} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/deals" component={Deals} />
        <Route path="/beleza" component={Beleza} />
        <Route path="/saude-mental" component={SaudeMental} />
        <Route path="/alimentacao" component={Alimentacao} />
        <Route path="/artigos" component={Artigos} />
        
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}
