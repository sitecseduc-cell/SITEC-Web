import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import useProcesses from '../../hooks/useProcesses';

// Layouts e Modais
import DashboardLayout from '../../layouts/DashboardLayout';
import ProcessModal from '../../components/ProcessModal';
import SupportModal from '../../components/SupportModal';

// Páginas de Conteúdo
import DashboardGestorComponent from './GestorDashboard';
import DashboardAnalistaComponent from './AnalistaDashboard';
import DashboardSuporteComponent from './SuporteDashboard';
import SettingsComponent from '../settings/Settings';
import PlaceholderComponent from '../../components/PlaceholderComponent';

// Função para definir a aba padrão
const getDefaultTabForRole = (role) => {
  switch(role) {
    case 'Gestor': return 'Início';
    case 'Analista': return 'Início';
    case 'Suporte': return 'Tickets';
    default: return 'Início';
  }
};

// Este é o "cérebro" do dashboard
const DashboardPage = () => {
  const { user } = useAuth();
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [activeTab, setActiveTab] = useState(getDefaultTabForRole(user.role));
  
  const { processes } = useProcesses(user); // 'isLoading' está disponível se você precisar
  
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleEditProcess = (process) => {
    setCurrentProcess(process);
    setIsProcessModalOpen(true);
  };
  
  const handleContactSupport = () => {
    setIsSupportModalOpen(true);
  };
  
  // Renderiza o conteúdo da aba selecionada
  const renderDashboardContent = () => {
    const props = {
      user,
      darkMode,
      toggleDarkMode,
      activeTab,
      processes,
      onContactSupport: handleContactSupport,
      onEditProcess: handleEditProcess,
      // Passa o searchQuery para os dashboards
      // (O DashboardLayout vai clonar e injetar 'searchQuery' aqui)
    };
    
    // Lógica para a aba "Configurações", que é comum a todos
    if (activeTab === 'Configurações') {
      return <SettingsComponent {...props} />;
    }
    
    switch (user.role) {
      case 'Gestor': 
        return <DashboardGestorComponent {...props} />;
      case 'Analista': 
        return <DashboardAnalistaComponent {...props} />;
      case 'Suporte': 
        return <DashboardSuporteComponent {...props} />;
      default:
        return <PlaceholderComponent title="Perfil não encontrado" />;
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {renderDashboardContent()}
      </DashboardLayout>
      
      {/* Modais Globais */}
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