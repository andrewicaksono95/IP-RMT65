
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { logout } from '../slices/authSlice.js';
import GlobalStatus from './GlobalStatus.jsx';

function AppLayout() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-white border-b-4 border-pink-300 sticky top-0 z-50 shadow-xl backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-24">
            {/* Left: FROOTS logo - Much bigger and cuter */}
            <Link 
              className="group flex items-center gap-3 text-4xl font-black text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 transition-all duration-300 tracking-tight transform hover:scale-105" 
              to="/"
            >
              <span className="text-4xl animate-bounce">🍓</span>
              <span className="relative">
                FROOTS
                <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </span>
            </Link>
            
            {/* Right: Auth buttons - Bigger and cuter */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <GoogleLoginButton />
              ) : (
                <>
                  <Link 
                    className="group flex items-center gap-2 px-6 py-3 text-lg font-bold text-pink-600 hover:text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg" 
                    to="/my-froots"
                  >
                    <span className="text-xl">💕</span>
                    <span>My Froots</span>
                  </Link>
                  <Link 
                    className="group flex items-center gap-2 px-6 py-3 text-lg font-bold text-pink-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg" 
                    to="/profile"
                  >
                    <span className="text-xl">👤</span>
                    <span>Profile</span>
                  </Link>
                  <button 
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl" 
                    onClick={() => dispatch(logout())}
                  >
                    <span className="text-xl">👋</span>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
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
      className="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-pink-300 text-pink-600 text-lg font-bold rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-400 hover:text-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
      onClick={startOAuth}
    >
      <svg width="24" height="24" viewBox="0 0 48 48" className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
        <g>
          <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11 0 20.5-8.5 20.5-20.5 0-1.4-.1-2.7-.4-4z"/>
          <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5c-7.2 0-13.4 3.7-17.1 9.2z"/>
          <path fill="#FBBC05" d="M24 44.5c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3c-2 1.4-4.5 2.2-7.6 2.2-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C7.6 40.6 15.2 44.5 24 44.5z"/>
          <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-4.1 5.5-7.3 5.5-4.2 0-7.7-3.5-7.7-7.7 0-4.2 3.5-7.7 7.7-7.7 2.1 0 4 .8 5.4 2.1l6.1-6.1C34.3 5.5 29.4 3.5 24 3.5c-7.2 0-13.4 3.7-17.1 9.2z"/>
        </g>
      </svg>
      <span>Login with Google</span>
      <span className="text-xl">✨</span>
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


