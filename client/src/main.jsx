import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import AppLayout from './pages/AppLayout.jsx';
import Home from './pages/Home.jsx';
import MyFroots from './pages/MyFroots.jsx';
import Profile from './pages/Profile.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import FruitDetail from './pages/FruitDetail.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<AppLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/fruit/:id" element={<FruitDetail />} />
          <Route path="/my-froots" element={<MyFroots />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
