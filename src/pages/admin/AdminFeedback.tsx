import { useData } from '../../contexts/DataContext';
import { Star, MessageSquare } from 'lucide-react';

export default function AdminFeedback() {
  const { feedbacks } = useData();

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length)
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage:
      feedbacks.length > 0
        ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
        : 0,
  }));

  const ratingLabel = (r: number) => {
    if (r >= 4.5) return { label: 'Excellent', color: '#15803d' };
    if (r >= 3.5) return { label: 'Good', color: '#ca8a04' };
    if (r >= 2.5) return { label: 'Average', color: '#ea580c' };
    return { label: 'Needs Improvement', color: '#dc2626' };
  };

  const { label: rLabel, color: rColor } = ratingLabel(averageRating);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Customer Feedback</h1>
        <p style={{ color: '#6b7280', fontSize: '.875rem', margin: '4px 0 0' }}>
          {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'} collected
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Average rating */}
        <div style={{
          background: '#fff', border: '1px solid #f3f4f6',
          borderRadius: 16, padding: '1.5rem',
        }}>
          <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
            Average Rating
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <div>
              <span style={{
                fontSize: '3.5rem', fontWeight: 800, color: '#111827',
                lineHeight: 1, display: 'block',
              }}>
                {averageRating.toFixed(1)}
              </span>
              <div style={{ display: 'flex', gap: 2, margin: '.5rem 0 .25rem' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={18}
                    style={{
                      fill: i <= Math.round(averageRating) ? '#f59e0b' : 'none',
                      color: i <= Math.round(averageRating) ? '#f59e0b' : '#d1d5db',
                    }}
                  />
                ))}
              </div>
              <span style={{
                fontSize: '.75rem', fontWeight: 700,
                color: rColor,
                background: rColor + '14',
                padding: '.2rem .6rem',
                borderRadius: 999,
              }}>{rLabel}</span>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div style={{
          background: '#fff', border: '1px solid #f3f4f6',
          borderRadius: 16, padding: '1.5rem',
        }}>
          <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
            Rating Breakdown
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, width: 28, flexShrink: 0 }}>
                  <span style={{ fontSize: '.8rem', fontWeight: 600, color: '#374151' }}>{rating}</span>
                  <Star size={11} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                </div>
                <div style={{
                  flex: 1, height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                    borderRadius: 999,
                    transition: 'width .6s ease',
                  }} />
                </div>
                <span style={{ fontSize: '.75rem', color: '#9ca3af', width: 20, textAlign: 'right', flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback list */}
      {feedbacks.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16,
          padding: '4rem 2rem', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, background: '#f3f4f6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
          }}>
            <MessageSquare size={22} color="#9ca3af" />
          </div>
          <p style={{ color: '#374151', fontWeight: 600, fontSize: '1rem', margin: '0 0 .375rem' }}>No feedback yet</p>
          <p style={{ color: '#9ca3af', fontSize: '.875rem', margin: 0 }}>Customer reviews will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {feedbacks.map(feedback => (
            <div key={feedback.id} style={{
              background: '#fff',
              border: '1px solid #f3f4f6',
              borderRadius: 16,
              padding: '1.25rem 1.5rem',
              transition: 'box-shadow .15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38,
                    background: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.9rem', fontWeight: 700, color: '#ea580c',
                    flexShrink: 0,
                  }}>
                    {feedback.customerName
                      ? feedback.customerName.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '.9rem', color: '#111827' }}>
                      {feedback.customerName || 'Anonymous'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '.75rem', color: '#9ca3af' }}>
                      {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      style={{
                        fill: i <= feedback.rating ? '#f59e0b' : 'none',
                        color: i <= feedback.rating ? '#f59e0b' : '#d1d5db',
                      }}
                    />
                  ))}
                </div>
              </div>

              {feedback.comment && (
                <p style={{
                  margin: 0,
                  fontSize: '.9rem',
                  color: '#4b5563',
                  lineHeight: 1.65,
                  paddingTop: '.875rem',
                  borderTop: '1px solid #f9fafb',
                }}>
                  "{feedback.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
