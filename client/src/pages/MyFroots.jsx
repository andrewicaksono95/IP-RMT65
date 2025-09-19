import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../slices/favoriteSlice.js';

export default function MyFroots(){
  const dispatch = useDispatch();
  const favs = useSelector(s => s.favorites.items);
  
  useEffect(() => { 
    dispatch(fetchFavorites()); 
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💕 My Favorite Froots</h1>
        <p className="text-gray-600">Your personal collection of delicious fruits</p>
      </div>

      {/* Favorites Grid */}
      {favs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favs.map(f => (
            <div 
              key={f.id} 
              className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-pink-300 hover:bg-white"
            >
              <div className="flex flex-col h-full">
                {/* Fruit name */}
                <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-200">
                  {f.Fruit?.name || 'Unknown Fruit'}
                </h3>
                
                {/* Nutrition badges */}
                {f.Fruit && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200">
                      🔥 {f.Fruit.calories || '0'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      🍯 {f.Fruit.sugar || '0'}g
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      💪 {f.Fruit.protein || '0'}g
                    </span>
                  </div>
                )}
                
                {/* Remove button */}
                <button 
                  className="mt-auto w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 text-white font-medium text-sm rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 shadow-sm group-hover:shadow-md" 
                  onClick={() => dispatch(deleteFavorite(f.id))}
                >
                  💔 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-200 p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🍓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No favorites yet!</h3>
            <p className="text-gray-600 mb-4">Start exploring and add some delicious fruits to your favorites.</p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-sm"
            >
              🔍 Explore Fruits
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
