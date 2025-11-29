import type { BlogPost } from '@app/providers/NotionProvider';
import { useEffect, useMemo, useState } from 'react';


interface Props {
  initialPosts: BlogPost[];
  initialCategory?: string;
}

export default function BlogGrid({ initialPosts, initialCategory = '' }: Props) {
  const filterPosts = (category: string) =>
    category
      ? initialPosts.filter((post) => post.tags.includes(category))
      : initialPosts;

  const categories = useMemo(
    () =>
      Array.from(new Set(initialPosts.flatMap((post) => post.tags))).sort(),
    [initialPosts]
  );

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(() =>
    filterPosts(initialCategory)
  );

  useEffect(() => {
    setFilteredPosts(filterPosts(initialCategory));
    setSelectedCategory(initialCategory);
  }, [initialCategory, initialPosts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('category') || '';

    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
      setFilteredPosts(filterPosts(categoryFromUrl));
    }
  }, [categories]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setFilteredPosts(filterPosts(category));

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (category) {
        url.searchParams.set('category', category);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState(null, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-base pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">Blog</h1>
          <p className="text-xl text-surface-light max-w-2xl mx-auto">
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
                  ? "bg-primary text-accent"
                  : "bg-base text-surface hover:bg-gray-100"
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
                    ? "bg-primary text-accent"
                    : "bg-base text-surface hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group h-full"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105 flex flex-col h-full">
                {post.coverImage && (
                  <div className="relative h-48">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-primary-dark mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-surface-base mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary text-accent text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <time
                      dateTime={post.date}
                      className="block text-sm text-gray-500"
                    >
                      {new Date(post.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Mensaje si no hay posts */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-surface-light text-lg">
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
