import { useState, useEffect } from "react";
import type { BlogPost } from "../lib/notion";

interface Props {
  initialPosts: BlogPost[];
  initialCategory?: string;
}

export default function BlogGrid({
  initialPosts,
  initialCategory = "",
}: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Efecto para cargar los posts iniciales
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadInitialPosts = async () => {
      try {
        const response = await fetch("/api/blog", { signal });
        const data = await response.json();
        setPosts(data);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching initial posts:", error);
        }
      }
    };

    loadInitialPosts();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setIsHydrated(true);
    // Extraer categorías únicas de los posts
    const uniqueCategories = Array.from(
      new Set(posts.flatMap((post) => post.tags)),
    ).sort();
    setCategories(uniqueCategories);
  }, [posts]);

  const handleCategoryClick = async (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);

    // Crear un nuevo AbortController para esta petición
    const controller = new AbortController();
    const signal = controller.signal;

    // Limpiar la petición cuando el componente se desmonte
    useEffect(() => {
      return () => {
        controller.abort();
      };
    }, []);

    try {
      const response = await fetch(
        `/api/blog${category ? `?category=${encodeURIComponent(category)}` : ""}`,
        { signal },
      );
      const data = await response.json();
      setPosts(data);
    } catch (error: unknown) {
      // Solo actualizar el estado si el error no es por cancelación
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching posts:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar el contenido inicial mientras se hidrata
  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialPosts.map((post) => (
          <a key={post.slug} href={`/blog/${post.slug}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {post.coverImage && (
                <div className="relative h-48">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <time
                  dateTime={post.date}
                  className="block mt-4 text-sm text-gray-500"
                >
                  {new Date(post.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escribo sobre tecnología, desarrollo de software, liderazgo y
            productividad. Mis artículos son una mezcla de reflexiones
            personales, experiencias profesionales y consejos prácticos. ¡Espero
            que te gusten!
          </p>
        </div>

        {/* Filtros de categorías */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryClick("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-[#4f46e5] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#4f46e5] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de posts */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4f46e5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {post.coverImage && (
                    <div className="relative h-48">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <time
                      dateTime={post.date}
                      className="block mt-4 text-sm text-gray-500"
                    >
                      {new Date(post.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Mensaje si no hay posts */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {selectedCategory
                ? `No hay artículos en la categoría "${selectedCategory}".`
                : "No hay artículos disponibles."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
