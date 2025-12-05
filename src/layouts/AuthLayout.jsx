import React from 'react';
import Icon from '../components/Icon';

const AuthLayout = ({ title, description, icon, iconColor, children }) => (
  // Adicionado 'relative' e 'overflow-hidden' ao container principal
  <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300 overflow-hidden">
    
    {/* --- INÍCIO DA MARCA D'ÁGUA --- */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <img 
        src="/SITECicone.png" 
        alt="Marca d'água SITEC" 
        // Ajuste o tamanho (w-96) e a opacidade (opacity-5) conforme seu gosto
        className="w-[600px] h-[600px] object-contain opacity-5 dark:opacity-[0.03] grayscale" 
      />
    </div>
    {/* --- FIM DA MARCA D'ÁGUA --- */}

    {/* O Card de Login recebe 'relative' e 'z-10' para garantir que fique SOBRE a marca d'água */}
    <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
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
