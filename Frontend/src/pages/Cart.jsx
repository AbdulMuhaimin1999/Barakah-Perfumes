import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PageHeader from '../components/PageHeader';
import { imageUrl } from '../utils/imageUrl';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-container py-10 sm:py-12">
        <div className="empty-state mx-auto max-w-md">
          <h1 className="section-title">Your bag is empty</h1>
          <p className="mt-2 text-sm text-parchment/65">Browse our catalogue and add fragrances to continue.</p>
          <Link to="/products" className="btn-gold mt-5 inline-block rounded-full">
            Shop fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl py-6 sm:py-8">
      <PageHeader
        eyebrow="Checkout"
        title="Shopping bag"
        subtitle={`${items.length} item${items.length === 1 ? '' : 's'} in your order`}
      />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product_id} className="panel-dark flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center">
            <img src={imageUrl(item.image_url)} alt={item.name} className="h-14 w-14 shrink-0 self-center rounded-md border border-gold/20 object-cover sm:h-16 sm:w-16" />
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-sm text-parchment">{item.name}</h2>
                <p className="text-sm text-gold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="touch-target rounded border border-gold/30 text-gold-dark">−</button>
                <span className="min-w-6 text-center text-sm text-parchment">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="touch-target rounded border border-gold/30 text-gold-dark">+</button>
                <button type="button" onClick={() => removeItem(item.product_id)} className="ml-auto text-xs uppercase tracking-wide text-red-400 hover:text-red-300">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-dark mt-5 rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-gold/10 pb-3 text-sm text-parchment/80">
          <span>Subtotal</span>
          <span className="text-base font-medium text-parchment">${total.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-xs text-parchment/50">Shipping calculated at checkout. Cash on delivery available.</p>
        <Link to="/checkout" className="btn-gold mt-4 block w-full rounded-full text-center">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
