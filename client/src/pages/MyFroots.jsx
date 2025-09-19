import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../slices/favoriteSlice.js';

export default function MyFroots(){
  const dispatch = useDispatch();
  const favs = useSelector(s=> s.favorites.items);
  useEffect(()=> { dispatch(fetchFavorites()); }, [dispatch]);
  return <div style={{padding:'1rem'}}>
    <h2>My Favorites</h2>
    <ul>{favs.map(f=> <li key={f.id}>{f.Fruit?.name} <button onClick={()=> dispatch(deleteFavorite(f.id))}>Remove</button></li>)}</ul>
  </div>;
}
