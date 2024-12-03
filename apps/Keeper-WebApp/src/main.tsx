import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'reduxStore/store';
import { ThemeProvider } from 'theme/theme.context';
import { DEFAULT_THEME } from 'theme/default.theme';
import Amplify from '@aws-amplify/core';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import App from 'App';

import './assets/fonts/Borna-Medium.otf';
import './assets/fonts/CircularStd-Book.otf';
import './assets/fonts/CircularStd-Light.otf';
import './assets/fonts/CircularStd-Medium.otf';

import './index.css';

import { awsconfig } from './aws-exports';

Amplify.configure(awsconfig);

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider initial={DEFAULT_THEME}>
    <Provider store={store}>
      <Toaster toastOptions={{ duration: 5000, position: 'bottom-center' }} />
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ThemeProvider>
);
