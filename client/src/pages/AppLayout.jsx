
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { logout, checkAuthStatus, setInitialized } from '../slices/authSlice.js';
import { cuteAlert } from '../utils/alerts.js';
import GlobalStatus from './GlobalStatus.jsx';

function AppLayout() {
  const { user, isLoading, isInitialized } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing authentication on app load
    if (!isInitialized && !isLoading) {
      console.log('Starting auth check...');
      const checkAuth = async () => {
        try {
          const result = await dispatch(checkAuthStatus());
          console.log('Auth check completed:', result);
        } catch (error) {
          console.error('Auth check error:', error);
          // Force initialization even on error
          dispatch(setInitialized());
        }
      };
      
      checkAuth();
    }

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('Auth check timed out, forcing initialization');
        dispatch(setInitialized());
      }
    }, 3000); // Reduced to 3 seconds

    return () => clearTimeout(timeout);
  }, [dispatch, isInitialized, isLoading]);

  // Show loading state while checking authentication - but with a shorter timeout
  if (!isInitialized) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" 
           style={{ background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#ec4899', width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3" style={{ color: '#374151' }}>
            {isLoading ? 'Checking your session... 🍓' : 'Initializing... 🚀'}
          </h4>
          <p className="text-muted">This should only take a moment</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <nav 
        className="navbar navbar-expand-lg sticky-top shadow-lg" 
        style={{ 
          background: 'linear-gradient(135deg, #ffffff, #fdf2f8)', 
          borderBottom: '4px solid #fce7f3',
          minHeight: '100px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="d-flex justify-content-between align-items-center w-100 py-2">
            {/* FROOTS Logo - Bigger with bounce animation */}
            <Link 
              to="/"
              className="navbar-brand d-flex align-items-center gap-3"
              style={{ 
                textDecoration: 'none',
                fontSize: '3.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-2px',
                transition: 'all 0.4s ease',
                animation: 'bounceIn 1s ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                e.currentTarget.style.filter = 'drop-shadow(0 8px 16px rgba(236, 72, 153, 0.4))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <span 
                style={{ 
                  fontSize: '3.5rem',
                  animation: 'bounce 2s infinite',
                  display: 'inline-block'
                }}
              >
                🍓
              </span>
              <span className="position-relative">
                FROOTS
                <div 
                  className="position-absolute" 
                  style={{
                    bottom: '-8px',
                    left: '0',
                    width: '0%',
                    height: '6px',
                    background: 'linear-gradient(135deg, #f472b6, #a855f7)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }}
                  onLoad={(e) => {
                    e.target.parentElement.parentElement.addEventListener('mouseenter', () => {
                      e.target.style.width = '100%';
                    });
                    e.target.parentElement.parentElement.addEventListener('mouseleave', () => {
                      e.target.style.width = '0%';
                    });
                  }}
                ></div>
              </span>
            </Link>

            {/* Navigation Items */}
            <div className="d-flex align-items-center gap-3">
              {!user ? (
                <GoogleLoginButton />
              ) : (
                <>
                  <Link 
                    to="/my-froots"
                    className="btn d-flex align-items-center gap-2 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)',
                      border: '2px solid #fce7f3',
                      color: '#be185d',
                      padding: '12px 20px',
                      borderRadius: '15px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(236, 72, 153, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3, #f3e8ff)';
                      e.currentTarget.style.color = '#be185d';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>💕</span>
                    <span>My Froots</span>
                  </Link>

                  <Link 
                    to="/profile"
                    className="btn d-flex align-items-center gap-2 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)',
                      border: '2px solid #e5e7eb',
                      color: '#7c3aed',
                      padding: '12px 20px',
                      borderRadius: '15px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f3e8ff, #fce7f3)';
                      e.currentTarget.style.color = '#7c3aed';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>👤</span>
                    <span>Profile</span>
                  </Link>

                  <button 
                    className="btn d-flex align-items-center gap-2 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #be185d)',
                      border: 'none',
                      color: 'white',
                      padding: '14px 24px',
                      borderRadius: '15px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #be185d, #9d174d)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(190, 24, 93, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                    onClick={() => dispatch(logout())}
                  >
                    <span style={{ fontSize: '1.3rem' }}>👋</span>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <style>
        {`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translate3d(0, -100%, 0);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1) translate3d(0, 0, 0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
              transform: translate3d(0, -6px, 0);
            }
            70% {
              animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
              transform: translate3d(0, -3px, 0);
            }
            90% {
              transform: translate3d(0, -1px, 0);
            }
          }
        `}
      </style>
      
      <main 
        style={{ 
          minHeight: 'calc(100vh - 100px)',
          background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="container-fluid" 
          style={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            padding: '2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Outlet />
        </div>
        
        {/* Subtle background decorations */}
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05), transparent)',
            borderRadius: '50%',
            zIndex: 0
          }}
        ></div>
        <div 
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '-5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent)',
            borderRadius: '50%',
            zIndex: 0
          }}
        ></div>
      </main>
      
      <GlobalStatus />
    </>
  );
}

export default AppLayout;


function GoogleLoginButton(){
  async function startOAuth(){
    try {
      const { default: api } = await import('../api.js');
      const resp = await api.get('/auth/google/url');
      if (resp.data?.url) window.location = resp.data.url;
    } catch (e){
      alert('Failed to start Google OAuth');
    }
  }
  
  return (
    <button
      className="btn d-flex align-items-center gap-3 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #ffffff, #fefcfd)',
        border: '3px solid #fce7f3',
        color: '#be185d',
        padding: '16px 28px',
        borderRadius: '20px',
        fontSize: '1.2rem',
        fontWeight: '700',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #fdf2f8, #f3e8ff)';
        e.currentTarget.style.borderColor = '#ec4899';
        e.currentTarget.style.color = '#9d174d';
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.3)';
        
        // Add sparkle effect
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ec4899, #be185d);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: sparkle 0.6s ease-out forwards;
          pointer-events: none;
        `;
        e.currentTarget.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #fefcfd)';
        e.currentTarget.style.borderColor = '#fce7f3';
        e.currentTarget.style.color = '#be185d';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onClick={startOAuth}
    >
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 48 48" 
        style={{ 
          flexShrink: 0,
          transition: 'transform 0.4s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotate(360deg) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
        }}
      >
        <g>
          <path 
            fill="#4285F4" 
            d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11 0 20.5-8.5 20.5-20.5 0-1.4-.1-2.7-.4-4z"
          />
          <path 
            fill="#34A853" 
            d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5c-7.2 0-13.4 3.7-17.1 9.2z"
          />
          <path 
            fill="#FBBC05" 
            d="M24 44.5c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3c-2 1.4-4.5 2.2-7.6 2.2-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C7.6 40.6 15.2 44.5 24 44.5z"
          />
          <path 
            fill="#EA4335" 
            d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-4.1 5.5-7.3 5.5-4.2 0-7.7-3.5-7.7-7.7 0-4.2 3.5-7.7 7.7-7.7 2.1 0 4 .8 5.4 2.1l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5c-7.2 0-13.4 3.7-17.1 9.2z"
          />
        </g>
      </svg>
      <span style={{ letterSpacing: '0.5px' }}>Continue with Google</span>
      <span 
        style={{ 
          fontSize: '1.4rem',
          animation: 'twinkle 2s ease-in-out infinite alternate'
        }}
      >
        ✨
      </span>
      
      <style>
        {`
          @keyframes sparkle {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes twinkle {
            0% {
              transform: rotate(0deg) scale(1);
              opacity: 0.8;
            }
            100% {
              transform: rotate(360deg) scale(1.2);
              opacity: 1;
            }
          }
        `}
      </style>
    </button>
  );
}

function NavButton({children, style, ...props}){
  return (
    <button
      {...props}
      style={{
        padding:'8px 16px',
        border:'none',
        borderRadius:6,
        background:'#f0f0f0',
        color:'#222',
        fontWeight:500,
        fontSize:'1rem',
        cursor:'pointer',
        transition:'background 0.2s',
        marginLeft:8,
        ...style
      }}
      onMouseOver={e=> e.currentTarget.style.background='#e0e0e0'}
      onMouseOut={e=> e.currentTarget.style.background=style?.background || '#f0f0f0'}
    >
      {children}
    </button>
  );
}