'use client';

import type React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import Loading from '@/components/skeleton/loading';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading loading={true} />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
