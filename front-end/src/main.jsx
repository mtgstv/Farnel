import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import FavoritosProvider from './contexts/FavoritosProvider.jsx';
import { limparDadosDaAV1 } from './services/armazenamento.js';
import './index.css';

limparDadosDaAV1();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritosProvider>
          <App />
        </FavoritosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
