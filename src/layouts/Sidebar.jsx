import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'; // Usar NavLink
import { Dialog, Transition } from '@headlessui/react';
import Icon from '../components/Icon';

const Sidebar = ({ user, onLogout, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  
  // Definição das rotas baseadas no PATH real
  const navItems = {
    'Gestor': [
      { icon: 'home', label: 'Visão Geral', path: '/dashboard', end: true }, // end=true para home exata
      { icon: 'folderKanban', label: 'Processos', path: '/dashboard/processos' },
      { icon: 'pieChart', label: 'Relatórios', path: '/dashboard/relatorios' },
      { icon: 'briefcase', label: 'Ferramentas', path: '/dashboard/ferramentas' },
      { icon: 'settings', label: 'Configurações', path: '/dashboard/configuracoes' }
    ],
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header do Sidebar */}
      <div className="flex items-center h-20 px-6 border-b border-gray-100 dark:border-gray-700">
        <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
            <Icon name="logo" className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SITEC</h1>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setIsMobileSidebarOpen(false)}
            className={({ isActive }) => `
              group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
              ${isActive 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}
            `}
          >
            {({ isActive }) => (
                <>
                    <Icon
                        name={item.icon}
                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        }`}
                    />
                    {item.label}
                </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer do Usuário (Modernizado) */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center mb-4">
          <img 
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-600 shadow-sm" 
            src={user.avatar} 
            alt="" 
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
          </div>
        </div>
        <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center px-4 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Icon name="logOut" className="w-3.5 h-3.5 mr-2" />
          Encerrar Sessão
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>
      {/* Espaçador para o conteúdo não ficar atrás do sidebar fixo */}
      <div className="hidden md:block w-72 flex-shrink-0" />

      {/* Sidebar Mobile (mantém a lógica do HeadlessUI, apenas conteúdo atualizado) */}
      <Transition show={isMobileSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white dark:bg-gray-800">
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
