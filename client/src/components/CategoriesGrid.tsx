import { useQuery } from "@tanstack/react-query";
import { CategoryWithDetails } from "@/types";
import { Link } from "wouter";
import { Smartphone, Laptop, Gamepad2, Tv, Headphones, Camera } from "lucide-react";

const categoryIcons = {
  smartphones: Smartphone,
  laptops: Laptop,
  gaming: Gamepad2,
  tvs: Tv,
  audio: Headphones,
  cameras: Camera,
};

const categoryColors = {
  smartphones: "text-blue-600 bg-blue-100 group-hover:bg-blue-200",
  laptops: "text-green-600 bg-green-100 group-hover:bg-green-200",
  gaming: "text-red-600 bg-red-100 group-hover:bg-red-200",
  tvs: "text-purple-600 bg-purple-100 group-hover:bg-purple-200",
  audio: "text-yellow-600 bg-yellow-100 group-hover:bg-yellow-200",
  cameras: "text-indigo-600 bg-indigo-100 group-hover:bg-indigo-200",
};

export default function CategoriesGrid() {
  const { data: categories, isLoading } = useQuery<CategoryWithDetails[]>({
    queryKey: ["/api/categories"],
  });

  // Default categories if no data is available
  const defaultCategories = [
    { id: "1", name: "Smartphones", slug: "smartphones", sortOrder: 0 },
    { id: "2", name: "Laptops", slug: "laptops", sortOrder: 1 },
    { id: "3", name: "Gaming", slug: "gaming", sortOrder: 2 },
    { id: "4", name: "TVs", slug: "tvs", sortOrder: 3 },
    { id: "5", name: "Audio", slug: "audio", sortOrder: 4 },
    { id: "6", name: "Cameras", slug: "cameras", sortOrder: 5 },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {displayCategories.map((category) => {
              const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Smartphone;
              const colorClasses = categoryColors[category.slug as keyof typeof categoryColors] || "text-blue-600 bg-blue-100 group-hover:bg-blue-200";
              
              return (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="text-center group cursor-pointer">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors ${colorClasses}`}>
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
}
