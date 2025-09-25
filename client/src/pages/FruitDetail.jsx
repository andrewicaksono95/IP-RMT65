import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFruit } from '../slices/fruitSlice.js';
import { addFavorite, fetchFavorites } from '../slices/favoriteSlice.js';
import { cuteAlert } from '../utils/alerts.js';

export default function FruitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fruit = useSelector(s => s.fruits.selected);
  const favorites = useSelector(s => s.favorites.items);
  const { user } = useSelector(s => s.auth);
  const isInFavorites = favorites.some(f => f.Fruit?.id === fruit?.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchFruit(id));
      dispatch(fetchFavorites());
    }
  }, [id, dispatch]);

  const handleAddToFavorites = async () => {
    // Check if user is logged in first
    if (!user) {
      cuteAlert.warning('Please login first to add fruits to my froots! 🔐', { 
        duration: 4000 
      });
      return;
    }

    if (fruit && !isInFavorites) {
      try {
        const resultAction = await dispatch(addFavorite({ fruitId: fruit.id }));
        if (addFavorite.fulfilled.match(resultAction)) {
          dispatch(fetchFavorites());
          // Navigate to home page after successfully adding to favorites
          setTimeout(() => {
            navigate('/');
          }, 1500); // Give time for the success alert to show
        }
      } catch (error) {
        console.error('Failed to add to favorites:', error);
      }
    }
  };

  if (!fruit) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ 
          background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)'
        }}
      >
        <div className="text-center">
          <div 
            className="spinner-border mb-3"
            style={{ 
              color: '#ec4899',
              width: '3rem',
              height: '3rem' 
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Loading fruit details...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100"
      style={{ 
        background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)', 
        padding: '2rem 0'
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1000px' }}>
        <div className="mb-4">
          <button
            className="btn d-flex align-items-center gap-2 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)',
              border: '2px solid #e5e7eb',
              color: '#6b7280',
              padding: '12px 20px',
              borderRadius: '15px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate(-1)}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span>
            <span>Back to Fruits</span>
          </button>
        </div>

        <div 
          className="card border-0 shadow-lg"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #fdf2f8)',
            borderRadius: '25px',
            border: '3px solid #fce7f3',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '8px',
              background: 'linear-gradient(135deg, #ec4899, #be185d, #8b5cf6)'
            }}
          ></div>

          <div className="card-body" style={{ padding: '3rem' }}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="text-center">
                  <div 
                    className="d-inline-flex justify-content-center align-items-center mb-4"
                    style={{
                      width: '200px',
                      height: '200px',
                      background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
                      borderRadius: '50%',
                      boxShadow: '0 20px 40px rgba(251, 146, 60, 0.3)',
                      animation: 'float 3s ease-in-out infinite',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {fruit.imageUrl && (
                      <img
                        src={fruit.imageUrl}
                        alt={fruit.name}
                        style={{ 
                          width: fruit.imageUrl.endsWith('.svg') ? '160px' : '180px',
                          height: fruit.imageUrl.endsWith('.svg') ? '160px' : '180px',
                          objectFit: 'contain',
                          filter: fruit.imageUrl.endsWith('.svg') ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none',
                          transition: 'transform 0.3s ease',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )}
                  </div>
                  
                  <h1 
                    className="fw-bold mb-3"
                    style={{ 
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {fruit.name}
                  </h1>

                  <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                    <span 
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                        color: '#1e40af',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid #93c5fd'
                      }}
                    >
                      🔬 Order: {fruit.order}
                    </span>
                    <span 
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                        color: '#065f46',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid #6ee7b7'
                      }}
                    >
                      👥 Family: {fruit.family}
                    </span>
                    <span 
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: 'linear-gradient(135deg, #fce7f3, #f9a8d4)',
                        color: '#be185d',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid #f472b6'
                      }}
                    >
                      🧬 Genus: {fruit.genus}
                    </span>
                  </div>

                  <button
                    className="btn btn-lg d-flex align-items-center gap-3 mx-auto shadow-lg"
                    style={{
                      background: isInFavorites 
                        ? 'linear-gradient(135deg, #10b981, #059669)' 
                        : 'linear-gradient(135deg, #ec4899, #be185d)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '20px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      transition: 'all 0.3s ease',
                      cursor: isInFavorites ? 'default' : 'pointer'
                    }}
                    onClick={handleAddToFavorites}
                    disabled={isInFavorites}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {isInFavorites ? '✅' : '💕'}
                    </span>
                    <span>
                      {isInFavorites ? 'Added to My Froots' : 'Add to My Froots'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="col-lg-6">
                <div 
                  className="card border-0 shadow-sm"
                  style={{
                    background: 'linear-gradient(145deg, #fefcfd, #f9fafb)',
                    borderRadius: '20px',
                    border: '2px solid #f3f4f6'
                  }}
                >
                  <div className="card-header border-0" style={{ background: 'transparent', padding: '2rem 2rem 1rem' }}>
                    <h2 
                      className="fw-bold mb-0 text-center"
                      style={{ 
                        fontSize: '1.8rem',
                        color: '#374151'
                      }}
                    >
                      🍎 Nutritional Facts
                    </h2>
                  </div>
                  
                  <div className="card-body" style={{ padding: '1rem 2rem 2rem' }}>
                    <div className="row g-4">
                      <div className="col-6">
                        <div 
                          className="text-center p-4 rounded-4 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            border: '2px solid #fbbf24'
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                          <div 
                            className="fw-bold mb-1"
                            style={{ fontSize: '1.8rem', color: '#92400e' }}
                          >
                            {fruit.nutritions?.calories || fruit.calories || 0}
                          </div>
                          <div style={{ color: '#92400e', fontSize: '0.9rem', fontWeight: '600' }}>Calories</div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="text-center p-4 rounded-4 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                            border: '2px solid #22c55e'
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💪</div>
                          <div 
                            className="fw-bold mb-1"
                            style={{ fontSize: '1.8rem', color: '#166534' }}
                          >
                            {fruit.nutritions?.protein || fruit.protein || 0}g
                          </div>
                          <div style={{ color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>Protein</div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="text-center p-4 rounded-4 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                            border: '2px solid #3b82f6'
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧈</div>
                          <div 
                            className="fw-bold mb-1"
                            style={{ fontSize: '1.8rem', color: '#1e40af' }}
                          >
                            {fruit.nutritions?.fat || fruit.fat || 0}g
                          </div>
                          <div style={{ color: '#1e40af', fontSize: '0.9rem', fontWeight: '600' }}>Fat</div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="text-center p-4 rounded-4 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #fce7f3, #f9a8d4)',
                            border: '2px solid #ec4899'
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍯</div>
                          <div 
                            className="fw-bold mb-1"
                            style={{ fontSize: '1.8rem', color: '#be185d' }}
                          >
                            {fruit.nutritions?.sugar || fruit.sugar || 0}g
                          </div>
                          <div style={{ color: '#be185d', fontSize: '0.9rem', fontWeight: '600' }}>Sugar</div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div 
                          className="text-center p-4 rounded-4 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                            border: '2px solid #8b5cf6'
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌾</div>
                          <div 
                            className="fw-bold mb-1"
                            style={{ fontSize: '1.8rem', color: '#7c3aed' }}
                          >
                            {fruit.nutritions?.carbohydrates || fruit.carbohydrates || 0}g
                          </div>
                          <div style={{ color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600' }}>Carbohydrates</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
