import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '../components/Icon'; // Importe o Icon
import useNotifications from '../hooks/useNotifications'; // Importe o hook!
import { doc, updateDoc } from "firebase/firestore"; // Importe do firebase
import { db } from '../firebaseConfig'; // Importe o db

// Cole o NotificationPanel que estava no App.jsx
const NotificationPanel = ({ isOpen, setIsOpen, notifications, user }) => {
  const markAsRead = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };
  
  const handleSendMessage = () => {
    alert("Função 'Enviar Mensagem' ainda não implementada.");
  }

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h3>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center p-6">Nenhuma notificação nova.</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className={`p-4 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">{notif.fromName || 'Sistema'}</span>: {notif.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notif.timestamp?.toDate().toLocaleString('pt-BR') || 'agora'}
                </p>
                {!notif.read && (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        {user.role !== 'Gestor' && (
           <div className="p-2 border-t dark:border-gray-700">
             <button 
               onClick={handleSendMessage}
               className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
             >
               Enviar Mensagem ao Gestor
             </button>
           </div>
        )}
      </div>
    </Transition>
  );
};

// Cole o Header que estava no App.jsx
const Header = ({ user, darkMode, toggleDarkMode, searchQuery, setSearchQuery, setIsMobileSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  
  // Use o hook importado!
  const { notifications, unreadCount } = useNotifications(user?.uid); 
  
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR');
  const formattedDate = time.toLocaleDateString('pt-BR', { dateStyle: 'full' });

  return (
    <header className="flex-1 flex items-center justify-between h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 transition-colors duration-300">
      {/* ... (conteúdo do header permanece o mesmo) ... */}
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden mr-4 p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Olá, {user?.username || 'Usuário'}!</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-6">
        <div className="hidden md:block relative w-64">
          <label htmlFor="search-process" className="sr-only">Buscar processos</label>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="search" className="h-5 w-5 text-gray-400"/>
          </span>
          <input
            id="search-process"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar processos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 hidden lg:block" aria-label={`Horário atual: ${formattedTime}`}>{formattedTime}</p>
        
        <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}>
          <Icon name={darkMode ? 'sun' : 'moon'} className="h-6 w-6" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsNotificationPanelOpen(prev => !prev)} 
            className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" 
            aria-label="Ver notificações"
          >
            <Icon name="bell" className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-white text-xs" style={{ fontSize: '0.6rem' }}>
                  {unreadCount}
                </span>
              </span>
            )}
          </button>
          
          <NotificationPanel 
            isOpen={isNotificationPanelOpen} 
            setIsOpen={setIsNotificationPanelOpen} 
            notifications={notifications}
            user={user}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;