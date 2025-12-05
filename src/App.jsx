import React, { useState, useEffect } from 'react'; // Adicione useState e useEffect
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// ... imports das páginas (Login, Register, DashboardPage, etc) ...
import LoginComponent from './pages/auth/Login';
import RegisterComponent from './pages/auth/Register';
import ForgotPasswordComponent from './pages/auth/ForgotPassword';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './router/ProtectedRoute';

// ... componentes PublicRoute ...

function App() {
  const { isLoadingAuth } = useAuth();
  
  // 1. MOVE O ESTADO DO TEMA PARA CÁ
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // 2. FUNÇÃO DE TOGGLE E EFEITO CSS
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (isLoadingAuth) return null;

  return (
    <Routes>
      {/* 3. PASSA AS PROPS DE TEMA PARA AS ROTAS PÚBLICAS */}
      <Route path="/login" element={
        <PublicRoute>
            <LoginComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
            <RegisterComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
            <ForgotPasswordComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </PublicRoute>
      } />

      <Route element={<ProtectedRoute />}>
        {/* 4. PASSA AS PROPS DE TEMA PARA O DASHBOARD TAMBÉM */}
        <Route path="/*" element={<DashboardPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      </Route>
    </Routes>
  );
}

export default App;
