import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X } from "lucide-react";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  capa: string;
  categoria: string;
}

  const livros: Livro[] = [
    {
      id: "livro-1",
      titulo: "As coisas que você vê quando desacelera",
      autor: "Haemin Sunim",
      descricao: "Escrito por um monge zen-budista, este livro é um convite à calma em meio ao caos. Haemin Sunim fala sobre como desacelerar não é desistir da vida, mas aprender a vivê-la com mais presença e sensibilidade. Com textos breves e reflexivos, ele mostra que a sabedoria nasce quando paramos de correr e começamos a observar. É uma leitura suave, perfeita para momentos em que tudo parece urgente demais.",
      capa: "/images/livros/livro-1.jpg",
      categoria: "Bem-estar"
    },
    {
      id: "livro-2",
      titulo: "A coragem de ser imperfeito",
      autor: "Brené Brown",
      descricao: "Nesta obra inspiradora, Brené Brown nos convida a abraçar a vulnerabilidade como força, e não como fraqueza. Com base em suas pesquisas sobre vergonha, coragem e autenticidade, ela nos mostra que viver de forma plena exige aceitar nossas imperfeições — e parar de tentar agradar todo mundo. É um livro transformador para quem se sente sobrecarregado por expectativas e quer viver com mais verdade e compaixão por si mesmo.",
      capa: "/images/livros/livro-2.png",
      categoria: "Bem-estar"
    },
    {
      id: "livro-3",
      titulo: "Eu achava que isso só acontecia comigo",
      autor: "Brené Brown",
      descricao: "Também de Brené Brown, este livro aprofunda o tema da vergonha e do isolamento emocional. A autora explica como muitos de nós acreditamos ser os únicos a enfrentar determinadas inseguranças, quando, na verdade, elas são parte da experiência humana. Com histórias reais e reflexões profundas, Brené ensina caminhos para cultivar empatia, pertencimento e coragem emocional.",
      capa: "/images/livros/livro-3.jpg",
      categoria: "Bem-estar"
    }
  ];

export default function BookRecommendations() {
  const [openBook, setOpenBook] = useState<string | null>(null);

  const openBookHandler = (bookId: string) => {
    setOpenBook(bookId);
  };

  const closeBookHandler = () => {
    setOpenBook(null);
  };

  return (
    <section className="pt-4 pb-8 sm:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
            <span className="text-3xl lg:text-4xl font-bold text-gray-900 ml-2">Livros</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Livros recomendados para sua jornada de bem-estar, beleza e alimentação saudável.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {livros.map((livro) => (
            <div key={livro.id} className="book-card-container w-96 h-[500px]">
              <div 
                className={`book-card ${openBook === livro.id ? 'open' : ''}`}
                onClick={() => openBookHandler(livro.id)}
              >
                {/* Conteúdo interno (página do livro) */}
                <div className="book-content">
                  {/* Botão de fechar */}
                  {openBook === livro.id && (
                    <div 
                      className="close-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeBookHandler();
                      }}
                    >
                      &times;
                    </div>
                  )}
                  
                  {/* Conteúdo da página */}
                  <div className="p-8 md:p-12 pt-16">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{livro.titulo}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      por <span className="font-semibold">{livro.autor}</span>
                    </p>
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs">
                        {livro.categoria}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {livro.descricao}
                    </p>
                  </div>
                </div>

                {/* Capa do livro */}
                <div className="book-cover">
                  {/* Imagem da capa */}
                  <img
                    src={livro.capa}
                    alt={livro.titulo}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                
                {/* Prompt para abrir - fora da capa para não girar */}
                {openBook !== livro.id && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center z-30">
                    <span className="mr-1">Clique para abrir</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estilos CSS exatamente iguais ao código original */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .book-card-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          perspective: 1200px;
        }

        .book-card {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 12px;
        }

        .book-content {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #fdfdfa;
          border-radius: 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          z-index: 5;
          border-left: 3px solid #e2e8f0;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .book-content {
            overflow-y: auto;
          }
        }


        .book-cover {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 10;
          transform-origin: left center;
          transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          cursor: pointer;
          border-radius: 12px;
          box-shadow: 5px 5px 20px rgba(0,0,0,0.3), inset -2px 0 5px rgba(0,0,0,0.2);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          backface-visibility: hidden;
        }


        .book-card.open .book-cover {
          transform: rotateY(-180deg);
          box-shadow: -5px 5px 20px rgba(0,0,0,0.2);
          cursor: default;
        }

        .book-card.open .book-cover {
          border-radius: 12px;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          font-size: 2.5rem;
          line-height: 1;
          color: #a0aec0;
          cursor: pointer;
          transition: color 0.2s, transform 0.2s;
          z-index: 20;
        }

        .close-button:hover {
          color: #4a5568;
          transform: scale(1.1);
        }
        `
      }} />
    </section>
  );
}
