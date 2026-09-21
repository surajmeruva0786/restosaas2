import { Link, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  UtensilsCrossed,
  Calendar,
  MessageSquare,
  Info,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import MobileActionBar from '../../components/MobileActionBar';
import CartDrawer from '../../components/CartDrawer';
import FloatingCartButton from '../../components/FloatingCartButton';
import { useRef } from 'react';

export default function RestaurantHome() {
  const { slug } = useParams();
  const { settings, feedbacks } = useData();

  const averageRating = feedbacks?.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : settings.rating;

  const menuRef = useRef<HTMLDivElement>(null);
  const reserveRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDirections = () => {
    if (settings.directionsUrl && settings.directionsUrl.trim()) {
      window.open(settings.directionsUrl.trim(), '_blank', 'noopener,noreferrer');
    } else if (settings.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${settings.phone}`;
  };

  return (
    <div className="rh-root">
      {/* ── Hero Section ── */}
      <div className="rh-hero">
        {/* Decorative orbs */}
        <div className="rh-orb rh-orb-1" />
        <div className="rh-orb rh-orb-2" />

        <div className="rh-hero-inner">
          {/* Status pill */}
          <div className="rh-status-row">
            <span className={`rh-status-pill ${settings.isOpen ? 'rh-status-open' : 'rh-status-closed'}`}>
              <span className={`rh-status-dot ${settings.isOpen ? 'rh-dot-open' : 'rh-dot-closed'}`} />
              {settings.isOpen ? 'Open Now' : 'Closed'}
            </span>

            {averageRating && (
              <span className="rh-rating-pill">
                <Star className="rh-star-icon" />
                {averageRating}
                <span className="rh-rating-sub">({feedbacks?.length || 0} reviews)</span>
              </span>
            )}
          </div>

          {/* Restaurant Title — the main attraction */}
          <h1 className="rh-restaurant-title">{settings.name}</h1>

          {/* Cuisine — dot-separated, no boxes */}
          <p className="rh-cuisine-text">
            {settings.cuisine.join(' · ')}
          </p>

          {/* CTA Buttons */}
          <div className="rh-cta-grid">
            <Link to={`/r/${slug}/menu`} className="rh-cta-primary">
              <UtensilsCrossed className="rh-cta-icon" />
              View Menu
            </Link>
            <Link to={`/r/${slug}/reserve`} className="rh-cta-secondary">
              <Calendar className="rh-cta-icon" />
              Reserve Table
            </Link>
            <button onClick={handleDirections} className="rh-cta-secondary">
              <Navigation className="rh-cta-icon" />
              Directions
            </button>
            <button onClick={handleCall} className="rh-cta-secondary">
              <Phone className="rh-cta-icon" />
              Call Us
            </button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="rh-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#f8f7f4" />
          </svg>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div className="rh-info-strip">
        <div className="rh-info-card" onClick={undefined} title="Opening Hours">
          <div className="rh-info-icon-wrap rh-icon-amber">
            <Clock className="rh-info-icon" />
          </div>
          <div>
            <p className="rh-info-label">Opening Hours</p>
            <p className="rh-info-value">{settings.openingHours}</p>
          </div>
        </div>

        <div className="rh-info-card rh-info-card-clickable" onClick={handleDirections} title="Get Directions">
          <div className="rh-info-icon-wrap rh-icon-rose">
            <MapPin className="rh-info-icon" />
          </div>
          <div>
            <p className="rh-info-label">Location</p>
            <p className="rh-info-value">{settings.address}</p>
          </div>
        </div>

        <div className="rh-info-card" title="Contact">
          <div className="rh-info-icon-wrap rh-icon-emerald">
            <Phone className="rh-info-icon" />
          </div>
          <div>
            <p className="rh-info-label">Contact</p>
            <p className="rh-info-value">{settings.phone}</p>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="rh-nav-wrap">
        <div className="rh-nav-inner">
          {[
            { ref: menuRef, icon: UtensilsCrossed, label: 'Menu' },
            { ref: reserveRef, icon: Calendar, label: 'Reservations' },
            { ref: feedbackRef, icon: MessageSquare, label: 'Feedback' },
            { ref: aboutRef, icon: Info, label: 'About' },
          ].map(({ ref, icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => scrollToSection(ref)}
              className="rh-nav-tab"
            >
              <Icon className="rh-nav-icon" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="rh-sections">
        {/* Menu Section */}
        <div ref={menuRef} className="rh-section-anchor">
          <div className="rh-section-header">
            <div>
              <h2 className="rh-section-title">Our Menu</h2>
              <p className="rh-section-sub">Explore our handcrafted dishes</p>
            </div>
            <Link to={`/r/${slug}/menu`} className="rh-section-link">
              View All <ChevronRight className="rh-chevron" />
            </Link>
          </div>
          <div className="rh-section-card rh-section-card-menu">
            <div className="rh-section-card-body">
              <div className="rh-section-icon-wrap rh-bg-amber">
                <UtensilsCrossed className="rh-section-icon" />
              </div>
              <h3 className="rh-section-card-title">Browse Our Full Menu</h3>
              <p className="rh-section-card-desc">
                Discover our wide selection of authentic dishes, freshly prepared with premium ingredients.
              </p>
              <Link to={`/r/${slug}/menu`} className="rh-action-btn">
                Open Menu
                <ChevronRight className="rh-btn-chevron" />
              </Link>
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div ref={reserveRef} className="rh-section-anchor">
          <div className="rh-section-header">
            <div>
              <h2 className="rh-section-title">Table Reservations</h2>
              <p className="rh-section-sub">Book your perfect dining experience</p>
            </div>
          </div>
          <div className="rh-section-card rh-section-card-reserve">
            <div className="rh-section-card-body">
              <div className="rh-section-icon-wrap rh-bg-indigo">
                <Calendar className="rh-section-icon" />
              </div>
              <h3 className="rh-section-card-title">Reserve a Table</h3>
              <p className="rh-section-card-desc">
                Plan ahead and guarantee your spot. We'll confirm your booking shortly.
              </p>
              <Link to={`/r/${slug}/reserve`} className="rh-action-btn rh-btn-indigo">
                Reserve Now
                <ChevronRight className="rh-btn-chevron" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div ref={feedbackRef} className="rh-section-anchor">
          <div className="rh-section-header">
            <div>
              <h2 className="rh-section-title">Share Your Feedback</h2>
              <p className="rh-section-sub">Your experience matters to us</p>
            </div>
          </div>
          <div className="rh-section-card rh-section-card-feedback">
            <div className="rh-section-card-body">
              <div className="rh-section-icon-wrap rh-bg-rose">
                <MessageSquare className="rh-section-icon" />
              </div>
              <h3 className="rh-section-card-title">Leave a Review</h3>
              <p className="rh-section-card-desc">
                Enjoyed your meal? Tell us how we did — it helps us serve you better.
              </p>
              <Link to={`/r/${slug}/feedback`} className="rh-action-btn rh-btn-rose">
                Give Feedback
                <ChevronRight className="rh-btn-chevron" />
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} className="rh-section-anchor">
          <div className="rh-section-header">
            <div>
              <h2 className="rh-section-title">About Us</h2>
              <p className="rh-section-sub">Our story & information</p>
            </div>
          </div>
          <div className="rh-about-card">
            <p className="rh-about-desc">
              Welcome to <strong>{settings.name}</strong>. We serve authentic{' '}
              {settings.cuisine.join(' · ')} cuisine with a passionate focus on quality, taste,
              and an unforgettable dining experience.
            </p>

            <div className="rh-about-details">
              <div
                className="rh-about-row rh-about-row-clickable"
                onClick={handleDirections}
                title="Get Directions"
              >
                <div className="rh-about-icon-wrap rh-icon-rose">
                  <MapPin className="rh-about-icon" />
                </div>
                <div>
                  <p className="rh-about-row-label">Address</p>
                  <p className="rh-about-row-value">{settings.address}</p>
                </div>
                <Navigation className="rh-about-nav-icon" />
              </div>

              <div className="rh-about-divider" />

              <div className="rh-about-row">
                <div className="rh-about-icon-wrap rh-icon-amber">
                  <Clock className="rh-about-icon" />
                </div>
                <div>
                  <p className="rh-about-row-label">Hours</p>
                  <p className="rh-about-row-value">{settings.openingHours}</p>
                </div>
              </div>

              <div className="rh-about-divider" />

              <div className="rh-about-row">
                <div className="rh-about-icon-wrap rh-icon-emerald">
                  <Phone className="rh-about-icon" />
                </div>
                <div>
                  <p className="rh-about-row-label">Phone</p>
                  <p className="rh-about-row-value">{settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileActionBar />
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}
