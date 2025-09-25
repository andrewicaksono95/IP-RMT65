import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../slices/profileSlice.js';
import { fetchFavorites } from '../slices/favoriteSlice.js';
import { fetchSuggestions } from '../slices/aiSlice.js';

export default function Profile(){
  const dispatch = useDispatch();
  const profile = useSelector(s => s.profile.data);
  const favorites = useSelector(s => s.favorites.items);
  const suggestions = useSelector(s => s.ai.suggestions);
  const [form, setForm] = useState({ fullName: '', nickName: '', dateOfBirth: '', gender: '' });
  
  useEffect(() => { 
    dispatch(fetchProfile()); 
    dispatch(fetchFavorites()); 
  }, [dispatch]);

  useEffect(() => {
    if (favorites.length > 0) {
      const ids = favorites.map(f => f.Fruit?.id).filter(Boolean);
      if (ids.length > 0) dispatch(fetchSuggestions(ids));
    }
  }, [favorites, dispatch]);
  
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
    <div
      style={{
        background: 'linear-gradient(135deg, #fdf2f8, #fff, #f3e8ff)',
        padding: '2rem 0'
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="d-inline-block mb-3" 
               style={{ 
                 fontSize: '4rem',
                 background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 filter: 'drop-shadow(0 4px 8px rgba(236, 72, 153, 0.2))'
               }}>
            👤
          </div>
          <h1 className="fw-bold mb-3" 
              style={{ 
                fontSize: '3rem', 
                color: '#374151',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-1px'
              }}>
            My Profile
          </h1>
          <p className="mb-0" 
             style={{ 
               fontSize: '1.2rem', 
               color: '#6b7280',
               maxWidth: '600px',
               margin: '0 auto'
             }}>
            Manage your personal information and preferences
          </p>
        </div>

        <div className="row g-4">
          {/* Edit Profile Card */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg" 
                 style={{ 
                   background: 'linear-gradient(145deg, #ffffff, #fdf2f8)', 
                   borderRadius: '25px', 
                   border: '3px solid #fce7f3',
                   transition: 'all 0.3s ease',
                   position: 'relative',
                   overflow: 'hidden'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-5px)';
                   e.currentTarget.style.boxShadow = '0 25px 50px rgba(236, 72, 153, 0.2)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                 }}>
              {/* Top gradient line */}
              <div style={{ 
                height: '6px', 
                background: 'linear-gradient(135deg, #ec4899, #be185d)', 
                borderRadius: '25px 25px 0 0' 
              }}></div>
              
              <div className="card-body" style={{ padding: '2.5rem' }}>
                <div className="text-center mb-4">
                  <div className="d-inline-block mb-3 p-3 rounded-circle" 
                       style={{ 
                         background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)',
                         border: '2px solid #fce7f3'
                       }}>
                    <span style={{ fontSize: '2rem' }}>✏️</span>
                  </div>
                  <h2 className="fw-bold" style={{ fontSize: '1.8rem', color: '#374151', marginBottom: '0.5rem' }}>
                    Edit Profile
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                    Keep your information up to date
                  </p>
                </div>
                
                <form onSubmit={submit} className="needs-validation" noValidate>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="form-label fw-bold d-flex align-items-center gap-2" 
                           style={{ color: '#374151', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>👤</span>
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      className="form-control form-control-lg" 
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #fce7f3', 
                        backgroundColor: '#fefcfd',
                        padding: '1rem 1.25rem',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={form.fullName || ''} 
                      onChange={change}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fce7f3';
                        e.target.style.boxShadow = 'none';
                      }} />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="nickName" className="form-label fw-bold d-flex align-items-center gap-2" 
                           style={{ color: '#374151', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🎭</span>
                      Nickname
                    </label>
                    <input 
                      type="text" 
                      id="nickName" 
                      name="nickName" 
                      className="form-control form-control-lg"
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #fce7f3', 
                        backgroundColor: '#fefcfd',
                        padding: '1rem 1.25rem',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={form.nickName || ''} 
                      onChange={change}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fce7f3';
                        e.target.style.boxShadow = 'none';
                      }} />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="dateOfBirth" className="form-label fw-bold d-flex align-items-center gap-2" 
                           style={{ color: '#374151', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🎂</span>
                      Date of Birth
                    </label>
                    <input 
                      type="date" 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      className="form-control form-control-lg"
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #fce7f3', 
                        backgroundColor: '#fefcfd',
                        padding: '1rem 1.25rem',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={form.dateOfBirth || ''} 
                      onChange={change}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fce7f3';
                        e.target.style.boxShadow = 'none';
                      }} />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="gender" className="form-label fw-bold d-flex align-items-center gap-2" 
                           style={{ color: '#374151', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>⚧️</span>
                      Gender
                    </label>
                    <select 
                      id="gender" 
                      name="gender" 
                      className="form-select form-select-lg"
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #fce7f3', 
                        backgroundColor: '#fefcfd',
                        padding: '1rem 1.25rem',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={form.gender || ''} 
                      onChange={change}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fce7f3';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn w-100 fw-bold shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, #ec4899, #be185d)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '1rem 1.5rem', 
                      borderRadius: '15px', 
                      fontSize: '1.2rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #be185d, #9d174d)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}>
                    <span style={{ marginRight: '0.5rem' }}>💖</span>
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Nutrition Summary Card */}  
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg" 
                 style={{ 
                   background: 'linear-gradient(145deg, #ffffff, #f3e8ff)', 
                   borderRadius: '25px', 
                   border: '3px solid #e9d5ff',
                   transition: 'all 0.3s ease',
                   position: 'relative',
                   overflow: 'hidden'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-5px)';
                   e.currentTarget.style.boxShadow = '0 25px 50px rgba(139, 92, 246, 0.2)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                 }}>
              {/* Top gradient line */}
              <div style={{ 
                height: '6px', 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                borderRadius: '25px 25px 0 0' 
              }}></div>
              
              <div className="card-body" style={{ padding: '2.5rem' }}>
                <div className="text-center mb-4">
                  <div className="d-inline-block mb-3 p-3 rounded-circle" 
                       style={{ 
                         background: 'linear-gradient(135deg, #e9d5ff, #fce7f3)',
                         border: '2px solid #e9d5ff'
                       }}>
                    <span style={{ fontSize: '2rem' }}>📊</span>
                  </div>
                  <h2 className="fw-bold" style={{ fontSize: '1.8rem', color: '#374151', marginBottom: '0.5rem' }}>
                    Nutrition Summary
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                    Based on {nutrientSummary?.count || 0} favorite fruits
                  </p>
                </div>

                {nutrientSummary ? (
                  <div className="nutrition-stats">
                    {/* Calories */}
                    <div className="mb-4 p-3 rounded-3" 
                         style={{ 
                           background: 'linear-gradient(135deg, #fef3c7, #fde68a)', 
                           border: '2px solid #fde68a',
                           borderRadius: '18px'
                         }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2" 
                            style={{ fontSize: '1.4rem', color: '#78350f' }}>
                          🔥 Calories
                        </h3>
                        <span className="badge fw-bold" 
                              style={{ 
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                                color: 'white', 
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>
                          {nutrientSummary.avg.calories} kcal
                        </span>
                      </div>
                      <div className="progress" style={{ height: '12px', borderRadius: '10px', backgroundColor: '#fed7aa' }}>
                        <div className="progress-bar" 
                             style={{ 
                               background: 'linear-gradient(90deg, #f59e0b, #d97706)', 
                               width: '75%',
                               borderRadius: '10px'
                             }}></div>
                      </div>
                    </div>

                    {/* Protein */}
                    <div className="mb-4 p-3 rounded-3" 
                         style={{ 
                           background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', 
                           border: '2px solid #bbf7d0',
                           borderRadius: '18px'
                         }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2" 
                            style={{ fontSize: '1.4rem', color: '#14532d' }}>
                          🥩 Protein
                        </h3>
                        <span className="badge fw-bold" 
                              style={{ 
                                background: 'linear-gradient(135deg, #10b981, #059669)', 
                                color: 'white', 
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>
                          {nutrientSummary.avg.protein}g
                        </span>
                      </div>
                      <div className="progress" style={{ height: '12px', borderRadius: '10px', backgroundColor: '#a7f3d0' }}>
                        <div className="progress-bar" 
                             style={{ 
                               background: 'linear-gradient(90deg, #10b981, #059669)', 
                               width: '60%',
                               borderRadius: '10px'
                             }}></div>
                      </div>
                    </div>

                    {/* Sugar */}
                    <div className="mb-4 p-3 rounded-3" 
                         style={{ 
                           background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', 
                           border: '2px solid #fbcfe8',
                           borderRadius: '18px'
                         }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2" 
                            style={{ fontSize: '1.4rem', color: '#831843' }}>
                          🍬 Sugar
                        </h3>
                        <span className="badge fw-bold" 
                              style={{ 
                                background: 'linear-gradient(135deg, #ec4899, #be185d)', 
                                color: 'white', 
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>
                          {nutrientSummary.avg.sugar}g
                        </span>
                      </div>
                      <div className="progress" style={{ height: '12px', borderRadius: '10px', backgroundColor: '#f9a8d4' }}>
                        <div className="progress-bar" 
                             style={{ 
                               background: 'linear-gradient(90deg, #ec4899, #be185d)', 
                               width: '45%',
                               borderRadius: '10px'
                             }}></div>
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="p-3 rounded-3" 
                         style={{ 
                           background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', 
                           border: '2px solid #bfdbfe',
                           borderRadius: '18px'
                         }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2" 
                            style={{ fontSize: '1.4rem', color: '#1e3a8a' }}>
                          🥑 Fat
                        </h3>
                        <span className="badge fw-bold" 
                              style={{ 
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
                                color: 'white', 
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>
                          {nutrientSummary.avg.fat}g
                        </span>
                      </div>
                      <div className="progress" style={{ height: '12px', borderRadius: '10px', backgroundColor: '#93c5fd' }}>
                        <div className="progress-bar" 
                             style={{ 
                               background: 'linear-gradient(90deg, #3b82f6, #2563eb)', 
                               width: '35%',
                               borderRadius: '10px'
                             }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="mb-3" style={{ fontSize: '4rem' }}>📈</div>
                    <h3 className="fw-bold mb-3" style={{ fontSize: '1.5rem', color: '#6b46c1' }}>
                      No Data Yet
                    </h3>
                    <p style={{ color: '#7c3aed', fontSize: '1rem', lineHeight: '1.6' }}>
                      Add some fruits to my froots to see nutrition insights!
                    </p>
                    <button 
                      className="btn fw-bold mt-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.75rem 2rem', 
                        borderRadius: '15px', 
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                      <span style={{ marginRight: '0.5rem' }}>🌟</span>
                      Start exploring
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Fruits Mini Card */}
            <div className="card border-0 shadow-lg mt-4" 
                 style={{ 
                   background: 'linear-gradient(145deg, #ffffff, #fef3c7)', 
                   borderRadius: '20px', 
                   border: '3px solid #fde68a',
                   transition: 'all 0.3s ease'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-3px)';
                   e.currentTarget.style.boxShadow = '0 15px 30px rgba(245, 158, 11, 0.2)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                 }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold d-flex align-items-center justify-content-center gap-2" 
                      style={{ fontSize: '1.6rem', color: '#78350f' }}>
                    <span style={{ fontSize: '1.8rem' }}>⭐</span>
                    My Froots ({favorites.length})
                  </h2>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-center py-3">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🍎</div>
                    <p style={{ color: '#92400e', fontSize: '1rem', marginBottom: '1rem' }}>
                      No froots yet!
                    </p>
                    <button 
                      className="btn fw-bold shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.6rem 1.5rem', 
                        borderRadius: '12px', 
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                      <span style={{ marginRight: '0.5rem' }}>🚀</span>
                      Start exploring
                    </button>
                  </div>
                ) : (
                  <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                    {favorites.map(f => (
                      <div key={f.id} 
                           className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" 
                           style={{ 
                             backgroundColor: '#fef3c7', 
                             border: '2px solid #fde68a',
                             transition: 'all 0.3s ease'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.backgroundColor = '#fde68a';
                             e.currentTarget.style.transform = 'translateX(5px)';
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.backgroundColor = '#fef3c7';
                             e.currentTarget.style.transform = 'translateX(0)';
                           }}>
                        <span style={{ fontSize: '1.5rem' }}>🍊</span>
                        <span className="fw-medium" style={{ color: '#78350f', fontSize: '1.1rem' }}>
                          {f.Fruit?.name || 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
