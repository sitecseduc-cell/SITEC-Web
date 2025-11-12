import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Importações das Páginas
import LoginComponent from './pages/auth/Login';
import RegisterComponent from './pages/auth/Register';
import ForgotPasswordComponent from './pages/auth/ForgotPassword';
import DashboardPage from './pages/dashboard/DashboardPage'; // A "página" principal do dashboard

// Importações de Roteamento
import ProtectedRoute from './router/ProtectedRoute';

// Componente "PublicRoute" opcional para redirecionar usuários logados
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};


// --- COMPONENTE PRINCIPAL APP ---
function App() {
  const { isLoadingAuth } = useAuth(); // Apenas para garantir que não haja "pisca-pisca"

  if (isLoadingAuth) {
    // O AuthProvider já mostra um "Carregando...", 
    // então podemos simplesmente retornar null.
    return null; 
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<PublicRoute><LoginComponent /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterComponent /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordComponent /></PublicRoute>} />

      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        {/* Qualquer rota aqui dentro exige login */}
        {/* Usamos "/*" para que o DashboardPage gerencie as sub-rotas (com 'activeTab') */}
        <Route path="/*" element={<DashboardPage />} />
      </Route>
      
      {/* Se usuário não estiver logado e tentar acessar algo, 
          o ProtectedRoute o manda para /login */}
    </Routes>
  );
}

export default App;
