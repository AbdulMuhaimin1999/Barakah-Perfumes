import { Link } from 'react-router-dom';
import { imageUrl } from '../utils/imageUrl';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="panel-dark group cursor-pointer overflow-hidden rounded-lg transition hover:-translate-y-px hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden border-b border-gold/15 bg-navy-950">
        <img
          src={imageUrl(product.image_url)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="px-2 py-2 sm:px-2.5 sm:py-2.5">
        <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-xs leading-snug tracking-wide text-parchment group-hover:text-gold sm:text-sm">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-gold-dark sm:text-sm">${Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}
