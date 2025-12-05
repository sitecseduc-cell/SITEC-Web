import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import LoginComponent from './pages/auth/Login';
import RegisterComponent from './pages/auth/Register';
import ForgotPasswordComponent from './pages/auth/ForgotPassword';

// Layout e Dashboard Wrapper
import DashboardLayout from './layouts/DashboardLayout'; 

// Dashboard Views (Vamos extrair os componentes internos do antigo DashboardPage para cá ou criar novos arquivos)
import DashboardGestorComponent from './pages/dashboard/GestorDashboard';
import DashboardAnalistaComponent from './pages/dashboard/AnalistaDashboard';
import DashboardSuporteComponent from './pages/dashboard/SuporteDashboard';
import TabelaProcessosRecentes from './components/TabelaProcessosRecentes';
import FerramentasComponent from './components/FerramentasComponent';
import SettingsComponent from './pages/settings/Settings';
import PlaceholderComponent from './components/PlaceholderComponent';

// Auth Guard
import ProtectedRoute from './router/ProtectedRoute';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Componente para decidir qual "Home" mostrar baseada no cargo
const RoleBasedHome = () => {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case 'Gestor': return <DashboardGestorComponent user={user} activeTab="Início" />; // Passar props necessárias
    case 'Analista': return <DashboardAnalistaComponent user={user} activeTab="Início" />;
    case 'Suporte': return <DashboardSuporteComponent user={user} activeTab="Tickets" />;
    default: return <PlaceholderComponent title="Acesso Negado" />;
  }
};

function App() {
  const { isLoadingAuth, user } = useAuth();

  if (isLoadingAuth) return null;

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginComponent /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterComponent /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordComponent /></PublicRoute>} />

      {/* Rota Pai do Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
            {/* Rota Index (O que aparece quando acessa /dashboard) */}
            <Route index element={<RoleBasedHome />} />
            
            {/* Sub-rotas Modernas */}
            <Route path="processos" element={<TabelaProcessosRecentes userRole={user?.role} processes={[]} />} /> {/* Precisará ajustar props */}
            <Route path="ferramentas" element={<FerramentasComponent />} />
            <Route path="configuracoes" element={<SettingsComponent user={user} />} />
            <Route path="usuarios" element={user?.role === 'Suporte' ? <DashboardSuporteComponent user={user} activeTab="Usuários"/> : <Navigate to="/dashboard" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
