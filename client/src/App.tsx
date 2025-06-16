import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Post from "@/pages/Post";
import Category from "@/pages/Category";
import Deals from "@/pages/Deals";
import NotFound from "@/pages/not-found";
import Comparativos from "@/pages/Comparativos";

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
        <Route path="/category/:slug" component={Category} />
        <Route path="/deals" component={Deals} />
        <Route path="/comparativos" component={Comparativos} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}
