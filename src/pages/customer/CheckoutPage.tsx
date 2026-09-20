import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShoppingBag, User, Phone, MapPin, FileText } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useData } from '../../contexts/DataContext';

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder, settings } = useData();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'dine-in' as 'dine-in' | 'takeaway',
    tableNumber: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const order = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      orderType: formData.orderType,
      tableNumber: formData.orderType === 'dine-in' ? formData.tableNumber : undefined,
      notes: formData.notes || undefined,
      total: totalPrice,
      status: 'new' as const,
    };

    try {
      await addOrder(order);
      const newOrderId = `ORD${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);
      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="co-empty-screen">
        <div className="co-empty-card">
          <div className="co-success-icon-wrap co-bg-gray">
            <ShoppingBag className="co-success-icon" />
          </div>
          <h2 className="co-success-title">Your cart is empty</h2>
          <p className="co-success-sub">Add some delicious items from our menu.</p>
          <Link to={`/r/${slug}/menu`} className="co-primary-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="co-empty-screen">
        <div className="co-empty-card">
          <div className="co-success-icon-wrap co-bg-green">
            <CheckCircle className="co-success-icon co-icon-green" />
          </div>
          <h2 className="co-success-title">Order Placed!</h2>
          <p className="co-order-id">Order ID: <strong>{orderId}</strong></p>
          <p className="co-success-sub">
            Thank you for your order at {settings.name}! We'll get started right away.
          </p>
          <div className="co-success-actions">
            <Link to={`/r/${slug}/menu`} className="co-primary-btn">
              Order More
            </Link>
            <Link to={`/r/${slug}`} className="co-secondary-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-root">
      {/* Header */}
      <div className="co-header">
        <div className="co-header-inner">
          <Link to={`/r/${slug}/menu`} className="co-back-btn" aria-label="Go back">
            <ArrowLeft className="co-back-icon" />
          </Link>
          <div>
            <h1 className="co-header-title">Checkout</h1>
            <p className="co-header-sub">{settings.name}</p>
          </div>
        </div>
      </div>

      <div className="co-content">
        {/* Order Summary */}
        <div className="co-card">
          <h2 className="co-card-title">Order Summary</h2>
          <div className="co-order-items">
            {items.map(item => (
              <div key={item.id} className="co-order-item">
                <div className="co-order-item-left">
                  <div className={`co-item-veg ${item.isVeg ? 'co-veg' : 'co-nonveg'}`}>
                    <div className={`co-item-dot ${item.isVeg ? 'co-dot-veg' : 'co-dot-nonveg'}`} />
                  </div>
                  <span className="co-item-name">{item.name}</span>
                  <span className="co-item-qty">× {item.quantity}</span>
                </div>
                <span className="co-item-total">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="co-total-row">
            <span className="co-total-label">Total</span>
            <span className="co-total-amount">₹{totalPrice}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="co-card">
          <h2 className="co-card-title">Your Details</h2>

          <div className="co-form-fields">
            <div className="co-field">
              <label htmlFor="co-name" className="co-label">
                <User className="co-label-icon" /> Full Name
              </label>
              <input
                id="co-name"
                type="text"
                required
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="co-input"
                placeholder="Enter your name"
              />
            </div>

            <div className="co-field">
              <label htmlFor="co-phone" className="co-label">
                <Phone className="co-label-icon" /> Mobile Number
              </label>
              <input
                id="co-phone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="co-input"
                placeholder="Enter mobile number"
              />
            </div>

            <div className="co-field">
              <label className="co-label">
                <MapPin className="co-label-icon" /> Order Type
              </label>
              <div className="co-order-type-grid">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orderType: 'dine-in' })}
                  className={`co-type-btn ${formData.orderType === 'dine-in' ? 'co-type-active' : ''}`}
                >
                  🍽️ Dine-in
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orderType: 'takeaway', tableNumber: '' })}
                  className={`co-type-btn ${formData.orderType === 'takeaway' ? 'co-type-active' : ''}`}
                >
                  🛍️ Takeaway
                </button>
              </div>
            </div>

            {formData.orderType === 'dine-in' && (
              <div className="co-field">
                <label htmlFor="co-table" className="co-label">
                  Table Number
                </label>
                <input
                  id="co-table"
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="co-input"
                  placeholder="e.g. Table 5"
                />
              </div>
            )}

            <div className="co-field">
              <label htmlFor="co-notes" className="co-label">
                <FileText className="co-label-icon" /> Special Instructions
                <span className="co-optional-tag">Optional</span>
              </label>
              <textarea
                id="co-notes"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="co-input co-textarea"
                placeholder="Any special requests or dietary requirements?"
              />
            </div>

            {error && (
              <div className="co-error">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="co-submit-btn"
            >
              {loading ? 'Placing Order...' : `Place Order · ₹${totalPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
