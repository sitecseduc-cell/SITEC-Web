import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Depende do Sidebar
import Header from './Header'; // Depende do Header

// Cole o DashboardLayout que estava no App.jsx
// Note que removemos 'user', 'onLogout', etc. da lista de props
// porque os componentes filhos (Sidebar, Header) vão pegar do context
const DashboardLayout = ({ user, onLogout, darkMode, toggleDarkMode, children, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // O user agora é pego pelo useAuth() nos componentes filhos,
  // mas vamos mantê-lo aqui por enquanto para passar pro Sidebar e Header
  // Na próxima refatoração, removeríamos isso.
  if (!user) {
    return null;
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans`}>
      <Sidebar
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto" id="printable-area">
            {/* O cloneElement não é mais necessário com o roteador,
                mas vamos manter a lógica do children por enquanto.
                O 'children' será o <DynamicDashboard /> do App.jsx */}
            {React.Children.map(children, child =>
              React.cloneElement(child, { searchQuery }) // Passa apenas o searchQuery
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;