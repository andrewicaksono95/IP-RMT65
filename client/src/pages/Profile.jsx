import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../slices/profileSlice.js';
import { fetchFavorites } from '../slices/favoriteSlice.js';

export default function Profile(){
  const dispatch = useDispatch();
  const profile = useSelector(s=> s.profile.data);
  const favorites = useSelector(s=> s.favorites.items);
  const [form, setForm] = useState({ fullName:'', nickName:'', dateOfBirth:'', gender:'' });
  useEffect(()=> { dispatch(fetchProfile()); dispatch(fetchFavorites()); }, [dispatch]);
  useEffect(()=> { if(profile) setForm(profile); }, [profile]);
  function submit(e){ e.preventDefault(); dispatch(updateProfile(form)); }
  function change(e){ setForm(f=> ({ ...f, [e.target.name]: e.target.value })); }
  const nutrientSummary = useMemo(()=> {
    if(!favorites.length) return null;
    const acc = { calories:0, sugar:0, protein:0, fat:0, carbohydrates:0 };
    let count = 0;
    for(const f of favorites){
      const fr = f.Fruit; if(!fr) continue;
      acc.calories += fr.calories||0;
      acc.sugar += fr.sugar||0;
      acc.protein += fr.protein||0;
      acc.fat += fr.fat||0;
      acc.carbohydrates += fr.carbohydrates||0;
      count++;
    }
    if(!count) return null;
    Object.keys(acc).forEach(k=> acc[k] = +(acc[k]/count).toFixed(1));
    return { count, avg: acc };
  }, [favorites]);

  return <div className="profile-form">
    <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'.5rem'}}>
      <h2>Profile</h2>
      <input name="fullName" placeholder="Full Name" value={form.fullName||''} onChange={change} />
      <input name="nickName" placeholder="Nickname" value={form.nickName||''} onChange={change} />
      <input type="date" name="dateOfBirth" value={form.dateOfBirth||''} onChange={change} />
      <select name="gender" value={form.gender||''} onChange={change}>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <button type="submit">Save</button>
    </form>
    <section style={{marginTop:'1.5rem'}}>
      <h3>My Favorite Fruits</h3>
      {!favorites.length && <p>No favorites yet.</p>}
      {!!favorites.length && <ul>{favorites.map(f=> <li key={f.id}>{f.Fruit?.name}</li>)}</ul>}
    </section>
    <section style={{marginTop:'1rem'}}>
      <h3>Nutrient Averages</h3>
      {!nutrientSummary && <p>Add favorites to see averages.</p>}
      {nutrientSummary && <div style={{display:'flex', gap:'.75rem', flexWrap:'wrap'}}>
        {Object.entries(nutrientSummary.avg).map(([k,v])=> <div key={k} style={{background:'var(--pink)', padding:'.5rem .75rem', borderRadius:'12px', fontSize:'.75rem'}}>{k}: {v}</div>)}
      </div>}
    </section>
  </div>;
}
