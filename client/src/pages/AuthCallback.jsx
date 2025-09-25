import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { googleLoginWithCode } from '../slices/authSlice.js';

export default function AuthCallback(){
  const dispatch = useDispatch();
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(()=>{
    const qs = new URLSearchParams(loc.search);
    const code = qs.get('code');
    const state = qs.get('state');
    if (!code || !state){ navigate('/'); return; }
    dispatch(googleLoginWithCode({ code, state })).finally(()=> navigate('/'));
  },[loc.search, dispatch, navigate]);
  return <div style={{padding:'2rem'}}>Signing you in…</div>;
}