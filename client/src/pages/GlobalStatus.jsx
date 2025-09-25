import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissError } from '../slices/uiSlice.js';

export default function GlobalStatus(){
  const active = useSelector(s=> s.ui.active);
  const errors = useSelector(s=> s.ui.errors);
  const dispatch = useDispatch();
  return <>
    {active>0 && <div className="global-overlay"><div className="spinner"/></div>}
    <div className="toast-stack">
      {errors.map(e=> <div key={e.id} className="toast-item" onClick={()=> dispatch(dismissError(e.id))}>{e.message}</div>)}
    </div>
  </>;
}
