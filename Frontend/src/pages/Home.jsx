import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import TrustBar from '../components/TrustBar';
import { BRAND_IMAGE, CATEGORY_IMAGES } from '../utils/imageUrl';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/api/products').then((res) => {
      setFeatured((res.data.products || []).slice(0, 8));
    });
  }, []);

  const collections = [
    { slug: 'men', title: 'For him', label: 'Men' },
    { slug: 'women', title: 'For her', label: 'Women' },
    { slug: 'luxury', title: 'Luxury edit', label: 'Luxury' },
    { slug: 'arabic', title: 'Arabic house', label: 'Arabic' },
  ];

  return (
    <div>
      <section className="relative min-h-[50vh] overflow-hidden sm:min-h-[55vh] lg:min-h-[60vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_55%),linear-gradient(165deg,rgba(10,8,6,0.6)_0%,rgba(10,8,6,0.4)_50%,rgba(10,8,6,0.7)_100%)]" />
        <div className="page-container relative flex min-h-[50vh] flex-col items-center justify-center py-12 text-center sm:min-h-[55vh] sm:py-14 lg:min-h-[60vh]">
          <img src={BRAND_IMAGE} alt="" className="seal-ring mb-4 h-16 w-16 rounded-full border-2 border-gold object-cover sm:h-20 sm:w-20" />
          <p className="section-eyebrow text-gold-light">Signature of Soul</p>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-2xl leading-tight text-parchment sm:text-3xl md:text-4xl">
            Barakah Scents
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-parchment/75 sm:text-base">
            Discover curated luxury fragrances crafted with tradition, elegance, and lasting impression.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn-gold rounded-full font-semibold uppercase tracking-[0.12em]">
              Shop collection
            </Link>
            <Link to="/products" className="btn-outline">
              Browse all
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="page-container py-8 sm:py-10">
        <div className="panel-dark grid items-center gap-4 overflow-hidden rounded-xl lg:grid-cols-2">
          <div className="relative min-h-[10rem] sm:min-h-[11rem] lg:min-h-[13rem]">
            <img src={BRAND_IMAGE} alt="Barakah Scents seal" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/25" />
          </div>
          <div className="p-5 sm:p-6">
            <p className="section-eyebrow">Our house</p>
            <h2 className="section-title mt-2">Crafted with intention</h2>
            <p className="mt-3 text-sm leading-relaxed text-parchment/75">
              Each fragrance is selected for quality, longevity, and presentation — reflecting the gold-on-black identity of our brand.
            </p>
            <Link to="/products" className="btn-gold mt-5 inline-block rounded-full font-semibold uppercase tracking-[0.12em]">
              View collection
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container py-8 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Collections</p>
            <h2 className="section-title mt-1">Shop by category</h2>
          </div>
          <Link to="/products" className="text-link">View all</Link>
        </div>
        <div className="collection-grid">
          {collections.map((item) => (
            <Link
              key={item.slug}
              to={`/products?category=${item.slug}`}
              className="group relative max-h-44 cursor-pointer overflow-hidden rounded-lg border border-gold/20 shadow-sm transition hover:border-gold/40 sm:max-h-48"
            >
              <img
                src={CATEGORY_IMAGES[item.slug]}
                alt={item.label}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/20 to-transparent" />
              <div className="absolute bottom-0 p-2.5">
                <p className="text-[9px] uppercase tracking-[0.14em] text-gold-light">{item.label}</p>
                <p className="font-[family-name:var(--font-display)] text-sm text-parchment">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel-navy py-8 sm:py-10">
        <div className="page-container">
          <div className="mb-6 text-center">
            <p className="section-eyebrow text-gold-light">Featured</p>
            <h2 className="section-title mt-1">Best-selling fragrances</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-parchment/65">Customer favourites, handpicked from our catalogue.</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
