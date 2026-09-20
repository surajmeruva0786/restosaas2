import { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import MenuItemCard from '../../components/MenuItemCard';
import MobileActionBar from '../../components/MobileActionBar';
import CartDrawer from '../../components/CartDrawer';
import FloatingCartButton from '../../components/FloatingCartButton';

export default function MenuPage() {
  const { slug } = useParams();
  const { menuItems, categories, settings } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const availableItems = menuItems.filter(item => item.isAvailable);
  const filteredItems = searchQuery
    ? availableItems.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableItems;

  return (
    <div className="mp-root">
      {/* ── Header ── */}
      <div className="mp-header">
        <div className="mp-header-inner">
          <Link to={`/r/${slug}`} className="mp-back-btn" aria-label="Go back">
            <ArrowLeft className="mp-back-icon" />
          </Link>
          <div className="mp-header-text">
            <h1 className="mp-header-title">{settings.name}</h1>
            <p className="mp-header-sub">{settings.cuisine.join(' · ')}</p>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="mp-search-wrap">
        <div className="mp-search-inner">
          <div className="mp-search-box">
            <Search className="mp-search-icon" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="mp-search-input"
            />
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      {!searchQuery && (
        <div className="mp-tabs-wrap">
          <div className="mp-tabs-inner">
            {categories
              .sort((a, b) => a.order - b.order)
              .map(category => {
                const itemCount = availableItems.filter(
                  item => item.category === category.id
                ).length;
                if (itemCount === 0) return null;

                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`mp-tab ${activeCategory === category.id ? 'mp-tab-active' : ''}`}
                  >
                    {category.name}
                    <span className={`mp-tab-count ${activeCategory === category.id ? 'mp-tab-count-active' : ''}`}>
                      {itemCount}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Menu Items ── */}
      <div className="mp-content">
        {searchQuery ? (
          <div>
            <p className="mp-search-results-label">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
            <div className="mp-items-grid">
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="mp-empty">
                <p className="mp-empty-text">No dishes found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          categories
            .sort((a, b) => a.order - b.order)
            .map(category => {
              const categoryItems = availableItems.filter(
                item => item.category === category.id
              );
              if (categoryItems.length === 0) return null;

              return (
                <div
                  key={category.id}
                  ref={el => (categoryRefs.current[category.id] = el)}
                  className="mp-category-section"
                >
                  <div className="mp-category-header">
                    <h2 className="mp-category-title">{category.name}</h2>
                    <span className="mp-category-count">{categoryItems.length} items</span>
                  </div>
                  <div className="mp-items-grid">
                    {categoryItems.map(item => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
        )}

        {availableItems.length === 0 && (
          <div className="mp-empty">
            <p className="mp-empty-text">No menu items available at the moment</p>
          </div>
        )}
      </div>

      <MobileActionBar />
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}
