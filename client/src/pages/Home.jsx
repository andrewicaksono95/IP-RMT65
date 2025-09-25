import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFruits } from "../slices/fruitSlice";
import { fetchFavorites } from "../slices/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { FruitLoader, LoaderStyles } from "../components/Loaders";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows, count, status } = useSelector(state => state.fruits);
  const { user } = useSelector(state => state.auth);
  const { items: favorites } = useSelector(state => state.favorites);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [offset, setOffset] = useState(0);
  const limit = 12;
  const [hasMore, setHasMore] = useState(true);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const triggerRef = React.useRef(null);

  // Derive loading and error from status
  const loading = status === 'loading';
  const error = status === 'failed' ? 'Failed to load fruits' : null;

  // Helper function to check if fruit is in favorites
  const isFruitInFavorites = (fruitId) => {
    return favorites.some(fav => fav.Fruit?.id === fruitId);
  };

  // Handle sort change - fetch all data when sorting changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (!allDataLoaded) {
      setOffset(0);
      setHasMore(false);
      setAllDataLoaded(true);
      dispatch({ type: 'fruits/reset' });
      dispatch(fetchFruits({ search: searchTerm, offset: 0, limit: 1000 }));
    }
  };

  // Memoized sorted and filtered fruits
  const sortedFruits = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    
    // Filter by search term first
    let filtered = rows;
    if (searchTerm.trim()) {
      filtered = rows.filter(fruit => 
        fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Then sort alphabetically
    return [...filtered].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (sortBy === "desc") {
        return nameB.localeCompare(nameA);
      }
      return nameA.localeCompare(nameB);
    });
  }, [rows, sortBy, searchTerm]);

  // Fetch fruits with pagination - remove searchTerm dependency to prevent API calls on every keystroke
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setAllDataLoaded(false);
    dispatch({ type: 'fruits/reset' });
    dispatch(fetchFruits({ offset: 0, limit }));
  }, [dispatch]);

  // Fetch favorites when user is available
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading || allDataLoaded) return;
    
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && rows.length < count) {
        const nextOffset = rows.length;
        dispatch(fetchFruits({ offset: nextOffset, limit }));
        setOffset(nextOffset);
        if (nextOffset + limit >= count) setHasMore(false);
      }
    }, { threshold: 1 });
    
    if (triggerRef.current) observer.observe(triggerRef.current);
    
    return () => {
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, [triggerRef, hasMore, loading, rows.length, count, dispatch, allDataLoaded]);

  if (loading && rows.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)' }}>
        <FruitLoader message="Loading delicious fruits..." size="large" />
      </div>
    );
  }

  return (
    <>
      <LoaderStyles />
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)', padding: '2rem' }}>
      <div className="container-fluid mb-5" style={{ maxWidth: '1200px' }}>
        <div className="row g-3 justify-content-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg shadow-sm"
                placeholder="🔍 Search for your favorite fruit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: '25px',
                  border: '2px solid #f3e8ff',
                  paddingLeft: '20px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-select-lg shadow-sm"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                borderRadius: '25px',
                border: '2px solid #f3e8ff',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <option value="asc">🍎 A-Z (Alphabetical)</option>
              <option value="desc">🍊 Z-A (Reverse)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        <div className="row g-4">
          {sortedFruits.map(f => (
            <div key={f.id} className="col-lg-3 col-md-4 col-sm-6">
              <div 
                className="card h-100 border-0 shadow-lg position-relative d-flex flex-column card-hover animate-fade-in-scale"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #fdf2f8)',
                  borderRadius: '24px',
                  border: '2px solid #fce7f3',
                  padding: '24px',
                  minHeight: '450px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => navigate(`/fruit/${f.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.2)';
                  e.currentTarget.style.borderColor = '#f472b6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(236, 72, 153, 0.1)';
                  e.currentTarget.style.borderColor = '#fce7f3';
                }}
              >
                <div 
                  className="position-absolute top-0 start-0 end-0"
                  style={{ 
                    height: '6px',
                    background: 'linear-gradient(90deg, #ec4899, #be185d, #ec4899)',
                    borderRadius: '22px 22px 0 0',
                    margin: '2px 2px 0 2px'
                  }}
                />
                
                {/* Favorites Badge */}
                {user && isFruitInFavorites(f.id) && (
                  <div 
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: '12px',
                      right: '8px',
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '50%',
                      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
                      zIndex: 10
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', color: 'white' }}>❤️</span>
                  </div>
                )}
                
                <div className="d-flex justify-content-center mb-4 flex-fill">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                    style={{
                      width: '192px',
                      height: '192px',
                      background: 'linear-gradient(135deg, #fdf2f8, #ffffff)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {f.imageUrl ? (
                      <img
                        src={f.imageUrl}
                        alt={f.name}
                        style={{ 
                          width: f.imageUrl.endsWith('.svg') ? '160px' : '180px',
                          height: f.imageUrl.endsWith('.svg') ? '160px' : '180px',
                          objectFit: 'contain',
                          filter: f.imageUrl.endsWith('.svg') ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none',
                          transition: 'transform 0.3s ease',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const fallbackDiv = e.target.parentElement.querySelector('.fallback-emoji');
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center position-absolute fallback-emoji"
                        style={{ 
                          fontSize: '4rem',
                          top: 0,
                          left: 0
                        }}
                      >
                        🍎
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h3 
                    className="text-center fw-bold mb-0"
                    style={{ 
                      fontSize: '1.5rem',
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      letterSpacing: '-0.025em',
                      lineHeight: '1.2',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {f.name}
                  </h3>
                </div>

                <div className="d-flex flex-column gap-1 mb-4">
                  {f.order && (
                    <span 
                      className="d-flex align-items-center justify-content-center px-2 py-1 rounded-pill text-center small fw-medium shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #dbeafe, #3b82f6)',
                        color: '#1e40af',
                        border: '0.5px solid #93c5fd',
                        minHeight: '24px',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗂️ Order: {f.order}
                    </span>
                  )}
                  {f.family && (
                    <span 
                      className="d-flex align-items-center justify-content-center px-2 py-1 rounded-pill text-center small fw-medium shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #d1fae5, #10b981)',
                        color: '#065f46',
                        border: '0.5px solid #6ee7b7',
                        minHeight: '24px',
                        fontSize: '0.75rem'
                      }}
                    >
                      🌱 Family: {f.family}
                    </span>
                  )}
                  {f.genus && (
                    <span 
                      className="d-flex align-items-center justify-content-center px-2 py-1 rounded-pill text-center small fw-medium shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #ede9fe, #8b5cf6)',
                        color: '#5b21b6',
                        border: '0.5px solid #c4b5fd',
                        minHeight: '24px',
                        fontSize: '0.75rem'
                      }}
                    >
                      🧬 Genus: {f.genus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div ref={triggerRef} className="text-center mt-5 text-muted" style={{ minHeight: '32px' }}>
          {rows.length < count ? `Showing ${rows.length} of ${count} fruits` : `All ${count} fruits loaded`}
        </div>
      </div>
    </div>
    </>
  );
}
