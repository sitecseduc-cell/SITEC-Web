import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Pega o estado inicial do tema (se necessário passar props)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('darkMode', String(newVal));
    if (newVal) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogout = () => signOut(auth);

  if (!user) return null;

  return (
    // MUDANÇA 1: Fundo da página mais escuro/contrastante para destacar os cards
    <div className="flex h-screen w-full bg-[#f3f4f6] dark:bg-[#0f172a] p-3 gap-3 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar agora é um componente flexível, não fixo */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* MUDANÇA 2: O conteúdo principal agora é um grande CARD arredondado */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700/50">
        
        {/* Header fica dentro desse card */}
        <Header
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in pb-10">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
