import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../slices/profileSlice.js';
import { fetchFavorites } from '../slices/favoriteSlice.js';

export default function Profile(){
  const dispatch = useDispatch();
  const profile = useSelector(s => s.profile.data);
  const favorites = useSelector(s => s.favorites.items);
  const [form, setForm] = useState({ fullName: '', nickName: '', dateOfBirth: '', gender: '' });
  
  useEffect(() => { 
    dispatch(fetchProfile()); 
    dispatch(fetchFavorites()); 
  }, [dispatch]);
  
  useEffect(() => { 
    if (profile) setForm(profile); 
  }, [profile]);
  
  function submit(e) { 
    e.preventDefault(); 
    dispatch(updateProfile(form)); 
  }
  
  function change(e) { 
    setForm(f => ({ ...f, [e.target.name]: e.target.value })); 
  }
  
  const nutrientSummary = useMemo(() => {
    if (!favorites.length) return null;
    const acc = { calories: 0, sugar: 0, protein: 0, fat: 0, carbohydrates: 0 };
    let count = 0;
    for (const f of favorites) {
      const fr = f.Fruit; 
      if (!fr) continue;
      acc.calories += fr.calories || 0;
      acc.sugar += fr.sugar || 0;
      acc.protein += fr.protein || 0;
      acc.fat += fr.fat || 0;
      acc.carbohydrates += fr.carbohydrates || 0;
      count++;
    }
    if (!count) return null;
    Object.keys(acc).forEach(k => acc[k] = +(acc[k] / count).toFixed(1));
    return { count, avg: acc };
  }, [favorites]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
        <p className="text-gray-600">Manage your personal information and view your fruit stats</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ✏️ Edit Profile
          </h2>
          
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                name="fullName" 
                placeholder="Enter your full name" 
                value={form.fullName || ''} 
                onChange={change}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-gray-900 placeholder-pink-400 bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              <input 
                name="nickName" 
                placeholder="Enter your nickname" 
                value={form.nickName || ''} 
                onChange={change}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-gray-900 placeholder-pink-400 bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={form.dateOfBirth || ''} 
                onChange={change}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-gray-900 bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select 
                name="gender" 
                value={form.gender || ''} 
                onChange={change}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-gray-900 bg-white/80"
              >
                <option value="">Select gender</option>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
                <option value="other">🌈 Other</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              💾 Save Profile
            </button>
          </form>
        </div>

        {/* Stats & Favorites */}
        <div className="space-y-6">
          {/* Nutrition Summary */}
          {nutrientSummary && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Favorite Fruits Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-pink-600">{nutrientSummary.count}</div>
                  <div className="text-xs text-gray-600">Favorites</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">{nutrientSummary.avg.calories}</div>
                  <div className="text-xs text-gray-600">Avg Calories</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{nutrientSummary.avg.protein}g</div>
                  <div className="text-xs text-gray-600">Avg Protein</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{nutrientSummary.avg.sugar}g</div>
                  <div className="text-xs text-gray-600">Avg Sugar</div>
                </div>
              </div>
            </div>
          )}

          {/* Favorite Fruits List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              💕 Favorite Fruits ({favorites.length})
            </h3>
            
            {favorites.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🍓</div>
                <p className="text-gray-600 text-sm">No favorites yet!</p>
                <a 
                  href="/" 
                  className="inline-flex items-center gap-1 mt-3 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  🔍 Start exploring
                </a>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favorites.map(f => (
                  <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <span className="text-pink-500">🍎</span>
                    <span className="font-medium text-gray-800">{f.Fruit?.name || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
