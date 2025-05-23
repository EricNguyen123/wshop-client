import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './features/auth/slice';
import userReducer from './features/user/slice';
import bannerReducer from './features/banner/slice';
import productReducer from './features/product/slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['value', 'authenticated', 'currentAccount'],
};

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'banner', 'product'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  banner: bannerReducer,
  product: productReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
