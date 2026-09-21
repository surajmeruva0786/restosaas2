import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, Phone, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdminReservations() {
  const { reservations, updateReservationStatus } = useData();

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: AlertCircle,
      style: { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' },
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle,
      style: { background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' },
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Reservations</h1>
          <p style={{ color: '#6b7280', fontSize: '.875rem', margin: '4px 0 0' }}>
            {reservations.length} total · {reservations.filter(r => r.status === 'confirmed').length} confirmed
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16,
          padding: '4rem 2rem', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56,
            background: '#f3f4f6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Calendar size={24} color="#9ca3af" />
          </div>
          <p style={{ color: '#374151', fontWeight: 600, fontSize: '1rem', margin: '0 0 .375rem' }}>No reservations yet</p>
          <p style={{ color: '#9ca3af', fontSize: '.875rem', margin: 0 }}>Reservations will appear here once customers book</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Customer', 'Date & Time', 'Guests', 'Contact', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '.75rem',
                      fontWeight: 700,
                      color: '#6b7280',
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      background: '#fafafa',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedReservations.map((reservation, idx) => {
                  const config = statusConfig[reservation.status as keyof typeof statusConfig] || statusConfig.pending;
                  const Icon = config.icon;
                  return (
                    <tr key={reservation.id} style={{
                      borderBottom: idx < sortedReservations.length - 1 ? '1px solid #f9fafb' : 'none',
                      transition: 'background .12s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafafa'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                    >
                      {/* Customer */}
                      <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                          <div style={{
                            width: 32, height: 32,
                            background: 'linear-gradient(135deg, #fffbeb, #fde68a)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <User size={14} color="#b45309" />
                          </div>
                          <span style={{ fontSize: '.9rem', fontWeight: 600, color: '#111827' }}>
                            {reservation.customerName}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', marginBottom: '.25rem' }}>
                          <Calendar size={13} color="#9ca3af" />
                          <span style={{ fontSize: '.85rem', color: '#374151' }}>
                            {new Date(reservation.date).toLocaleDateString('en-IN', {
                              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>
                          <Clock size={13} color="#9ca3af" />
                          <span style={{ fontSize: '.85rem', color: '#6b7280' }}>{reservation.time}</span>
                        </div>
                      </td>

                      {/* Guests */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>
                          <Users size={14} color="#9ca3af" />
                          <span style={{ fontSize: '.9rem', color: '#374151', fontWeight: 500 }}>
                            {reservation.numberOfPeople} {reservation.numberOfPeople === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>
                          <Phone size={13} color="#9ca3af" />
                          <span style={{ fontSize: '.85rem', color: '#6b7280' }}>{reservation.customerPhone}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                          padding: '.3rem .75rem', borderRadius: 999,
                          fontSize: '.75rem', fontWeight: 600,
                          ...config.style,
                        }}>
                          <Icon size={12} />
                          {config.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <select
                          value={reservation.status}
                          onChange={e => updateReservationStatus(reservation.id, e.target.value as any)}
                          style={{
                            padding: '.4rem .75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: '.8rem',
                            color: '#374151',
                            background: '#fff',
                            outline: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
