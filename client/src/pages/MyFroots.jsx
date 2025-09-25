import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../slices/favoriteSlice.js';
import { fetchSuggestions } from '../slices/aiSlice.js';
import { cuteAlert } from '../utils/alerts.js';

export default function MyFroots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favs = useSelector(s => s.favorites.items);
  const { suggestions, suggestionsLoading } = useSelector(s => s.ai);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Helper function to convert markdown bold to HTML
  const formatBoldText = (text) => {
    if (!text) return '';
    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  console.log('MyFroots - suggestions:', suggestions, 'loading:', suggestionsLoading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (favs.length > 0 && showSuggestions) {
      const favoriteIds = favs.map(f => f.Fruit?.id).filter(Boolean);
      console.log('MyFroots - favoriteIds:', favoriteIds);
      if (favoriteIds.length > 0) {
        dispatch(fetchSuggestions(favoriteIds));
      }
    }
  }, [dispatch, favs, showSuggestions]);

  async function remove(id, fruitName) {
    const confirmed = await cuteAlert.confirm(
      `Are you sure you want to remove ${fruitName} from your favorites? 💔`,
      () => {
        dispatch(removeFavorite(id));
      },
      null,
      {
        icon: '🤔',
        color: '#f59e0b'
      }
    );
  }

  return (
    <div 
      className="min-vh-100" 
      style={{ 
        background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)', 
        padding: '1.5rem' 
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#374151' }}>
            💕 My Favorite Fruits
          </h1>
          <p className="mb-0" style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            Your personal collection of {favs.length} favorite fruit{favs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favs.length > 0 ? (
          <div 
            className="card border-0 shadow-lg mb-4" 
            style={{ 
              background: 'linear-gradient(145deg, #ffffff, #fdf2f8)', 
              borderRadius: '20px', 
              border: '2px solid #fce7f3' 
            }}
          >
            <div className="card-body" style={{ padding: '2rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-4" 
                   style={{ borderBottom: '2px solid #fce7f3', paddingBottom: '1rem' }}>
                <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: '#374151' }}>
                  🍎 {favs.length} favorite fruit{favs.length !== 1 ? 's' : ''}
                </h2>
                <button
                  className="btn shadow-sm"
                  style={{
                    background: showSuggestions ? 'linear-gradient(135deg, #be185d, #9d174d)' : 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  {showSuggestions ? '🤖 Hide Suggestions' : '🤖 Get Suggestions'}
                </button>
              </div>

              <div className="row g-3">
                {favs.map(f => (
                  <div key={f.id} className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100" 
                         style={{ 
                           background: 'linear-gradient(145deg, #ffffff, #fefcfd)', 
                           border: '2px solid #fce7f3',
                           borderRadius: '15px',
                           cursor: 'pointer',
                           transition: 'all 0.3s ease'
                         }}
                         onClick={() => navigate(`/fruit/${f.Fruit?.id}`)}>
                      <div style={{ 
                        height: '6px', 
                        background: 'linear-gradient(135deg, #ec4899, #be185d)', 
                        borderRadius: '13px 13px 0 0',
                        margin: '2px 2px 0 2px'
                      }}></div>
                      
                      <div className="card-body" style={{ padding: '1.5rem' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h3 className="fw-bold mb-1" style={{ fontSize: '1.2rem', color: '#374151' }}>
                              🍎 {f.Fruit?.name || 'Unknown'}
                            </h3>
                            <p className="text-muted mb-0 small">Added to favorites</p>
                          </div>
                          <button 
                            className="btn btn-sm shadow-sm"
                            style={{
                              background: 'linear-gradient(135deg, #f87171, #dc2626)',
                              color: 'white',
                              border: 'none',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '8px',
                              fontSize: '0.7rem'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(f.id, f.Fruit?.name || 'this fruit');
                            }}
                          >
                            🗑️ Remove
                          </button>
                        </div>

                        {f.Fruit && (
                          <div className="row g-2 text-center">
                            <div className="col-6">
                              <div className="small">
                                <div className="fw-bold" style={{ color: '#f59e0b' }}>⚡ {f.Fruit.calories || 0}</div>
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>calories</div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="small">
                                <div className="fw-bold" style={{ color: '#10b981' }}>💪 {f.Fruit.protein || 0}g</div>
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>protein</div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="small">
                                <div className="fw-bold" style={{ color: '#ec4899' }}>🍯 {f.Fruit.sugar || 0}g</div>
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>sugar</div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="small">
                                <div className="fw-bold" style={{ color: '#3b82f6' }}>🧈 {f.Fruit.fat || 0}g</div>
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>fat</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: '4rem' }}>😔</div>
            <h2 className="fw-bold mb-3" style={{ color: '#374151' }}>No favorites yet!</h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              Start exploring delicious fruits and add them to your collection
            </p>
            <button 
              className="btn btn-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '15px',
                fontSize: '1.1rem'
              }}
              onClick={() => navigate('/')}
            >
              🍎 Start Exploring
            </button>
          </div>
        )}

        {showSuggestions && favs.length > 0 && (
          <div 
            className="card border-0 shadow-lg" 
            style={{ 
              background: 'linear-gradient(145deg, #ffffff, #fdf2f8)', 
              borderRadius: '20px', 
              border: '2px solid #fce7f3' 
            }}
          >
            <div className="card-body" style={{ padding: '2rem' }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2" style={{ fontSize: '1.5rem', color: '#374151' }}>
                  🤖 AI Personalized Suggestions
                </h2>
                <p className="mb-0" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Based on your favorite fruits, here are some recommendations
                </p>
              </div>

              {suggestions && suggestions.length > 0 ? (
                <div className="row g-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                      <div className="card border-0 shadow-sm h-100" 
                           style={{ 
                             background: 'linear-gradient(145deg, #ffffff, #fefcfd)', 
                             border: '2px solid #e5e7eb',
                             borderRadius: '15px',
                             cursor: 'pointer',
                             transition: 'all 0.3s ease'
                           }}
                           onClick={() => navigate(`/fruit/${suggestion.id}`)}>
                        <div style={{ 
                          height: '6px', 
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                          borderRadius: '13px 13px 0 0',
                          margin: '2px 2px 0 2px'
                        }}></div>
                        
                        <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                          <div className="mb-3">
                            <h3 className="fw-bold mb-2" style={{ fontSize: '1.1rem', color: '#374151' }}>
                              🍎 {suggestion.name}
                            </h3>
                            <p className="text-muted mb-0" 
                               style={{ 
                                 fontSize: '0.85rem', 
                                 lineHeight: '1.5'
                               }}
                               dangerouslySetInnerHTML={{
                                 __html: formatBoldText(
                                   suggestion.reason || suggestion.description || 'Nutritionally similar to your favorite fruits'
                                 )
                               }}>
                            </p>
                            
                          </div>
                          
                          {suggestion.nutritionalHighlight && (
                            <div className="mb-3">
                              <span className="d-inline-block px-2 py-1 rounded-pill text-center small fw-medium shadow-sm"
                                    style={{
                                      background: 'linear-gradient(135deg, #ede9fe, #8b5cf6)',
                                      color: '#5b21b6',
                                      border: '0.5px solid #c4b5fd',
                                      fontSize: '0.65rem'
                                    }}>
                                ✨ {suggestion.nutritionalHighlight}
                              </span>
                            </div>
                          )}
                          
                          <button className="btn btn-sm mt-auto shadow-sm"
                                  style={{
                                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/fruit/${suggestion.id}`);
                                  }}>
                            📚 Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '2rem' }}>
                  {suggestionsLoading ? (
                    <>
                      <div className="spinner-border mb-3"
                           style={{ 
                             color: '#ec4899',
                             width: '2rem',
                             height: '2rem' 
                           }}
                           role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mb-0">Generating personalized suggestions...</p>
                    </>
                  ) : (
                    <div className="text-muted">
                      <div className="mb-2" style={{ fontSize: '2rem' }}>🤖</div>
                      <p className="mb-0">No suggestions available at the moment</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
