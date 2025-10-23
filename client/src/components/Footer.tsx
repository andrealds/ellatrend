import { Link } from "wouter";
import { Heart, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="text-2xl font-bold">EllaTrend</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sua fonte confiável para dicas de beleza, bem-estar e desenvolvimento pessoal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

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
                <Link to="/deals">
                  <span className="hover:text-white transition-colors cursor-pointer">Ofertas</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/alimentacao-saudavel">
                  <span className="hover:text-white transition-colors cursor-pointer">Receitas</span>
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
                <Link to="/deals">
                  <span className="hover:text-white transition-colors cursor-pointer">Ofertas</span>
                </Link>
              </li>
              <li>
                <Link to="/category/alimentacao-saudavel">
                  <span className="hover:text-white transition-colors cursor-pointer">Receitas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Links */}
          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <div className="block md:hidden">
              <div className="flex flex-wrap items-center text-gray-400 text-sm">
                <Link to="/category/beleza/skincare">
                  <span className="hover:text-white transition-colors cursor-pointer">Skincare</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/beleza/maquiagem">
                  <span className="hover:text-white transition-colors cursor-pointer">Maquiagem</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/saude-mental/meditacao-mindfulness">
                  <span className="hover:text-white transition-colors cursor-pointer">Mindfulness</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/category/alimentacao-saudavel/receitas-fit">
                  <span className="hover:text-white transition-colors cursor-pointer">Receitas Fit</span>
                </Link>
              </div>
            </div>
            <ul className="hidden md:block space-y-2 text-gray-400">
              <li>
                <Link to="/category/beleza/skincare">
                  <span className="hover:text-white transition-colors cursor-pointer">Skincare</span>
                </Link>
              </li>
              <li>
                <Link to="/category/beleza/maquiagem">
                  <span className="hover:text-white transition-colors cursor-pointer">Maquiagem</span>
                </Link>
              </li>
              <li>
                <Link to="/category/saude-mental/meditacao-mindfulness">
                  <span className="hover:text-white transition-colors cursor-pointer">Mindfulness</span>
                </Link>
              </li>
              <li>
                <Link to="/category/alimentacao-saudavel/receitas-fit">
                  <span className="hover:text-white transition-colors cursor-pointer">Receitas Fit</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <div className="block md:hidden">
              <div className="flex flex-wrap items-center text-gray-400 text-sm">
                <Link to="/contact">
                  <span className="hover:text-white transition-colors cursor-pointer">Contato</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/about">
                  <span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/privacy">
                  <span className="hover:text-white transition-colors cursor-pointer">Privacidade</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/terms">
                  <span className="hover:text-white transition-colors cursor-pointer">Termos</span>
                </Link>
                <span className="mx-2">|</span>
                <Link to="/disclosure">
                  <span className="hover:text-white transition-colors cursor-pointer">Afiliados</span>
                </Link>
              </div>
            </div>
            <ul className="hidden md:block space-y-2 text-gray-400">
              <li>
                <Link to="/contact">
                  <span className="hover:text-white transition-colors cursor-pointer">Contato</span>
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy">
                  <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</span>
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
                </Link>
              </li>
              <li>
                <Link to="/disclosure">
                  <span className="hover:text-white transition-colors cursor-pointer">Divulgação de Afiliados</span>
                </Link>
              </li>
            </ul>
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
