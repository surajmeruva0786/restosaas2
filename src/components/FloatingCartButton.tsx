import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function FloatingCartButton() {
  const { totalItems, totalPrice, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fcb-btn"
      aria-label={`Open cart, ${totalItems} items`}
    >
      <div className="fcb-icon-wrap">
        <ShoppingBag className="fcb-icon" />
        <span className="fcb-badge">{totalItems}</span>
      </div>
      <span className="fcb-label">View Cart · ₹{totalPrice}</span>
    </button>
  );
}
