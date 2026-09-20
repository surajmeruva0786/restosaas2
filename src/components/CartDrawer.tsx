import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function CartDrawer() {
  const { items, updateQuantity, totalPrice, isOpen, closeCart } = useCart();
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleCheckout = () => {
    closeCart();
    navigate(`/r/${slug}/checkout`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cd-overlay" onClick={closeCart} />

      {/* Drawer */}
      <div className="cd-drawer">
        {/* Header */}
        <div className="cd-header">
          <div className="cd-header-left">
            <div className="cd-header-icon">
              <ShoppingBag className="cd-header-icon-svg" />
            </div>
            <div>
              <h2 className="cd-header-title">Your Cart</h2>
              <p className="cd-header-sub">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={closeCart} className="cd-close-btn" aria-label="Close cart">
            <X className="cd-close-icon" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cd-body">
          {items.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon-wrap">
                <ShoppingBag className="cd-empty-icon" />
              </div>
              <p className="cd-empty-title">Your cart is empty</p>
              <p className="cd-empty-sub">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="cd-items">
              {items.map(item => (
                <div key={item.id} className="cd-item">
                  {/* Veg dot */}
                  <div className={`cd-item-veg ${item.isVeg ? 'cd-veg' : 'cd-nonveg'}`}>
                    <div className={`cd-item-dot ${item.isVeg ? 'cd-dot-veg' : 'cd-dot-nonveg'}`} />
                  </div>

                  {/* Item info */}
                  <div className="cd-item-info">
                    <p className="cd-item-name">{item.name}</p>
                    <p className="cd-item-price">₹{item.price} each</p>
                  </div>

                  {/* Qty + total */}
                  <div className="cd-item-right">
                    <div className="cd-qty-wrap">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="cd-qty-btn"
                        aria-label="Decrease"
                      >
                        {item.quantity === 1 ? <Trash2 className="cd-qty-icon" /> : <Minus className="cd-qty-icon" />}
                      </button>
                      <span className="cd-qty-num">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cd-qty-btn"
                        aria-label="Increase"
                      >
                        <Plus className="cd-qty-icon" />
                      </button>
                    </div>
                    <p className="cd-item-total">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cd-footer">
            <div className="cd-total-row">
              <span className="cd-total-label">Total</span>
              <span className="cd-total-amount">₹{totalPrice}</span>
            </div>
            <button onClick={handleCheckout} className="cd-checkout-btn">
              Proceed to Checkout · ₹{totalPrice}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
