import React, { useState, useMemo } from 'react';
import useFilteredProcesses from '../../hooks/useFilteredProcesses';
import TabelaProcessosRecentes from '../../components/TabelaProcessosRecentes';
import FerramentasComponent from '../../components/FerramentasComponent';
import SettingsComponent from '../settings/Settings';
import PlaceholderComponent from '../../components/PlaceholderComponent';
import Icon from '../../components/Icon';

// Cole o StaticPieChart que estava no App.jsx
const StaticPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  const slices = data.map((item, i) => {
    if (total === 0) return null;
    const fraction = item.value / total;
    const endAngle = startAngle + fraction * 360;
    const largeArcFlag = fraction > 0.5 ? 1 : 0;
    const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
    const pathData = `M100,100 L${x1},${y1} A80,80 0 ${largeArcFlag},1 ${x2},${y2} Z`;
    const slice = <path key={i} d={pathData} fill={item.color} />;
    startAngle = endAngle;
    return slice;
  }).filter(Boolean);

  return (
    <div className="w-full h-64 flex justify-center items-center">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {slices}
        <circle cx="100" cy="100" r="40" fill="white" className="dark:fill-gray-800" />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total: {total}</p>
      </div>
    </div>
  );
};

// Cole o DashboardGestorComponent que estava no App.jsx
const DashboardGestorComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode, processes, onContactSupport, onEditProcess }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const filteredProcesses = useFilteredProcesses(searchQuery, processes);

  const stats = useMemo(() => {
    const total = processes.length;
    const aprovados = processes.filter(p => p.status === 'Aprovado').length;
    const emAnalise = processes.filter(p => p.status === 'Em Análise').length;
    const taxaAprovacao = total === 0 ? 0 : (aprovados / total) * 100;
    
    return {
      total,
      aprovados,
      emAnalise,
      taxaAprovacao: taxaAprovacao.toFixed(1) + '%'
    };
  }, [processes]);

  // Cole o StatCard que estava dentro do GestorDashboard
  const StatCard = ({ title, value, icon, color }) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
      yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50'
    };
    const classes = colorMap[color];
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${classes}`}>
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    );
  };

  const handleGenerateSummary = () => {
    setIsSummaryLoading(true);
    setSummaryError('');
    setSummary('');
    setTimeout(() => {
      setSummary(`✅ **Resumo Gerencial**\n\n- Total de processos: ${stats.total}\n- ${stats.taxaAprovacao} aprovados.\n- Processos em análise: ${stats.emAnalise}.\n- **Ação recomendada**: Verificar processos pendentes e em análise para garantir o fluxo.`);
      setIsSummaryLoading(false);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* ... (JSX do 'Início' do gestor) ... */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral do Gestor</h2>
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
              >
                <Icon name="sparkles" className="w-4 h-4"/>
                {isSummaryLoading ? 'Gerando...' : 'Gerar Resumo Inteligente'}
              </button>
            </div>
            {isSummaryLoading && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[150px]">
                {/* ... (JSX do loading) ... */}
              </div>
            )}
            {summaryError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"><p>{summaryError}</p></div>}
            {summary && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700">
                {/* ... (JSX do summary) ... */}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Processos" value={stats.total} icon="folderKanban" color="blue" />
              <StatCard title="Processos Aprovados" value={stats.aprovados} icon="shieldCheck" color="green" />
              <StatCard title="Em Análise" value={stats.emAnalise} icon="clock" color="yellow" />
              <StatCard title="Taxa de Aprovação" value={stats.taxaAprovacao} icon="pieChart" color="purple" />
            </div>
            <TabelaProcessosRecentes 
              processes={filteredProcesses} 
              onEditProcess={onEditProcess}
              userRole={user.role}
            />
          </div>
        );
      case 'Processos':
        return <TabelaProcessosRecentes 
                  processes={filteredProcesses} 
                  onEditProcess={onEditProcess}
                  userRole={user.role}
                />;
      case 'Relatórios':
        return <PlaceholderComponent title="Relatórios" />;
      case 'Ferramentas':
        return <FerramentasComponent onContactSupport={onContactSupport} />;
      case 'Configurações':
        return <SettingsComponent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};

export default DashboardGestorComponent;