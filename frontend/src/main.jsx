import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import './index.css'
import { Toaster} from './components/ui/sonner.jsx'
import store from './redux/store.js'
import {persistStore} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <Provider store = {store}>
      <PersistGate loading={null} persistor={persistor}>
         <App />
         <Toaster richColors position="top-center"  visibleToasts = {1} 
        toastOptions={{
            success: {
              style: {
                backgroundColor: '#1F2937', // Dark background for success
                color: '#10B981', // Green text for success
              },
              iconTheme: {
                primary: '#10B981', // Green icon color for success
                secondary: '#FFFFFF', // White secondary icon color for success
              },
              closeButton: {
                backgroundColor: '#374151', // Close button color for success
                color: '#FFFFFF', // Close button text/icon color for success
              },
            },
            error: {
              style: {
                backgroundColor: '#1F2937', // Dark background for error
                color: '#EF4444', // Red text for error
              },
              iconTheme: {
                primary: '#EF4444', // Red icon color for error
                secondary: '#FFFFFF', // White secondary icon color for error
              },
              closeButton: {
                backgroundColor: '#374151', // Close button color for error
                color: '#FFFFFF', // Close button text/icon color for error
              },
            },
          }}
    />
      </PersistGate>
    </Provider>
    
    </StrictMode>
  
);
