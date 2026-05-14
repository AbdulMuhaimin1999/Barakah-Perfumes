import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import BackLink from '../components/BackLink';
import { useCart } from '../context/CartContext';
import { imageUrl } from '../utils/imageUrl';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container py-6 sm:py-8">
        <BackLink />
        <p className="text-sm text-parchment/60">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container py-12 sm:py-16">
        <BackLink />
        <div className="empty-state mt-4">
          <h1 className="section-title">Product not found</h1>
          <p className="mt-2 text-sm text-parchment/65">This fragrance may have been removed from our catalogue.</p>
          <Link to="/products" className="btn-gold mt-5 inline-block rounded-full">Return to shop</Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!inStock) {
      toast.error('Out of stock');
      return;
    }
    addItem(product);
    toast.success('Added to bag');
  };

  return (
    <div className="page-container max-w-4xl py-6 sm:py-8">
      <BackLink />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-8">
        <div className="panel-dark overflow-hidden rounded-lg p-2 lg:max-w-[14rem]">
          <img src={imageUrl(product.image_url)} alt={product.name} className="aspect-square w-full rounded-md object-cover" />
        </div>

        <div className="panel-dark rounded-lg p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-eyebrow">Fragrance</span>
            {product.category_name && <span className="badge">{product.category_name}</span>}
            <span className={inStock ? 'badge badge-success' : 'badge badge-muted'}>
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <h1 className="page-title mt-3">{product.name}</h1>
          <p className="mt-3 text-xl font-medium text-gold">${Number(product.price).toFixed(2)}</p>
          {inStock && <p className="mt-1 text-xs text-parchment/55">{product.stock} units available</p>}

          <div className="mt-5 border-t border-gold/10 pt-5">
            <p className="text-sm leading-relaxed text-parchment/80">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!inStock}
              className="btn-gold rounded-full px-6 font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to bag
            </button>
            <Link to="/cart" className="btn-outline">View bag</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
