import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";
import { Smartphone, Laptop, Headphones, Tv } from "lucide-react";

// Mapeamento de slugs para ícones do Lucide
const categoryIcons: Record<string, React.ElementType> = {
  'smartphones': Smartphone,
  'notebooks': Laptop,
  'fones-de-ouvido': Headphones,
  'smart-tvs': Tv,
};

const CategoriesGrid = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explorar por Categoria
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre reviews e ofertas organizadas por tipo de produto.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {categories?.map((category) => {
              const IconComponent = categoryIcons[category.slug] || Smartphone;
              
              return (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="text-center group cursor-pointer">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: `${category.color || '#000'}20`,
                        color: category.color || '#000'
                      }}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ver produtos
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesGrid;
