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
    <div>
      <div className="filters">
        <input placeholder="Search" value={query} onChange={e=> setQuery(e.target.value)} />
        <select value={sort} onChange={e=> setSort(e.target.value)}>
          <option value="name">Name</option>
          <option value="calories">Calories</option>
          <option value="sugar">Sugar</option>
        </select>
      </div>
      <div className="fruit-grid">
        {rows.map(f=> <div key={f.id} className="fruit-card">
          <h4>{f.name}</h4>
          <div style={{fontSize:'.7rem'}}>
            <span className="badge">Cal {f.calories||'-'}</span>
            <span className="badge">Sug {f.sugar||'-'}</span>
            <span className="badge">Prot {f.protein||'-'}</span>
          </div>
          {user && <button onClick={()=> dispatch(addFavorite({ fruitId: f.id }))}>❤ Fav</button>}
        </div>)}
      </div>
      <div ref={triggerRef} className="infinite-trigger" />
      <section style={{padding:'1rem'}}>
        <h3>AI Suggestions</h3>
        <ul>{suggestions.map(s=> <li key={s.id}>{s.name} {s.explanation && <small>- {s.explanation}</small>}</li>)}</ul>
      </section>
    </div>
  );
}
