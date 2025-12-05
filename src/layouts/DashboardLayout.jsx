import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Importante: Outlet
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [searchQuery, setSearchQuery] = useState(''); // O Search global ainda pode viver aqui

  // Dark Mode Toggle
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
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300`}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Área Principal de Conteúdo */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {/* O Outlet renderiza a rota filha (Ex: /dashboard/processos) */}
            {/* Podemos passar props via Contexto do Outlet se necessário, mas simplificaremos aqui */}
            <Outlet context={{ searchQuery, darkMode }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
