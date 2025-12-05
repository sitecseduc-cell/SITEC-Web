import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useProcesses from '../../hooks/useProcesses';

// Layouts e Modais
import DashboardLayout from '../../layouts/DashboardLayout';
import ProcessModal from '../../components/ProcessModal';
import SupportModal from '../../components/SupportModal';

// Páginas de Conteúdo
import DashboardGestorComponent from './GestorDashboard';
import DashboardAnalistaComponent from './AnalistaDashboard';
import DashboardSuporteComponent from './SuporteDashboard';
import TabelaProcessosRecentes from '../../components/TabelaProcessosRecentes';
import FerramentasComponent from '../../components/FerramentasComponent';
import SettingsComponent from '../settings/Settings';
import PlaceholderComponent from '../../components/PlaceholderComponent';

const DashboardPage = () => {
  const { user } = useAuth();
  const { processes } = useProcesses(user); // Busca os dados aqui
  
  // Estados dos Modais
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);

  // Handlers
  const handleEditProcess = (process) => {
    setCurrentProcess(process);
    setIsProcessModalOpen(true);
  };
  
  const handleContactSupport = () => {
    setIsSupportModalOpen(true);
  };

  // Props que todas as telas precisam
  const commonProps = {
    user,
    processes, // Agora os dados são passados corretamente
    onContactSupport: handleContactSupport,
    onEditProcess: handleEditProcess,
  };

  // Define a Home baseada no cargo
  const RoleBasedHome = () => {
    switch (user.role) {
      case 'Gestor': return <DashboardGestorComponent {...commonProps} activeTab="Início" />;
      case 'Analista': return <DashboardAnalistaComponent {...commonProps} activeTab="Início" />;
      case 'Suporte': return <DashboardSuporteComponent {...commonProps} activeTab="Tickets" />;
      default: return <PlaceholderComponent title="Acesso Negado" />;
    }
  };

  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* Rota Inicial (Visão Geral) */}
          <Route index element={<RoleBasedHome />} />
          
          {/* Rotas Específicas */}
          <Route path="processos" element={
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Processos</h2>
                  {user.role !== 'Suporte' && (
                    <button 
                      onClick={() => handleEditProcess(null)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                      + Novo Processo
                    </button>
                  )}
                </div>
                <TabelaProcessosRecentes 
                  processes={processes} 
                  onEditProcess={handleEditProcess}
                  userRole={user.role} 
                />
             </div>
          } />
          
          <Route path="ferramentas" element={<FerramentasComponent onContactSupport={handleContactSupport} />} />
          <Route path="configuracoes" element={<SettingsComponent user={user} />} />
          <Route path="relatorios" element={<PlaceholderComponent title="Relatórios" />} />
          
          <Route path="usuarios" element={
            user.role === 'Suporte' 
              ? <DashboardSuporteComponent {...commonProps} activeTab="Usuários" /> 
              : <Navigate to="/dashboard" />
          } />
        </Route>
      </Routes>

      {/* Modais Globais (Ficam fora das rotas para não desmontar) */}
      <ProcessModal
        isOpen={isProcessModalOpen}
        setIsOpen={setIsProcessModalOpen}
        process={currentProcess}
        user={user}
      />
      <SupportModal
        isOpen={isSupportModalOpen}
        setIsOpen={setIsSupportModalOpen}
        user={user}
      />
    </>
  );
};

export default DashboardPage;
