import React from 'react';
import useFilteredProcesses from '../../hooks/useFilteredProcesses'; // Caminho atualizado
import TabelaProcessosRecentes from '../../components/TabelaProcessosRecentes';
import FerramentasComponent from '../../components/FerramentasComponent';
import SettingsComponent from '../settings/Settings';
import Icon from '../../components/Icon';

// Cole o AnalystHomeComponent que estava no App.jsx
const AnalystHomeComponent = () => {
  const faqs = [
    { q: "Como registro um novo processo?", a: "Vá para a aba 'Meus Processos' e clique no botão 'Registrar Novo Processo'. Preencha todos os campos e salve." },
    { q: "Como altero o status de um processo?", a: "Vá para 'Meus Processos', encontre o processo na lista e clique em 'Alterar'. Você poderá modificar o status no modal que se abrirá." },
    { q: "Onde vejo as ferramentas?", a: "Clique na aba 'Ferramentas' no menu lateral para acessar o Hollides, Reader, Ticker e o contato de suporte." },
  ];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sobre o SITEC</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Bem-vindo ao SITEC, a sua plataforma centralizada para gestão de processos e produtividade.
          Este sistema foi desenhado para simplificar seu fluxo de trabalho diário.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Na aba <strong>Meus Processos</strong>, você pode registrar sua produção diária e alterar o status dos processos sob sua responsabilidade.</li>
          <li>Em <strong>Ferramentas</strong>, você encontra links úteis e o canal direto para contato com o suporte.</li>
          <li>Em <strong>Configurações</strong>, você pode atualizar seu perfil e senha.</li>
        </ul>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mural de Notificações</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Atualização do Sistema</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">O módulo 'Hollides' foi atualizado. (1 dia atrás)</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Aviso de Prazo</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Lembrete: Processos pendentes há mais de 48h devem ser priorizados. (3 dias atrás)</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Perguntas Recorrentes (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                {faq.q}
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

// Cole o DashboardAnalistaComponent que estava no App.jsx
const DashboardAnalistaComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode, processes, onContactSupport, onEditProcess }) => {
  const filteredProcesses = useFilteredProcesses(searchQuery, processes);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return <AnalystHomeComponent />;
      case 'Meus Processos':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => onEditProcess(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                <Icon name="plus" className="w-5 h-5" />
                Registrar Novo Processo
              </button>
            </div>
            <TabelaProcessosRecentes 
              processes={filteredProcesses} 
              onEditProcess={onEditProcess}
              userRole={user.role}
            />
          </div>
        );
      case 'Ferramentas':
        return <FerramentasComponent onContactSupport={onContactSupport} />;
      case 'Configurações':
        return <SettingsComponent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <AnalystHomeComponent />;
    }
  };
  return <>{renderContent()}</>;
};

export default DashboardAnalistaComponent;