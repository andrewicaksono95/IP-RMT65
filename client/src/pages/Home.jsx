import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFruits, reset } from '../slices/fruitSlice.js';
import { addFavorite } from '../slices/favoriteSlice.js';
import { fetchSuggestions } from '../slices/aiSlice.js';

export default function Home(){
  const dispatch = useDispatch();
  const { rows, count } = useSelector(s=> s.fruits);
  const user = useSelector(s=> s.auth.user);
  const suggestions = useSelector(s=> s.ai.suggestions);
  const [query,setQuery] = useState('');
  const [sort,setSort] = useState('name');
  const [offset,setOffset] = useState(0);
  const limit = 20;
  const triggerRef = useRef();

  useEffect(()=> { dispatch(fetchSuggestions()); }, [dispatch]);
  useEffect(()=> { load(true); }, [query, sort]);
  useEffect(()=> { const ob = new IntersectionObserver(entries=> { if(entries[0].isIntersecting && rows.length < count){ load(false); } }); if(triggerRef.current) ob.observe(triggerRef.current); return ()=> ob.disconnect(); }, [rows,count]);
  function load(resetFirst){
    if(resetFirst){ setOffset(0); dispatch(reset()); }
    dispatch(fetchFruits({ search: query, sort, offset: resetFirst?0:offset, limit }));
    if(!resetFirst) setOffset(o=> o+limit);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1">
              <input 
                className="w-full px-6 py-4 border-2 border-pink-300 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 text-lg text-gray-800 placeholder-pink-400 bg-white shadow-sm" 
                placeholder="🔍 Search your favorite fruits..." 
                value={query} 
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select 
                className="px-6 py-4 border-2 border-pink-300 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 bg-white text-lg text-gray-800 shadow-sm" 
                value={sort} 
                onChange={e => setSort(e.target.value)}
              >
                <option value="name">✨ Sort by Name</option>
                <option value="calories">🔥 Sort by Calories</option>
                <option value="sugar">🍯 Sort by Sugar</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Fruit Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div 
          className="grid gap-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            maxWidth: '100%'
          }}
        >
          {rows.map(f => (
            <div 
              key={f.id} 
              className="group relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #fdf2f8)',
                borderRadius: '24px',
                border: '2px solid #fce7f3',
                padding: '24px',
                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '380px',
                maxHeight: '380px',
                display: 'flex',
                flexDirection: 'column'
              }}
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
              {/* Decorative gradient */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500"
                style={{ borderRadius: '24px 24px 0 0' }}
              />
              
              {/* Fruit name */}
              <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                <h3 
                  className="text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.2'
                  }}
                >
                  🍎 {f.name}
                </h3>
              </div>
              
              {/* Nutrition badges - Uniform 3x1 grid */}
              <div className="grid grid-cols-1 gap-3 mb-6 flex-1">
                <span 
                  className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-bold shadow-sm text-center"
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                    color: '#92400e',
                    border: '1px solid #fcd34d',
                    minHeight: '40px'
                  }}
                >
                  🔥 {f.calories || '0'} calories
                </span>
                <span 
                  className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-bold shadow-sm text-center"
                  style={{
                    background: 'linear-gradient(135deg, #ede9fe, #a78bfa)',
                    color: '#5b21b6',
                    border: '1px solid #c4b5fd',
                    minHeight: '40px'
                  }}
                >
                  🍯 {f.sugar || '0'}g sugar
                </span>
                <span 
                  className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-bold shadow-sm text-center"
                  style={{
                    background: 'linear-gradient(135deg, #d1fae5, #34d399)',
                    color: '#065f46',
                    border: '1px solid #6ee7b7',
                    minHeight: '40px'
                  }}
                >
                  💪 {f.protein || '0'}g protein
                </span>
              </div>
              
              {/* Favorite button */}
              <div style={{ minHeight: '60px', display: 'flex', alignItems: 'end' }}>
                {user && (
                  <button 
                    className="w-full font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg transform active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #be185d)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 24px',
                      minHeight: '56px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #be185d, #9d174d)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(236, 72, 153, 0.25)';
                    }}
                    onClick={() => dispatch(addFavorite({ fruitId: f.id }))}
                  >
                    💕 Add to Favorites
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div ref={triggerRef} className="h-8" />
      
      {/* AI Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-200 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              🤖 AI Fruit Recommendations
            </h2>
            
            <div className="grid gap-4">
              {suggestions.map(s => (
                <div key={s.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-50 transition-colors duration-200">
                  <span className="text-2xl">✨</span>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-gray-800">{s.name}</span>
                    {s.explanation && (
                      <p className="text-gray-600 mt-2">{s.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
