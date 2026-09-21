import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export default function FeedbackPage() {
  const { slug } = useParams();
  const { addFeedback, settings } = useData();

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    customerName: '',
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }

    setLoading(true);
    try {
      await addFeedback({
        rating: formData.rating,
        comment: formData.comment,
        customerName: formData.customerName || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fb-success-screen">
        <div className="fb-success-card">
          <div className="fb-success-icon-wrap">
            <CheckCircle className="fb-success-icon" />
          </div>
          <h2 className="fb-success-title">Thank You!</h2>
          <div className="fb-success-stars">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                className={`fb-success-star ${s <= formData.rating ? 'fb-star-filled' : 'fb-star-empty'}`}
              />
            ))}
          </div>
          <p className="fb-success-sub">
            Your feedback has been submitted. We truly appreciate you taking the time!
          </p>
          <div className="fb-success-actions">
            <Link to={`/r/${slug}/menu`} className="fb-primary-btn">
              Browse Menu
            </Link>
            <Link to={`/r/${slug}`} className="fb-secondary-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayRating = hoveredRating || formData.rating;

  return (
    <div className="fb-root">
      {/* Header */}
      <div className="fb-header">
        <div className="fb-header-inner">
          <Link to={`/r/${slug}`} className="fb-back-btn" aria-label="Go back">
            <ArrowLeft className="fb-back-icon" />
          </Link>
          <div>
            <h1 className="fb-header-title">Share Feedback</h1>
            <p className="fb-header-sub">{settings.name}</p>
          </div>
        </div>
      </div>

      <div className="fb-content">
        <form onSubmit={handleSubmit} className="fb-form">
          {/* Rating Section */}
          <div className="fb-rating-card">
            <div className="fb-rating-header">
              <MessageSquare className="fb-rating-header-icon" />
              <h2 className="fb-rating-title">How was your experience?</h2>
            </div>

            <div className="fb-stars-row">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="fb-star-btn"
                  aria-label={`Rate ${rating} stars`}
                >
                  <Star
                    className={`fb-star ${
                      rating <= displayRating ? 'fb-star-active' : 'fb-star-inactive'
                    } ${rating <= displayRating && rating === displayRating ? 'fb-star-last' : ''}`}
                  />
                </button>
              ))}
            </div>

            {displayRating > 0 && (
              <p className="fb-rating-label">{RATING_LABELS[displayRating]}</p>
            )}
          </div>

          <div className="fb-fields">
            <div className="fb-field">
              <label htmlFor="fb-comment" className="fb-label">
                Your Comments <span className="fb-required">*</span>
              </label>
              <textarea
                id="fb-comment"
                rows={5}
                required
                value={formData.comment}
                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                className="fb-input fb-textarea"
                placeholder="Tell us about your experience — food, service, ambiance..."
              />
            </div>

            <div className="fb-field">
              <label htmlFor="fb-name" className="fb-label">
                Your Name
                <span className="fb-optional-tag">Optional</span>
              </label>
              <input
                id="fb-name"
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="fb-input"
                placeholder="Enter your name"
              />
            </div>

            {error && (
              <div className="fb-error">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="fb-submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
