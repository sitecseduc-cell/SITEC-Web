// src/main.jsx (Atualizado novamente)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // 1. Importe
import App from './App.jsx'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 2. Envolva o App (dentro do BrowserRouter) */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)