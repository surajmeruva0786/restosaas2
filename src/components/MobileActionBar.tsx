import { UtensilsCrossed, ShoppingBag, Phone, Home, MessageCircle } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';

export default function MobileActionBar() {
  const { slug } = useParams();
  const { totalItems, openCart } = useCart();
  const { settings } = useData();
  const location = useLocation();

  const handleCall = () => {
    window.location.href = `tel:${settings.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const isActive = (path: string) => location.pathname === `/r/${slug}${path}`;

  return (
    <div className="mab-root">
      <Link
        to={`/r/${slug}`}
        className={`mab-item ${isActive('') ? 'mab-item-active' : ''}`}
      >
        <Home className="mab-icon" />
        <span className="mab-label">Home</span>
      </Link>

      <Link
        to={`/r/${slug}/menu`}
        className={`mab-item ${isActive('/menu') ? 'mab-item-active' : ''}`}
      >
        <UtensilsCrossed className="mab-icon" />
        <span className="mab-label">Menu</span>
      </Link>

      <button onClick={openCart} className="mab-item mab-cart-wrap">
        <div className="mab-cart-btn">
          <ShoppingBag className="mab-cart-icon" />
          {totalItems > 0 && (
            <span className="mab-cart-badge">{totalItems}</span>
          )}
        </div>
      </button>

      <button onClick={handleCall} className="mab-item">
        <Phone className="mab-icon" />
        <span className="mab-label">Call</span>
      </button>

      <button onClick={handleWhatsApp} className="mab-item">
        <MessageCircle className="mab-icon" />
        <span className="mab-label">WhatsApp</span>
      </button>
    </div>
  );
}
