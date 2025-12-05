import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '../components/Icon';

const Sidebar = ({ user, onLogout, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  
  const navItems = {
    'Gestor': [
      { icon: 'home', label: 'Visão Geral', path: '/dashboard', end: true },
      { icon: 'folderKanban', label: 'Processos', path: '/dashboard/processos' },
      { icon: 'pieChart', label: 'Relatórios', path: '/dashboard/relatorios' },
      { icon: 'briefcase', label: 'Ferramentas', path: '/dashboard/ferramentas' },
      { icon: 'settings', label: 'Configurações', path: '/dashboard/configuracoes' }
    ],
    // ... (Mantenha os itens de Analista e Suporte iguais) ...
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
    ],
  };

  const menuItems = navItems[user?.role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header da Logo - Mais limpo */}
      <div className="flex items-center h-24 px-8">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 mr-3">
            <Icon name="logo" className="h-6 w-6 text-white" />
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">SITEC</h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Gestão Pública</p>
        </div>
      </div>

      {/* Navegação - Botões mais modernos (Pills) */}
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
            `}
          >
            {({ isActive }) => (
                <>
                    <Icon
                        name={item.icon}
                        className={`mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                            isActive ? 'text-white scale-110' : 'text-gray-400 group-hover:text-blue-500'
                        }`}
                    />
                    {item.label}
                </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer do Usuário - Cartão Flutuante */}
      <div className="p-4 mt-auto">
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center mb-3">
            <img 
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700" 
                src={user.avatar} 
                alt="" 
            />
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
            </div>
            </div>
            <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-xl transition-colors"
            >
            <Icon name="logOut" className="w-3.5 h-3.5 mr-2" />
            Sair
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Sidebar visível sempre, mas sem 'fixed' para respeitar o layout flex */}
      <aside className="hidden md:flex w-72 flex-col rounded-[2rem] bg-[#f3f4f6] dark:bg-[#0f172a]">
        <SidebarContent />
      </aside>

      {/* Mobile: Mantém o Drawer (Modal) */}
      <Transition show={isMobileSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#f3f4f6] dark:bg-[#0f172a] shadow-2xl">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsMobileSidebarOpen(false)}>
                    <Icon name="x" className="h-6 w-6 text-white" />
                  </button>
                </div>
              <SidebarContent />
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default Sidebar;
