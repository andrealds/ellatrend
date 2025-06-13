import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    deals: true,
    comparisons: true,
    launches: false,
  });
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (data: { email: string; preferences: any }) => {
      return apiRequest("POST", "/api/newsletter/subscribe", data);
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive a confirmation email shortly.",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: "Please check your email and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    subscriptionMutation.mutate({ email, preferences });
  };

  return (
    <section className="py-16 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Fique Atualizado com Notícias Tech
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Receba as melhores ofertas, lançamentos e reviews exclusivos direto no seu email. Sem spam, apenas conteúdo de qualidade.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900 placeholder-gray-500"
                required
              />
              <Button
                type="submit"
                disabled={subscriptionMutation.isPending}
                className="bg-white text-primary hover:bg-gray-100 disabled:opacity-50"
              >
                {subscriptionMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Assinar
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={preferences.deals}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, deals: checked as boolean })
                  }
                  className="border-white"
                />
                <span>Ofertas especiais</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={preferences.comparisons}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, comparisons: checked as boolean })
                  }
                  className="border-white"
                />
                <span>Novos comparativos</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={preferences.launches}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, launches: checked as boolean })
                  }
                  className="border-white"
                />
                <span>Lançamentos de produtos</span>
              </label>
            </div>

            <p className="text-xs text-blue-200">
              By subscribing, you agree to our Privacy Policy. Cancel anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
