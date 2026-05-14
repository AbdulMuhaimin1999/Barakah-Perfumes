import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const category = searchParams.get('category') || '';

  useEffect(() => {
    Promise.all([api.get('/api/products'), api.get('/api/categories')])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category
        ? (product.category_slug || '').toLowerCase() === category.toLowerCase()
        : true;
      const matchesSearch = search
        ? product.name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const selectCategory = (slug) => {
    if (slug) setSearchParams({ category: slug });
    else setSearchParams({});
  };

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="page-container py-6 sm:py-8">
      <PageHeader
        eyebrow="Barakah Scents"
        title="Fragrance catalogue"
        subtitle={activeCategory ? `Browsing ${activeCategory.name} — ${filtered.length} product${filtered.length === 1 ? '' : 's'}` : 'Explore our full range of authentic luxury perfumes.'}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="scroll-x-tabs -mx-1 px-1 md:flex-wrap md:overflow-visible">
          <button
            type="button"
            onClick={() => selectCategory('')}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${!category ? 'btn-gold text-navy-950' : 'border border-gold/35 bg-navy-900/80 text-parchment/80'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCategory(cat.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${category === cat.slug ? 'btn-gold text-navy-950' : 'border border-gold/35 bg-navy-900/80 text-parchment/80'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="input-luxury w-full rounded-lg px-4 py-2.5 md:max-w-xs"
        />
      </div>

      {loading ? (
        <p className="text-sm text-parchment/60">Loading catalogue...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h2 className="section-title">No fragrances found</h2>
          <p className="mt-2 text-sm text-parchment/65">Try another category or refine your search.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
