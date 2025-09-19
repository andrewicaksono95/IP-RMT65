import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice.js';
import GlobalStatus from './GlobalStatus.jsx';

export default function AppLayout() {
  const user = useSelector(s=> s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <header className="navbar">
        <Link to="/" style={{fontWeight:'bold', fontSize:'1.2rem'}}>FROOTS</Link>
        <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
          {!user && <GoogleLoginButton />}
          {user && <>
            <button onClick={()=> navigate('/my-froots')}>My Froots</button>
            <button onClick={()=> navigate('/profile')}>Profile</button>
            <button onClick={()=> dispatch(logout())}>Logout</button>
          </>}
        </div>
      </header>
      <Outlet />
      <GlobalStatus />
    </>
  );
}

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
  return <button onClick={startOAuth}>Login with Google</button>;
}
