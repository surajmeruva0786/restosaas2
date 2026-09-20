import { Plus, Minus, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { MenuItem } from '../contexts/DataContext';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
    });
  };

  const handleIncrement = () => {
    if (cartItem) updateQuantity(item.id, cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    if (cartItem) updateQuantity(item.id, cartItem.quantity - 1);
  };

  return (
    <div className="mic-card">
      <div className="mic-inner">
        {/* Content */}
        <div className="mic-content">
          {/* Veg indicator */}
          <div className={`mic-veg-badge ${item.isVeg ? 'mic-veg' : 'mic-nonveg'}`}>
            <div className={`mic-veg-dot ${item.isVeg ? 'mic-dot-veg' : 'mic-dot-nonveg'}`} />
          </div>

          <h3 className="mic-name">{item.name}</h3>
          {item.description && (
            <p className="mic-desc">{item.description}</p>
          )}

          <div className="mic-footer">
            <p className="mic-price">₹{item.price}</p>

            {/* Cart Controls */}
            {!item.isAvailable ? (
              <span className="mic-unavailable">Not Available</span>
            ) : cartItem ? (
              <div className="mic-qty-control">
                <button onClick={handleDecrement} className="mic-qty-btn" aria-label="Decrease quantity">
                  <Minus className="mic-qty-icon" />
                </button>
                <span className="mic-qty-count">{cartItem.quantity}</span>
                <button onClick={handleIncrement} className="mic-qty-btn" aria-label="Increase quantity">
                  <Plus className="mic-qty-icon" />
                </button>
              </div>
            ) : (
              <button onClick={handleAdd} className="mic-add-btn">
                <Plus className="mic-add-icon" />
                Add
              </button>
            )}
          </div>
        </div>

        {/* Image */}
        {item.image && !imageError ? (
          <div className="mic-img-wrap">
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="mic-img"
            />
            {cartItem && <div className="mic-img-overlay">{cartItem.quantity} in cart</div>}
          </div>
        )}
      </div>
    </div>
  );
}
