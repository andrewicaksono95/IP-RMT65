import { configureStore, isPending, isRejected, isFulfilled } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import fruitReducer from './slices/fruitSlice.js';
import favoriteReducer from './slices/favoriteSlice.js';
import profileReducer from './slices/profileSlice.js';
import aiReducer from './slices/aiSlice.js';
import uiReducer, { requestStarted, requestFinished, pushError } from './slices/uiSlice.js';

const lifecycleMiddleware = () => next => action => {
  if (isPending(action)) next(requestStarted());
  const result = next(action);
  if (isFulfilled(action) || isRejected(action)) next(requestFinished());
  if (isRejected(action) && action.error?.message) next(pushError(action.error.message));
  return result;
};

export default configureStore({
  reducer: { auth: authReducer, fruits: fruitReducer, favorites: favoriteReducer, profile: profileReducer, ai: aiReducer, ui: uiReducer },
  middleware: getDefault => getDefault().concat(lifecycleMiddleware)
});
