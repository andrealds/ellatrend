import { Link } from "wouter";
import { Heart, Mail, Copy, Users, Shield, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);
  const contactEmail = "ellatrendoficial@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar email:', err);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="text-2xl font-bold">EllaTrend</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sua fonte confiável para dicas de beleza, bem-estar e desenvolvimento pessoal.
            </p>
          </div>

          {/* Content and Support Sections */}
          <div className="grid md:grid-cols-2 gap-4">

          {/* Content Links */}
          <div>
            <h3 className="font-semibold mb-4">Conteúdo</h3>
            <div className="block md:hidden">
              <div className="flex flex-wrap items-center text-gray-400 text-sm">
                <Link to="/category/beleza">
                  <span className="hover:text-white transition-colors cursor-pointer">Beleza</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/saude-mental">
                  <span className="hover:text-white transition-colors cursor-pointer">Saúde Mental</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/alimentacao-saudavel">
                  <span className="hover:text-white transition-colors cursor-pointer">Alimentação</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/artigos">
                  <span className="hover:text-white transition-colors cursor-pointer">Todos os Artigos</span>
                </Link>
              </div>
            </div>
            <ul className="hidden md:block space-y-2 text-gray-400">
              <li>
                <Link to="/category/beleza">
                  <span className="hover:text-white transition-colors cursor-pointer">Beleza</span>
                </Link>
              </li>
              <li>
                <Link to="/category/saude-mental">
                  <span className="hover:text-white transition-colors cursor-pointer">Saúde Mental</span>
                </Link>
              </li>
              <li>
                <Link to="/category/alimentacao-saudavel">
                  <span className="hover:text-white transition-colors cursor-pointer">Alimentação</span>
                </Link>
              </li>
              <li>
                <Link to="/artigos">
                  <span className="hover:text-white transition-colors cursor-pointer">Todos os Artigos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <div className="block md:hidden">
              <div className="flex flex-wrap items-center text-gray-400 text-sm">
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Contato</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Entre em Contato
                      </DialogTitle>
                      <DialogDescription>
                        Entre em contato conosco através do email abaixo:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">{contactEmail}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyEmail}
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {emailCopied ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <span className="mx-2">|</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Sobre a EllaTrend
                      </DialogTitle>
                      <DialogDescription>
                        Conheça nossa missão e valores
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Nossa Missão</h4>
                        <p className="text-sm text-gray-600">
                          Ser a fonte confiável para mulheres que buscam dicas de beleza, bem-estar e desenvolvimento pessoal, 
                          oferecendo conteúdo de qualidade e inspiração para uma vida mais saudável e feliz.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Nossos Valores</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Autenticidade e transparência</li>
                          <li>• Empoderamento feminino</li>
                          <li>• Qualidade e confiabilidade</li>
                          <li>• Comunidade e apoio mútuo</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Para Quem Somos</h4>
                        <p className="text-sm text-gray-600">
                          Mulheres de todas as idades que buscam se cuidar, se desenvolver e encontrar inspiração 
                          para uma vida mais equilibrada e realizada.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <span className="mx-2">|</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Privacidade</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Política de Privacidade
                      </DialogTitle>
                      <DialogDescription>
                        Como coletamos, usamos e protegemos seus dados pessoais
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">1. Dados Coletados</h4>
                        <p className="text-gray-600 mb-2">
                          Coletamos apenas os dados essenciais para o funcionamento do site:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Dados de navegação (cookies essenciais)</li>
                          <li>• Configurações do site (localStorage)</li>
                          <li>• Informações de uso básicas</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">2. Finalidade do Uso</h4>
                        <p className="text-gray-600">
                          Utilizamos seus dados apenas para manter o funcionamento do site, 
                          lembrar suas preferências e melhorar sua experiência de navegação.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">3. Compartilhamento</h4>
                        <p className="text-gray-600">
                          Não compartilhamos seus dados pessoais com terceiros. Todos os dados 
                          são utilizados exclusivamente para o funcionamento do site.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">4. Cookies</h4>
                        <p className="text-gray-600">
                          Utilizamos apenas cookies essenciais para o funcionamento do site. 
                          Não utilizamos cookies de rastreamento ou analytics externos.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">5. Seus Direitos</h4>
                        <p className="text-gray-600 mb-2">
                          Você tem o direito de:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Limpar dados do navegador (localStorage/cookies)</li>
                          <li>• Desabilitar cookies no navegador</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">6. Contato</h4>
                        <p className="text-gray-600">
                          Para esclarecer dúvidas sobre esta política, entre em contato: 
                          <strong>ellatrendoficial@gmail.com</strong>
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <span className="mx-2">|</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Termos</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Termos de Uso
                      </DialogTitle>
                      <DialogDescription>
                        Regras e condições para uso do site EllaTrend
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">1. Aceitação dos Termos</h4>
                        <p className="text-gray-600">
                          Ao acessar e usar o site EllaTrend, você concorda em cumprir estes termos de uso. 
                          Se não concordar com qualquer parte destes termos, não deve usar nosso site.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">2. Uso do Site</h4>
                        <p className="text-gray-600 mb-2">
                          Você pode usar nosso site para:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Ler artigos e dicas de beleza, bem-estar e desenvolvimento pessoal</li>
                          <li>• Navegar pelo conteúdo de forma responsável</li>
                          <li>• Compartilhar conteúdo respeitando os direitos autorais</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">3. Condutas Proibidas</h4>
                        <p className="text-gray-600 mb-2">
                          É proibido:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Usar o site para atividades ilegais</li>
                          <li>• Tentar acessar áreas restritas do sistema</li>
                          <li>• Interferir no funcionamento do site</li>
                          <li>• Reproduzir conteúdo sem autorização</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">4. Propriedade Intelectual</h4>
                        <p className="text-gray-600">
                          Todo o conteúdo do site (textos, imagens, design) é propriedade da EllaTrend 
                          e está protegido por direitos autorais. O uso não autorizado é proibido.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">5. Limitação de Responsabilidade</h4>
                        <p className="text-gray-600">
                          O site é fornecido "como está". Não garantimos que o conteúdo seja sempre 
                          preciso, completo ou atualizado. Use as informações por sua própria conta e risco.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">6. Alterações</h4>
                        <p className="text-gray-600">
                          Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                          As alterações entrarão em vigor imediatamente após a publicação.
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <ul className="hidden md:block space-y-2 text-gray-400">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Contato</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Entre em Contato
                      </DialogTitle>
                      <DialogDescription>
                        Entre em contato conosco através do email abaixo:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">{contactEmail}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyEmail}
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {emailCopied ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Sobre a EllaTrend
                      </DialogTitle>
                      <DialogDescription>
                        Conheça nossa missão e valores
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Nossa Missão</h4>
                        <p className="text-sm text-gray-600">
                          Ser a fonte confiável para mulheres que buscam dicas de beleza, bem-estar e desenvolvimento pessoal, 
                          oferecendo conteúdo de qualidade e inspiração para uma vida mais saudável e feliz.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Nossos Valores</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Autenticidade e transparência</li>
                          <li>• Empoderamento feminino</li>
                          <li>• Qualidade e confiabilidade</li>
                          <li>• Comunidade e apoio mútuo</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Para Quem Somos</h4>
                        <p className="text-sm text-gray-600">
                          Mulheres de todas as idades que buscam se cuidar, se desenvolver e encontrar inspiração 
                          para uma vida mais equilibrada e realizada.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Política de Privacidade
                      </DialogTitle>
                      <DialogDescription>
                        Como coletamos, usamos e protegemos seus dados pessoais
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">1. Dados Coletados</h4>
                        <p className="text-gray-600 mb-2">
                          Coletamos apenas os dados essenciais para o funcionamento do site:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Dados de navegação (cookies essenciais)</li>
                          <li>• Configurações do site (localStorage)</li>
                          <li>• Informações de uso básicas</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">2. Finalidade do Uso</h4>
                        <p className="text-gray-600">
                          Utilizamos seus dados apenas para manter o funcionamento do site, 
                          lembrar suas preferências e melhorar sua experiência de navegação.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">3. Compartilhamento</h4>
                        <p className="text-gray-600">
                          Não compartilhamos seus dados pessoais com terceiros. Todos os dados 
                          são utilizados exclusivamente para o funcionamento do site.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">4. Cookies</h4>
                        <p className="text-gray-600">
                          Utilizamos apenas cookies essenciais para o funcionamento do site. 
                          Não utilizamos cookies de rastreamento ou analytics externos.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">5. Seus Direitos</h4>
                        <p className="text-gray-600 mb-2">
                          Você tem o direito de:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Limpar dados do navegador (localStorage/cookies)</li>
                          <li>• Desabilitar cookies no navegador</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">6. Contato</h4>
                        <p className="text-gray-600">
                          Para esclarecer dúvidas sobre esta política, entre em contato: 
                          <strong>ellatrendoficial@gmail.com</strong>
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Termos de Uso
                      </DialogTitle>
                      <DialogDescription>
                        Regras e condições para uso do site EllaTrend
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">1. Aceitação dos Termos</h4>
                        <p className="text-gray-600">
                          Ao acessar e usar o site EllaTrend, você concorda em cumprir estes termos de uso. 
                          Se não concordar com qualquer parte destes termos, não deve usar nosso site.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">2. Uso do Site</h4>
                        <p className="text-gray-600 mb-2">
                          Você pode usar nosso site para:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Ler artigos e dicas de beleza, bem-estar e desenvolvimento pessoal</li>
                          <li>• Navegar pelo conteúdo de forma responsável</li>
                          <li>• Compartilhar conteúdo respeitando os direitos autorais</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">3. Condutas Proibidas</h4>
                        <p className="text-gray-600 mb-2">
                          É proibido:
                        </p>
                        <ul className="text-gray-600 space-y-1 ml-4">
                          <li>• Usar o site para atividades ilegais</li>
                          <li>• Tentar acessar áreas restritas do sistema</li>
                          <li>• Interferir no funcionamento do site</li>
                          <li>• Reproduzir conteúdo sem autorização</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">4. Propriedade Intelectual</h4>
                        <p className="text-gray-600">
                          Todo o conteúdo do site (textos, imagens, design) é propriedade da EllaTrend 
                          e está protegido por direitos autorais. O uso não autorizado é proibido.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">5. Limitação de Responsabilidade</h4>
                        <p className="text-gray-600">
                          O site é fornecido "como está". Não garantimos que o conteúdo seja sempre 
                          preciso, completo ou atualizado. Use as informações por sua própria conta e risco.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">6. Alterações</h4>
                        <p className="text-gray-600">
                          Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                          As alterações entrarão em vigor imediatamente após a publicação.
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} EllaTrend. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
              <span>Feito com</span>
              <span className="text-red-500">♥</span>
              <span>para mulheres que se cuidam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
