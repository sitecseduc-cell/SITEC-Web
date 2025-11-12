import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '../components/Icon'; // Importe o Icon

// Cole o Sidebar que estava no App.jsx
const Sidebar = ({ user, onLogout, activeTab, onTabChange, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const navItems = {
    'Gestor': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Processos' }, { icon: 'pieChart', label: 'Relatórios' }, { icon: 'briefcase', label: 'Ferramentas' }, { icon: 'settings', label: 'Configurações' } ],
    'Analista': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Meus Processos' }, { icon: 'briefcase', label: 'Ferramentas' }, { icon: 'settings', label: 'Configurações' } ],
    'Suporte': [ { icon: 'lifeBuoy', label: 'Tickets' }, { icon: 'users', label: 'Usuários' }, { icon: 'briefcase', label: 'Ferramentas' } ],
  };
   
  const currentNavItems = navItems[user?.role] || navItems['Suporte'];

  const handleTabChange = (label) => {
    onTabChange(label);
    setIsMobileSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-20 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center">
          <Icon name="logo" className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">SITEC</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {currentNavItems.map(item => {
          const isActive = activeTab === item.label;
          return (
            <button
              onClick={() => handleTabChange(item.label)}
              key={item.label}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-colors duration-150 ${
                isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-5 w-5 mr-3 transition-colors duration-150 ${
                  isActive
                  ? 'text-white'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="Avatar do usuário" />
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role} ({user.sector})</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition duration-150 ease-in-out">
          <Icon name="logOut" className="w-4 h-4 mr-2" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-64 bg-white dark:bg-gray-800 flex-col border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 hidden md:flex">
        <SidebarContent />
      </aside>
      <Transition show={isMobileSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setIsMobileSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsMobileSidebarOpen(false)}>
                    <span className="sr-only">Fechar sidebar</span>
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