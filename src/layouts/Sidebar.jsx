import React, { Fragment, useState, useEffect } from 'react'; // Adicione useState, useEffect
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '../components/Icon';
import useKonamiCode from '../hooks/useKonamiCode'; // 1. Importe o hook

const Sidebar = ({ user, onLogout, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  
  // 2. Estado para controlar se o Easter Egg está desbloqueado
  // Usamos localStorage para que, uma vez desbloqueado, fique para sempre (até limpar cache)
  const [isEasterEggUnlocked, setIsEasterEggUnlocked] = useState(() => {
    return localStorage.getItem('sitec_easter_egg') === 'true';
  });

  // 3. Usa o Hook
  const konamiSuccess = useKonamiCode();

  // 4. Efeito para desbloquear
  useEffect(() => {
    if (konamiSuccess && !isEasterEggUnlocked) {
      setIsEasterEggUnlocked(true);
      localStorage.setItem('sitec_easter_egg', 'true');
      alert("🥚 VOCÊ DESBLOQUEOU UM SEGREDO! 🥚\nConfira o menu lateral...");
    }
  }, [konamiSuccess, isEasterEggUnlocked]);

  // Definição dos itens
  const navItems = {
    'Gestor': [
      { icon: 'home', label: 'Visão Geral', path: '/dashboard', end: true },
      { icon: 'folderKanban', label: 'Processos', path: '/dashboard/processos' },
      { icon: 'pieChart', label: 'Relatórios', path: '/dashboard/relatorios' },
      { icon: 'briefcase', label: 'Ferramentas', path: '/dashboard/ferramentas' },
      { icon: 'settings', label: 'Configurações', path: '/dashboard/configuracoes' }
    ],
    // ... (Mantenha Analista e Suporte iguais) ...
    'Analista': [
        { icon: 'home', label: 'Visão Geral', path: '/dashboard', end: true },
        { icon: 'folderKanban', label: 'Meus Processos', path: '/dashboard/processos' },
        { icon: 'briefcase', label: 'Ferramentas', path: '/dashboard/ferramentas' },
        { icon: 'settings', label: 'Configurações', path: '/dashboard/configuracoes' }
    ],
    'Suporte': [
        { icon: 'lifeBuoy', label: 'Tickets', path: '/dashboard', end: true },
        { icon: 'users', label: 'Usuários', path: '/dashboard/usuarios' },
        { icon: 'briefcase', label: 'Ferramentas', path: '/dashboard/ferramentas' }
    ]
  };

  // 5. Adiciona o item se desbloqueado
  let menuItems = navItems[user?.role] || [];
  
  if (isEasterEggUnlocked) {
    // Adiciona logo após Configurações (ou no final)
    menuItems = [
      ...menuItems,
      { 
        icon: 'sparkles', // Ícone especial
        label: 'Sobre a SEDUC', 
        path: '/dashboard/sobre-seduc',
        special: true // Flag para estilizar diferente (opcional)
      }
    ];
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ... (Header da Logo igual) ... */}
      <div className="flex items-center h-24 px-8">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 mr-3">
            <Icon name="logo" className="h-6 w-6 text-white" />
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">SITEC</h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Gestão Pública</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setIsMobileSidebarOpen(false)}
            className={({ isActive }) => `
              group flex items-center px-5 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 translate-x-1' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'}
              ${item.special ? 'animate-pulse text-purple-500 hover:text-purple-700' : ''} 
            `}
          >
            {({ isActive }) => (
                <>
                    <Icon
                        name={item.icon}
                        className={`mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                            isActive ? 'text-white scale-110' : (item.special ? 'text-purple-500' : 'text-gray-400 group-hover:text-blue-500')
                        }`}
                    />
                    {item.label}
                </>
            )}
          </NavLink>
        ))}
      </nav>
      {/* ... (Footer do usuário igual) ... */}
      <div className="p-4 mt-auto">
        {/* ... código do footer ... */}
      </div>
    </div>
  );

  return (
    <>
      {/* ... (Return do Sidebar igual) ... */}
      <aside className="hidden md:flex w-72 flex-col rounded-[2rem] bg-[#f3f4f6] dark:bg-[#0f172a]">
        <SidebarContent />
      </aside>
      {/* ... Mobile ... */}
    </>
  );
};

export default Sidebar;
