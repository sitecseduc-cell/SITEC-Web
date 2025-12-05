import React from 'react';
import Icon from '../components/Icon';

// Recebe as novas props: darkMode e toggleDarkMode
const AuthLayout = ({ title, description, icon, iconColor, children, darkMode, toggleDarkMode }) => (
  <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300 overflow-hidden">
    
    {/* --- BOTÃO DE ALTERNAR TEMA (Topo Direito) --- */}
    <div className="absolute top-6 right-6 z-20">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm ring-1 ring-gray-900/5 transition-all"
        title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        <Icon name={darkMode ? 'sun' : 'moon'} className="w-6 h-6" />
      </button>
    </div>

    {/* --- NOVA MARCA D'ÁGUA (Usando Background Image) --- */}
    {/* - absolute inset-0: Ocupa toda a tela.
        - z-0: Fica atrás de tudo.
        - bg-center bg-no-repeat bg-contain: Centraliza a imagem e ajusta o tamanho sem cortar.
        - opacity-[0.03] / dark:opacity-[0.05]: Transparência bem sutil. Ajuste se necessário.
        - grayscale: Deixa a logo cinza para não brigar com as cores.
        - transform scale-125: Aumenta a imagem em 25% além do tamanho do container para ficar "grande".
        - style={{ backgroundImage... }}: Aponta para a imagem na pasta public.
    */}
    <div 
        className="absolute inset-0 z-0 pointer-events-none bg-center bg-no-repeat bg-contain opacity-[0.03] dark:opacity-[0.05] grayscale transform scale-125 transition-opacity duration-300"
        style={{ backgroundImage: "url('/SITECicone.png')" }}
    ></div>


    {/* --- CARD DE LOGIN (Fica na frente, z-10) --- */}
    <div className="relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col items-center mb-6">
        <div className={`p-3 rounded-full ${iconColor} bg-opacity-10 mb-4`}>
          <Icon name={icon} className={`w-10 h-10 ${iconColor}`} />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">{title}</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout;
