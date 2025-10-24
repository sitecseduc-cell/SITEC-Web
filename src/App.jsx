// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- IMPORTAÇÕES DO FIREBASE ---
import { auth, db } from './firebaseConfig'; // Garanta que firebaseConfig.js existe em src/
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// --- ÍCONES SVG COMO COMPONENTES ---
const Icon = ({ name, className }) => {
  const icons = {
    logo: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    shieldCheck: <><path d="M20 13c0 5-6 9-8 9s-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></>,
    keyRound: <><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>,
    calendarDays: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></>,
    fileText: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    folderKanban: <><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0 2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>,
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>,
    barChart: <path d="M3 3v18h18" />,
    sparkles: <path d="m12 3-1.9 3.9-3.9 1.9 3.9 1.9 1.9 3.9 1.9-3.9 3.9-1.9-3.9-1.9L12 3zM5 11l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zm14 0-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"/>,
    briefcase: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    menu: <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

// --- DADOS MOCKADOS (Mantidos por enquanto para a tabela) ---
const getFormattedDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const mockRecentProcesses = [
  { id: 'PROC-001', solicitante: 'Ana Silva', status: 'Aprovado', dataSubmissao: getFormattedDate(1) },
  { id: 'PROC-002', solicitante: 'Bruno Costa', status: 'Em Análise', dataSubmissao: getFormattedDate(2) },
  { id: 'PROC-003', solicitante: 'Carla Dias', status: 'Pendente', dataSubmissao: getFormattedDate(2) },
  { id: 'PROC-004', solicitante: 'Daniel Martins', status: 'Rejeitado', dataSubmissao: getFormattedDate(3) },
  { id: 'PROC-005', solicitante: 'Eduarda Faria', status: 'Aprovado', dataSubmissao: getFormattedDate(4) },
];

const useFilteredProcesses = (searchQuery) => {
  return useMemo(() => {
    if (!searchQuery) return mockRecentProcesses;
    const lowercasedQuery = searchQuery.toLowerCase();
    return mockRecentProcesses.filter(p =>
      p.id.toLowerCase().includes(lowercasedQuery) ||
      p.solicitante.toLowerCase().includes(lowercasedQuery) ||
      p.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);
};

const getStatusClass = (status) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'Aprovado': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
    case 'Pendente': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
    case 'Em Análise': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`;
    case 'Rejeitado': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
    default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100`;
  }
};

// --- COMPONENTES ---
const AuthLayout = ({ title, description, icon, iconColor, children }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
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

const InputField = ({ id, label, type, value, onChange, disabled, required, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      id={id}
      type={type}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

// --- LoginComponent (ATUALIZADO PARA FIREBASE) ---
const LoginComponent = ({ onViewChange, onLogin }) => {
  const [username, setUsername] = useState(''); // Este agora será o E-MAIL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => { // TORNADO ASYNC
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const email = username; // 'username' do state agora é o email

    try {
      // 1. Tenta fazer login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Busca os dados extras (role) do usuário no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // 3. Chama o onLogin com os dados REAIS do Firebase + Firestore
        // O onAuthStateChanged vai lidar com a atualização do estado global,
        // mas podemos chamar onLogin se precisar fazer algo extra aqui.
        // onLogin({
        //   username: userData.fullName, // Pega o nome do Firestore
        //   role: userData.role, // Pega o role do Firestore
        //   avatar: `https://placehold.co/100x100/6366f1/FFFFFF?text=${userData.fullName.charAt(0)}`
        // });
        // Geralmente, o onAuthStateChanged já cuida da transição de tela
      } else {
        // Usuário autenticado mas sem dados no Firestore (caso raro)
        await signOut(auth); // Desloga se não tiver dados
        throw new Error("Dados do usuário não encontrados.");
      }
      // Se chegou aqui, o login foi sucesso e o onAuthStateChanged vai mudar a view
      // setIsSubmitting(false) não é estritamente necessário se a view muda

    } catch (error) {
      // Trata erros (ex: senha errada, usuário não encontrado)
      setMessage('E-mail ou senha inválidos.'); // NOVA MENSAGEM DE ERRO
      setIsSubmitting(false);
      console.error("Erro no login:", error);
    }
  };

  return (
    <AuthLayout title="Login" description="Acesso à Plataforma de Gestão Pública" icon="logo" iconColor="text-blue-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div role="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm text-center">
            <p>{message}</p>
          </div>
        )}
        <div>
          {/* O label foi alterado para E-mail para corresponder ao Firebase Auth */}
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
          <input
            id="username"
            type="email" // Alterado para email
            className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
            placeholder="seu.email@exemplo.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-end text-sm">
          <button
            type="button"
            onClick={() => onViewChange('forgotPassword')}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            disabled={isSubmitting}
          >
            Esqueceu sua senha?
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem uma conta?{' '}
        <button
          onClick={() => onViewChange('register')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Cadastre-se aqui
        </button>
      </div>
    </AuthLayout>
  );
};

// --- RegisterComponent (ATUALIZADO PARA FIREBASE) ---
const RegisterComponent = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    registration: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => { // TORNADO ASYNC
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    // Adicionar verificação de senha mínima (Firebase exige 6 caracteres)
    if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
    }
    setIsSubmitting(true);

    // SUBSTITUÍDO TIMEOUT PELA LÓGICA DO FIREBASE
    try {
      // 1. Cria o usuário no Firebase Authentication (apenas email e senha)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Salva os dados extras (nome, matrícula) no Firestore
      // Vamos definir um 'role' padrão de 'Visitante' para novos cadastros
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        registration: formData.registration,
        email: formData.email,
        role: 'Visitante' // Defina um role padrão
      });

      // Sucesso
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Conta criada com sucesso! Você será redirecionado para o login.' });
      setTimeout(() => onViewChange('login'), 2000);

    } catch (error) {
      // Trata erros (ex: email já em uso)
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está em uso.' });
      } else if (error.code === 'auth/weak-password') { // Já verificamos antes, mas bom ter
        setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar conta. Tente novamente.' });
      }
      console.error("Erro no registro:", error);
    }
  };

  return (
    <AuthLayout title="Cadastre-se" description="Crie sua conta na Plataforma" icon="userPlus" iconColor="text-green-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div role="alert" className={`${message.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
            <p>{message.text}</p>
          </div>
        )}
        <InputField id="fullName" label="Nome Completo" type="text" value={formData.fullName} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="registration" label="Matrícula" type="text" value={formData.registration} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="password" label="Senha (mín. 6 caracteres)" type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} required />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Já tem uma conta?{' '}
        <button
          onClick={() => onViewChange('login')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Faça login aqui
        </button>
      </div>
    </AuthLayout>
  );
};

// --- ForgotPasswordComponent (Pode ser atualizado com Firebase depois) ---
const ForgotPasswordComponent = ({ onViewChange }) => {
  // ... (código existente, pode adicionar sendPasswordResetEmail de 'firebase/auth' aqui depois)
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    // TODO: Adicionar lógica do Firebase com sendPasswordResetEmail(auth, email)
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Se um e-mail correspondente for encontrado, um link de recuperação será enviado.' });
      setEmail('');
    }, 1000);
  };

   return (
    <AuthLayout title="Recuperar Senha" description="Insira seu e-mail institucional para receber o link" icon="keyRound" iconColor="text-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div role="alert" className={`${message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
            <p>{message.text}</p>
          </div>
        )}
        <InputField
          id="email"
          label="Email Institucional"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="seu.email@seduc.pa.gov.br"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Lembrou sua senha?{' '}
        <button
          onClick={() => onViewChange('login')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Voltar para o Login
        </button>
      </div>
    </AuthLayout>
  );
};

// --- Componentes do Dashboard (Sidebar, Header, Layouts, etc.) ---
// --- NÃO PRECISAM DE MUDANÇA IMEDIATA ---
const Sidebar = ({ user, onLogout, activeTab, onTabChange, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const navItems = {
    'Gestor': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Processos' }, { icon: 'pieChart', label: 'Relatórios' }, { icon: 'briefcase', label: 'Ferramentas' }, { icon: 'settings', label: 'Configurações' } ],
    'Servidor': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Meus Processos' }, { icon: 'briefcase', label: 'Ferramentas' } ],
    // Ajuste: O role padrão é 'Visitante', então precisamos garantir que ele exista aqui
    'Visitante': [ { icon: 'home', label: 'Início' }, { icon: 'pieChart', label: 'Dados Públicos' }, { icon: 'briefcase', label: 'Ferramentas' } ],
  };
   // Adicione um fallback caso o user.role não seja encontrado
  const currentNavItems = navItems[user?.role] || navItems['Visitante'];


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
         {/* Use currentNavItems aqui */}
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
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
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
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setIsMobileSidebarOpen(false)} aria-hidden="true"></div>
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transform transition-transform ease-in-out duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <span className="sr-only">Fechar sidebar</span>
              <Icon name="x" className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

// ... (Header, DashboardLayout, TabelaProcessosRecentes, etc., continuam iguais)
const Header = ({ user, darkMode, toggleDarkMode, searchQuery, setSearchQuery, setIsMobileSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR');
  const formattedDate = time.toLocaleDateString('pt-BR', { dateStyle: 'full' });

  return (
    <header className="flex-1 flex items-center justify-between h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 transition-colors duration-300">
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden mr-4 p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
        <div>
          {/* Adicionado fallback para user.username */}
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
        <button className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Ver notificações">
          <Icon name="bell" className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
          <span className="sr-only">Você tem novas notificações</span>
        </button>
      </div>
    </header>
  );
};

const DashboardLayout = ({ user, onLogout, darkMode, toggleDarkMode, children, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

   if (!user) { // Adicionado guarda para caso user seja null temporariamente
     return null; // Ou um spinner/loading
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
          <div id="printable-area">
            {React.Children.map(children, child =>
              React.cloneElement(child, { searchQuery, activeTab, user, darkMode, toggleDarkMode })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


const TabelaProcessosRecentes = ({ processes }) => {
  const headerItems = ["ID", "Solicitante", "Status", "Data"];
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Consulta de Processos</h2>
      {(!processes || processes.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Nenhum processo encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {headerItems.map(item => (
                  <th key={item} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{process.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.solicitante}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClass(process.status)}>{process.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.dataSubmissao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PlaceholderComponent = ({ title }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 mt-4">Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.</p>
  </div>
);

const FerramentasComponent = () => {
  const tools = [
    { name: "Hollides", description: "Analisador de férias para otimizar o planejamento da equipe.", icon: "calendarDays", color: "orange", link: "https://hollides.vercel.app/" },
    { name: "Reader", description: "Leitor de documentos PDF integrado à plataforma.", icon: "fileText", color: "red", link: "https://reader-tau-azure.vercel.app/" },
    { name: "Ticker", description: "Relógio de ponto digital para registro de jornada de trabalho.", icon: "clock", color: "green", link: "https://ticker-ccm.vercel.app/" },
  ];

  const colorClasses = {
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', button: 'bg-orange-600 hover:bg-orange-700' },
    red: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', button: 'bg-red-600 hover:bg-red-700' },
    green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', button: 'bg-green-600 hover:bg-green-700' },
  };

  const ToolCard = ({ tool }) => {
    const classes = colorClasses[tool.color] || colorClasses.orange;
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
        <div className={`p-4 rounded-full ${classes.bg} mb-4`}>
          <Icon name={tool.icon} className={`h-8 w-8 ${classes.text}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{tool.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow">{tool.description}</p>
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full block mt-auto px-4 py-2 text-sm font-medium text-white ${classes.button} rounded-lg transition`}
        >
          Acessar Ferramenta
        </a>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Central de Ferramentas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
      </div>
    </div>
  );
};

const SettingsInputField = ({ id, label, type, name, value, onChange, placeholder, disabled = false }) => (
  <div className="flex-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const ToggleSwitch = ({ id, name, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      id={id}
      name={name}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange({ target: { name, checked: !checked } })}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const ProfileSettings = ({ user }) => {
   // Use o usuário passado como prop que vem do estado do App
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: auth.currentUser?.email || '', // Pega email do Firebase Auth se disponível
    avatar: user?.avatar || '',
  });

  // Atualiza o estado local se o usuário (prop) mudar
  useEffect(() => {
     if(user) {
         setProfile({
            username: user.username,
            email: auth.currentUser?.email || '',
            avatar: user.avatar,
         });
     }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => { // Tornar async
    e.preventDefault();
    if (!auth.currentUser) return; // Não faz nada se não estiver logado

    try {
        // Atualiza no Firestore (exemplo: nome e avatar)
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, {
            fullName: profile.username, // Assumindo que username é o fullName
            avatar: profile.avatar,
            // Mantém outros campos que já existiam (IMPORTANTE!)
        }, { merge: true }); // merge: true evita sobrescrever campos existentes como role, email, etc.

        // TODO: Atualizar o display name no Firebase Auth (opcional)
        // await updateProfile(auth.currentUser, { displayName: profile.username, photoURL: profile.avatar });

        alert('Perfil salvo com sucesso!');
        // Opcional: Atualizar o estado 'user' no componente App para refletir a mudança imediatamente
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert('Erro ao salvar perfil.');
    }
  };


  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Perfil Público</h3>
      <form onSubmit={handleProfileSave} className="space-y-6">
        <div className="flex items-center space-x-4">
          <img src={profile.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${profile.username?.charAt(0) || '?'}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
          <SettingsInputField id="avatar" label="URL do Avatar" type="text" name="avatar" value={profile.avatar} onChange={handleProfileChange} />
        </div>
        <SettingsInputField id="username" label="Nome Completo" type="text" name="username" value={profile.username} onChange={handleProfileChange} />
        <SettingsInputField id="email-profile" label="Email" type="email" name="email" value={profile.email} onChange={() => {}} disabled={true}/> {/* Email não é editável aqui */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};


// ... (AppearanceSettings, SecuritySettings, NotificationSettings, SettingsComponent continuam iguais)
const AppearanceSettings = ({ darkMode, toggleDarkMode }) => (
  <div className="animate-fade-in">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Aparência</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">Personalize a aparência do sistema ao seu gosto.</p>
    <ToggleSwitch
      id="dark-mode-toggle"
      name="darkMode"
      label="Modo Escuro"
      description="Ative para uma experiência com menos brilho."
      checked={darkMode}
      onChange={toggleDarkMode}
    />
  </div>
);

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: ''});
  const handlePasswordChange = (e) => setPasswords({...passwords, [e.target.name]: e.target.value});
  const handlePasswordSave = (e) => {
    e.preventDefault();
    if(passwords.new !== passwords.confirm) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    // Lógica para reautenticar e atualizar senha (updatePassword)
    alert('Senha alterada com sucesso! (Simulação)');
  };
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Segurança da Conta</h3>
      <form onSubmit={handlePasswordSave} className="space-y-4">
        <SettingsInputField id="currentPassword" name="current" label="Senha Atual" type="password" value={passwords.current} onChange={handlePasswordChange} />
        <SettingsInputField id="newPassword" name="new" label="Nova Senha" type="password" value={passwords.new} onChange={handlePasswordChange} />
        <SettingsInputField id="confirmPassword" name="confirm" label="Confirmar Nova Senha" type="password" value={passwords.confirm} onChange={handlePasswordChange} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
  });
  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Preferências de Notificação</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Escolha como você deseja ser notificado sobre as atividades.</p>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <ToggleSwitch
          id="email-notifications"
          name="email"
          label="Notificações por E-mail"
          description="Receba resumos e alertas importantes no seu e-mail."
          checked={notifications.email}
          onChange={handleNotificationChange}
        />
        <ToggleSwitch
          id="in-app-notifications"
          name="inApp"
          label="Notificações na Plataforma"
          description="Mostra alertas dentro do sistema."
          checked={notifications.inApp}
          onChange={handleNotificationChange}
        />
      </div>
    </div>
  );
};

const SettingsComponent = ({ user, darkMode, toggleDarkMode }) => {
  const [activeSettingTab, setActiveSettingTab] = useState('perfil');
  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: 'user' },
    { id: 'aparencia', label: 'Aparência', icon: 'sun' },
    { id: 'seguranca', label: 'Segurança', icon: 'shieldCheck' },
    { id: 'notificacoes', label: 'Notificações', icon: 'bell' },
  ];

  const renderTabContent = () => {
    switch (activeSettingTab) {
      // Passa o user para ProfileSettings
      case 'perfil': return <ProfileSettings user={user} />;
      case 'aparencia': return <AppearanceSettings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'seguranca': return <SecuritySettings />;
      case 'notificacoes': return <NotificationSettings />;
      default: return null;
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Configurações</h2>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSettingTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg ${
              activeSettingTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent'
            }`}
          >
            <Icon name={tab.icon} className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

// ... (StaticPieChart, Dashboards específicos continuam iguais)
const StaticPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  const slices = data.map((item, i) => {
     if (total === 0) return null; // Evita divisão por zero
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
  }).filter(Boolean); // Remove nulls se total for 0

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

const DashboardVisitanteComponent = ({ searchQuery = '', activeTab }) => {
  const feriasData = [
    { name: 'Trabalhando', value: 1250, color: '#3b82f6' },
    { name: 'Em Férias', value: 85, color: '#f59e0b' },
    { name: 'Férias Previstas', value: 120, color: '#a855f7' },
  ];
  const filteredProcesses = useFilteredProcesses(searchQuery);

  const renderContent = () => {
    switch(activeTab) {
      case 'Início':
      case 'Dados Públicos':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dados Públicos - Hollides Report</h2>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  <Icon name="printer" className="w-4 h-4"/>
                  Gerar Relatório
                </button>
              </div>
              <StaticPieChart data={feriasData} />
            </div>
            <TabelaProcessosRecentes processes={filteredProcesses} />
          </div>
        );
      case 'Ferramentas':
        return <FerramentasComponent />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};

const DashboardServidorComponent = ({ searchQuery = '', activeTab }) => {
  const filteredProcesses = useFilteredProcesses(searchQuery);
  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
      case 'Meus Processos':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-r-lg">
              <p>Você pode visualizar e gerenciar os processos atribuídos a você. Para análises de resultados, consulte seu gestor.</p>
            </div>
            <TabelaProcessosRecentes processes={filteredProcesses} />
          </div>
        );
      case 'Ferramentas':
        return <FerramentasComponent />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};


const DashboardGestorComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const filteredProcesses = useFilteredProcesses(searchQuery);

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
    // Simulação de chamada à API
    setTimeout(() => {
      setSummary("✅ **Resumo Gerencial**\n\n- Total de processos: 1.204\n- 73.9% aprovados.\n- Principais gargalos: análise de processos pendentes (>48h).\n- **Ação recomendada**: priorizar análise dos 214 processos em análise.");
      setIsSummaryLoading(false);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return (
          <div className="space-y-8 animate-fade-in">
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
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Analisando dados e gerando insights...</span>
                </div>
              </div>
            )}
            {summaryError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"><p>{summaryError}</p></div>}
            {summary && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <Icon name="sparkles" className="w-5 h-5 mr-2 text-purple-600"/>
                  Resumo Inteligente
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Processos" value="1.204" icon="folderKanban" color="blue" />
              <StatCard title="Processos Aprovados" value="890" icon="shieldCheck" color="green" />
              <StatCard title="Em Análise" value="214" icon="clock" color="yellow" />
              <StatCard title="Taxa de Aprovação" value="73.9%" icon="pieChart" color="purple" />
            </div>
            <TabelaProcessosRecentes processes={filteredProcesses} />
          </div>
        );
      case 'Processos':
        return <TabelaProcessosRecentes processes={filteredProcesses} />;
      case 'Relatórios':
        return <PlaceholderComponent title="Relatórios" />;
      case 'Ferramentas':
        return <FerramentasComponent />;
      case 'Configurações':
         // Passa o user para SettingsComponent
        return <SettingsComponent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};


// --- COMPONENTE PRINCIPAL APP (ATUALIZADO PARA FIREBASE) ---
const App = () => {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null); // Armazena dados do Firestore (nome, role, avatar)
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Início');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Estado de loading

  // Listener do Firebase Auth para persistência
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário está logado no Firebase Auth
        // Busca os dados complementares no Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Define o estado 'user' com os dados combinados
          setUser({
            uid: firebaseUser.uid, // Guarda o UID para referência futura
            username: userData.fullName, // Nome completo do Firestore
            role: userData.role,       // Role do Firestore
            // Avatar pode vir do Firestore ou ser gerado
            avatar: userData.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${userData.fullName?.charAt(0) || '?'}`,
            email: firebaseUser.email // Email do Firebase Auth
          });
          setView('dashboard'); // Muda para a view do dashboard
        } else {
          // Caso estranho: usuário existe no Auth mas não no Firestore
          console.error("Usuário autenticado mas sem dados no Firestore:", firebaseUser.uid);
          await signOut(auth); // Desloga para evitar inconsistências
          setUser(null);
          setView('login');
        }
      } else {
        // Usuário está deslogado
        setUser(null);
        setView('login'); // Garante que volte para a tela de login
      }
      setIsLoadingAuth(false); // Marca que a verificação inicial terminou
    });

    // Função de limpeza para remover o listener quando o componente desmontar
    return () => unsubscribe();
  }, []); // Array vazio [] significa que este efeito roda apenas uma vez

  // Efeitos para Dark Mode (permanecem iguais)
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // handleLogin é chamado pelo LoginComponent, mas o estado principal
  // é gerenciado pelo onAuthStateChanged
  const handleLogin = (userInfo) => {
    // setUser(userInfo); // Não é mais necessário definir aqui, o listener faz isso
    setActiveTab('Início');
    setView('dashboard');
  };

  // handleLogout agora usa o signOut do Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O listener onAuthStateChanged vai automaticamente setar user para null e view para 'login'
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para renderizar o Dashboard correto baseado no 'role' do usuário
  const renderDashboard = () => {
    if (!user) return null; // Não renderiza nada se user for null

    let DashboardComponent;
    switch (user.role) {
      case 'Gestor': DashboardComponent = <DashboardGestorComponent />; break;
      case 'Servidor': DashboardComponent = <DashboardServidorComponent />; break;
      case 'Visitante': DashboardComponent = <DashboardVisitanteComponent />; break;
      default:
        // Fallback para caso o role não seja reconhecido (ou seja null/undefined)
        console.warn("Role de usuário não reconhecido:", user.role);
        DashboardComponent = <DashboardVisitanteComponent />; // Mostra como visitante por padrão
        break;
    }
    return (
      <DashboardLayout
        user={user} // Passa o objeto user completo
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
         {/* Passa as props necessárias para o componente filho */}
        {React.cloneElement(DashboardComponent, { user, darkMode, toggleDarkMode, activeTab })}
      </DashboardLayout>
    );
  };


  // Função para decidir qual componente de autenticação ou o dashboard renderizar
  const renderView = () => {
    switch (view) {
      case 'login': return <LoginComponent onViewChange={setView} onLogin={handleLogin} />;
      case 'register': return <RegisterComponent onViewChange={setView} />;
      case 'forgotPassword': return <ForgotPasswordComponent onViewChange={setView} />;
      case 'dashboard': return renderDashboard();
      default: return <LoginComponent onViewChange={setView} onLogin={handleLogin} />;
    }
  };

  // Mostra "Carregando..." enquanto o Firebase verifica o estado de autenticação
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    );
  }

  // Renderiza a view correta após a verificação
  return renderView();
};

export default App;
