import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, User, Phone, Calendar, Clock, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function ReservePage() {
  const { slug } = useParams();
  const { addReservation, settings } = useData();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    numberOfPeople: '2',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addReservation({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
        numberOfPeople: parseInt(formData.numberOfPeople),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rp-success-screen">
        <div className="rp-success-card">
          <div className="rp-success-icon-wrap">
            <CheckCircle className="rp-success-icon" />
          </div>
          <h2 className="rp-success-title">Reservation Submitted!</h2>
          <p className="rp-success-sub">
            We've received your request for <strong>{formData.numberOfPeople}</strong> people on{' '}
            <strong>{formData.date}</strong> at <strong>{formData.time}</strong>. We'll confirm
            it shortly.
          </p>
          <div className="rp-success-actions">
            <Link to={`/r/${slug}/menu`} className="rp-primary-btn">
              Browse Menu
            </Link>
            <Link to={`/r/${slug}`} className="rp-secondary-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-root">
      {/* Header */}
      <div className="rp-header">
        <div className="rp-header-inner">
          <Link to={`/r/${slug}`} className="rp-back-btn" aria-label="Go back">
            <ArrowLeft className="rp-back-icon" />
          </Link>
          <div>
            <h1 className="rp-header-title">Reserve a Table</h1>
            <p className="rp-header-sub">{settings.name}</p>
          </div>
        </div>
      </div>

      <div className="rp-content">
        {/* Intro banner */}
        <div className="rp-banner">
          <Calendar className="rp-banner-icon" />
          <div>
            <p className="rp-banner-title">Book your experience</p>
            <p className="rp-banner-sub">Reserve your table in just a few steps</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rp-form">
          <div className="rp-fields">
            <div className="rp-field">
              <label htmlFor="rp-name" className="rp-label">
                <User className="rp-label-icon" /> Full Name
              </label>
              <input
                id="rp-name"
                type="text"
                required
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="rp-input"
                placeholder="Enter your name"
              />
            </div>

            <div className="rp-field">
              <label htmlFor="rp-phone" className="rp-label">
                <Phone className="rp-label-icon" /> Phone Number
              </label>
              <input
                id="rp-phone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="rp-input"
                placeholder="Enter phone number"
              />
            </div>

            <div className="rp-field-row">
              <div className="rp-field">
                <label htmlFor="rp-date" className="rp-label">
                  <Calendar className="rp-label-icon" /> Date
                </label>
                <input
                  id="rp-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="rp-input"
                />
              </div>

              <div className="rp-field">
                <label htmlFor="rp-time" className="rp-label">
                  <Clock className="rp-label-icon" /> Time
                </label>
                <input
                  id="rp-time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="rp-input"
                />
              </div>
            </div>

            <div className="rp-field">
              <label htmlFor="rp-people" className="rp-label">
                <Users className="rp-label-icon" /> Number of Guests
              </label>
              <div className="rp-people-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, numberOfPeople: String(num) })}
                    className={`rp-people-btn ${formData.numberOfPeople === String(num) ? 'rp-people-active' : ''}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rp-submit-btn"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>

        <div className="rp-note">
          <p>
            <strong>Note:</strong> Your reservation will be confirmed by the restaurant. You may
            receive a call for verification.
          </p>
        </div>
      </div>
    </div>
  );
}
