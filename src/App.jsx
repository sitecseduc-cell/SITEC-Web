// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
// Importações do Headless UI para Modals
import { Dialog, Transition } from '@headlessui/react'; // Removido 'Menu' que não estava sendo usado

// --- IMPORTAÇÕES DO FIREBASE (ATUALIZADO) ---
import { auth, db } from '../firebaseConfig.js'; // Precisa da extensão .js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail // Adicionado
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  onSnapshot,
  addDoc,   // Adicionado
  updateDoc, // Adicionado
  where,     // Adicionado
  Timestamp, // Adicionado
  serverTimestamp, // Adicionado
  orderBy // Adicionado
} from "firebase/firestore";

// --- ÍCONES SVG COMO COMPONENTES ---
// (Componente Icon permanece o mesmo, mas adicionei novos ícones)
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
    plus: <path d="M5 12h14m-7 7V5"/>,
    edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>,
    lifeBuoy: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" x2="9.17" y1="4.93" y2="9.17"/><line x1="14.83" x2="19.07" y1="9.17" y2="4.93"/><line x1="14.83" x2="19.07" y1="14.83" y2="19.07"/><line x1="4.93" x2="9.17" y1="19.07" y2="14.83"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

// --- HOOK DE FILTRAGEM (permanece o mesmo) ---
const useFilteredProcesses = (searchQuery, processes) => {
  return useMemo(() => {
    if (!searchQuery) return processes;
    const lowercasedQuery = searchQuery.toLowerCase();
    return processes.filter(p =>
      (p.id && p.id.toLowerCase().includes(lowercasedQuery)) ||
      (p.solicitante && p.solicitante.toLowerCase().includes(lowercasedQuery)) ||
      (p.status && p.status.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, processes]);
};

// --- HOOK DE NOTIFICAÇÕES (NOVO) ---
const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Query para notificações destinadas ao usuário, ordenadas por data
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let unread = 0;
      const notifs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          unread++;
        }
        notifs.push({ id: doc.id, ...data });
      });
      setNotifications(notifs);
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [userId]);

  return { notifications, unreadCount };
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

const InputField = ({ id, label, type, value, onChange, disabled, required, placeholder, name }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      id={id}
      name={name || id} // Garante que o 'name' seja passado para o onChange
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

// --- SelectField (NOVO COMPONENTE) ---
const SelectField = ({ id, label, value, onChange, disabled, required, children, name }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      id={id}
      name={name || id}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    >
      {children}
    </select>
  </div>
);

// --- LoginComponent (Sem mudanças) ---
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // O onAuthStateChanged vai cuidar da transição de tela
    } catch (error) {
      setMessage('E-mail ou senha inválidos.');
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
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
          <input
            id="username"
            type="email"
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

// --- RegisterComponent (ATUALIZADO COM CAMPO SETOR) ---
const RegisterComponent = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    registration: '',
    email: '',
    password: '',
    confirmPassword: '',
    sector: '', // --- NOVO CAMPO ---
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de setores (você pode carregar isso do Firestore futuramente)
  const sectors = ["TI", "Recursos Humanos", "Financeiro", "Administrativo", "Pedagógico"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }
    if (!formData.sector) {
      setMessage({ type: 'error', text: 'Por favor, selecione um setor.' });
      return;
    }
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Salva os dados extras no Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        registration: formData.registration,
        email: formData.email,
        sector: formData.sector, // --- SALVA O SETOR ---
        role: 'Analista' // --- NOVO PADRÃO "Analista" ---
      });

      // Sucesso
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Conta criada com sucesso! Você será redirecionado para o login.' });
      setTimeout(() => onViewChange('login'), 2000);

    } catch (error) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está em uso.' });
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
        <InputField id="fullName" name="fullName" label="Nome Completo" type="text" value={formData.fullName} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="registration" name="registration" label="Matrícula" type="text" value={formData.registration} onChange={handleChange} disabled={isSubmitting} required />
        
        {/* --- NOVO CAMPO DE SETOR --- */}
        <SelectField
          id="sector"
          name="sector"
          label="Setor"
          value={formData.sector}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        >
          <option value="">Selecione seu setor</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>

        <InputField id="email" name="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="password" name="password" label="Senha (mín. 6 caracteres)" type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="confirmPassword" name="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} required />
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

// --- ForgotPasswordComponent (ATUALIZADO COM FIREBASE) ---
const ForgotPasswordComponent = ({ onViewChange }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => { // TORNADO ASYNC
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // --- LÓGICA REAL DO FIREBASE ---
      await sendPasswordResetEmail(auth, email);
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Link de recuperação enviado! Verifique seu e-mail (e a caixa de spam).' });
      setEmail('');
    } catch (error) {
      setIsSubmitting(false);
      // Não informa se o e-mail não existe por segurança
      setMessage({ type: 'success', text: 'Se um e-mail correspondente for encontrado, um link de recuperação será enviado.' });
      console.error("Erro ao enviar email de recuperação:", error);
    }
  };

  return (
    <AuthLayout title="Recuperar Senha" description="Insira seu e-mail para receber o link" icon="keyRound" iconColor="text-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div role="alert" className={`${message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
            <p>{message.text}</p>
          </div>
        )}
        <InputField
          id="email"
          label="Email Cadastrado"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="seu.email@exemplo.com"
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


// --- Componentes do Dashboard ---
// --- ATUALIZADO: Sidebar (perfis renomeados e menu do analista) ---
const Sidebar = ({ user, onLogout, activeTab, onTabChange, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const navItems = {
    'Gestor': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Processos' }, { icon: 'pieChart', label: 'Relatórios' }, { icon: 'briefcase', label: 'Ferramentas' }, { icon: 'settings', label: 'Configurações' } ],
    // 'Servidor' -> 'Analista' e adicionado 'Configurações'
    'Analista': [ { icon: 'home', label: 'Início' }, { icon: 'folderKanban', label: 'Meus Processos' }, { icon: 'briefcase', label: 'Ferramentas' }, { icon: 'settings', label: 'Configurações' } ],
    // 'Visitante' -> 'Suporte' e menus atualizados
    'Suporte': [ { icon: 'lifeBuoy', label: 'Tickets' }, { icon: 'users', label: 'Usuários' }, { icon: 'briefcase', label: 'Ferramentas' } ],
  };
   
  // Fallback caso o role não seja encontrado
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
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role} ({user.sector})</p> {/* Mostra o setor */}
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
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          {/* Sidebar */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
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
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

// --- ATUALIZADO: Header (Notificações dinâmicas) ---
const Header = ({ user, darkMode, toggleDarkMode, searchQuery, setSearchQuery, setIsMobileSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const { notifications, unreadCount } = useNotifications(user?.uid); // <-- HOOK DE NOTIFICAÇÕES
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

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
        
        {/* Botão de Notificação Atualizado */}
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
          
          {/* Painel de Notificações (NOVO) */}
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

// --- NOVO: NotificationPanel ---
const NotificationPanel = ({ isOpen, setIsOpen, notifications, user }) => {
  
  const markAsRead = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };
  
  // TODO: Criar Modal para enviar mensagem
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


// --- ATUALIZADO: DashboardLayout (com max-w-7xl) ---
const DashboardLayout = ({ user, onLogout, darkMode, toggleDarkMode, children, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          {/* --- MUDANÇA: Adicionado container para harmonia do layout --- */}
          <div className="max-w-7xl mx-auto" id="printable-area">
            {React.Children.map(children, child =>
              React.cloneElement(child, { searchQuery, activeTab, user, darkMode, toggleDarkMode })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ATUALIZADO: TabelaProcessosRecentes (Com coluna "Ações") ---
const TabelaProcessosRecentes = ({ processes, onEditProcess, userRole }) => {
  const headerItems = ["ID", "Solicitante", "Status", "Data", "Setor"];
  
  // Adiciona "Ações" se for Gestor ou Analista
  if (userRole === 'Gestor' || userRole === 'Analista') {
    headerItems.push("Ações");
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Consulta de Processos</h2>
        {/* O botão de "Registrar" será movido para o Dashboard do Analista */}
      </div>
      
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{process.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.solicitante}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClass(process.status)}>{process.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.dataSubmissao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.sector}</td>
                  
                  {/* --- NOVA COLUNA DE AÇÕES --- */}
                  {(userRole === 'Gestor' || userRole === 'Analista') && (
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <button 
                         onClick={() => onEditProcess(process)}
                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                       >
                         <Icon name="edit" className="w-4 h-4" />
                         Alterar
                       </button>
                     </td>
                  )}
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

// --- ATUALIZADO: FerramentasComponent (com botão de Contato) ---
const FerramentasComponent = ({ onContactSupport }) => {
  const tools = [
    { name: "Hollides", description: "Analisador de férias para otimizar o planejamento da equipe.", icon: "calendarDays", color: "orange", link: "https://hollides.vercel.app/" },
    { name: "Reader", description: "Leitor de documentos PDF integrado à plataforma.", icon: "fileText", color: "red", link: "https://reader-tau-azure.vercel.app/" },
    { name: "Ticker", description: "Relógio de ponto digital para registro de jornada de trabalho.", icon: "clock", color: "green", link: "https://ticker-ccm.vercel.app/" },
  ];

  const colorClasses = {
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', button: 'bg-orange-600 hover:bg-orange-700' },
    red: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', button: 'bg-red-600 hover:bg-red-700' },
    green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', button: 'bg-green-600 hover:bg-green-700' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400', button: 'bg-blue-600 hover:bg-blue-700' },
  };

  const ToolCard = ({ tool }) => {
    const classes = colorClasses[tool.color] || colorClasses.orange;
    
    // Se for um link externo
    if (tool.link) {
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
    }
    
    // Se for uma ação interna (como "Contatar Suporte")
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
        <div className={`p-4 rounded-full ${classes.bg} mb-4`}>
          <Icon name={tool.icon} className={`h-8 w-8 ${classes.text}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{tool.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow">{tool.description}</p>
        <button
          onClick={tool.action}
          className={`w-full block mt-auto px-4 py-2 text-sm font-medium text-white ${classes.button} rounded-lg transition`}
        >
          Abrir Solicitação
        </button>
      </div>
    );
  };

  // Adiciona o card de Suporte
  const allTools = [
    ...tools,
    { 
      name: "Contatar Suporte", 
      description: "Precisa de ajuda? Abra um ticket para nossa equipe de suporte.", 
      icon: "helpCircle", 
      color: "blue", 
      action: onContactSupport // Ação passada por props
    }
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Central de Ferramentas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allTools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
      </div>
    </div>
  );
};

// --- Componentes de Configurações (Settings) ---
// (ProfileSettings, AppearanceSettings, SecuritySettings, NotificationSettings, SettingsComponent)
// ... (Permanecem os mesmos, mas ProfileSettings agora recebe 'user' e 'auth' corretamente)

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
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '', // Pega email do objeto user
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if(user) {
      setProfile({
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return; 

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { // updateDoc é mais seguro que setDoc com merge
        fullName: profile.username,
        avatar: profile.avatar,
      });

      // TODO: Atualizar o display name no Firebase Auth (opcional)
      // await updateProfile(auth.currentUser, { displayName: profile.username, photoURL: profile.avatar });

      alert('Perfil salvo com sucesso!');
      // O estado 'user' global será atualizado pelo listener do App
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
        <SettingsInputField id="email-profile" label="Email" type="email" name="email" value={profile.email} onChange={() => {}} disabled={true}/>
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

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
  // ... (componente permanece o mesmo) ...
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: ''});
  const handlePasswordChange = (e) => setPasswords({...passwords, [e.target.name]: e.target.value});
  const handlePasswordSave = (e) => {
    e.preventDefault();
    if(passwords.new !== passwords.confirm) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    // TODO: Adicionar lógica real do Firebase (Reauthentication e updatePassword)
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
  // ... (componente permanece o mesmo) ...
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
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSettingTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg ${
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


const StaticPieChart = ({ data }) => {
  // ... (componente permanece o mesmo) ...
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

// --- DASHBOARDS ---

// --- NOVO: DashboardSuporteComponent (antigo Visitante) ---
const DashboardSuporteComponent = ({ user, searchQuery = '', activeTab, processes, onContactSupport }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  // Hook para carregar tickets de suporte
  useEffect(() => {
    const q = query(collection(db, "supportTickets"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);
  
  // Hook para carregar usuários (apenas para o Suporte)
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'Tickets':
        return <SupportTicketsView tickets={tickets} />;
      case 'Usuários':
        return <UsersView users={users} />;
      case 'Ferramentas':
        return <FerramentasComponent onContactSupport={onContactSupport} />;
      default:
        return <SupportTicketsView tickets={tickets} />;
    }
  };
  return <>{renderContent()}</>;
};

// --- NOVO: Componente de Suporte (Tickets) ---
const SupportTicketsView = ({ tickets }) => {
  const getTicketStatusClass = (status) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case 'Aberto': return `${baseClasses} bg-red-100 text-red-800`;
      case 'Em Andamento': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Fechado': return `${baseClasses} bg-green-100 text-green-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  
  const handleTicketStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, "supportTickets", id), { status: newStatus });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tickets de Suporte</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mensagem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ticket.fromName}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{ticket.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={getTicketStatusClass(ticket.status)}>{ticket.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {ticket.status !== 'Fechado' && (
                    <button onClick={() => handleTicketStatusChange(ticket.id, 'Fechado')} className="text-red-600 hover:text-red-900">
                      Fechar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- NOVO: Componente de Suporte (Usuários) ---
const UsersView = ({ users }) => {
  const handleRoleChange = async (id, newRole) => {
    if (window.confirm(`Tem certeza que deseja alterar o perfil deste usuário para ${newRole}?`)) {
      await updateDoc(doc(db, "users", id), { role: newRole });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Gerenciamento de Usuários</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Setor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Perfil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.sector}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.role !== 'Gestor' && <button onClick={() => handleRoleChange(user.id, 'Gestor')} className="text-blue-600 hover:text-blue-900">Tornar Gestor</button>}
                  {user.role !== 'Analista' && <button onClick={() => handleRoleChange(user.id, 'Analista')} className="text-green-600 hover:text-green-900">Tornar Analista</button>}
                  {user.role !== 'Suporte' && <button onClick={() => handleRoleChange(user.id, 'Suporte')} className="text-yellow-600 hover:text-yellow-900">Tornar Suporte</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- ATUALIZADO: DashboardAnalistaComponent (antigo Servidor) ---
const DashboardAnalistaComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode, processes, onContactSupport, onEditProcess }) => {
  const filteredProcesses = useFilteredProcesses(searchQuery, processes);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return <AnalystHomeComponent />; // --- NOVA TELA DE INÍCIO ---
      case 'Meus Processos':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => onEditProcess(null)} // Passa null para indicar "novo processo"
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

// --- NOVO: AnalystHomeComponent (para a aba "Início" do Analista) ---
const AnalystHomeComponent = () => {
  const faqs = [
    { q: "Como registro um novo processo?", a: "Vá para a aba 'Meus Processos' e clique no botão 'Registrar Novo Processo'. Preencha todos os campos e salve." },
    { q: "Como altero o status de um processo?", a: "Vá para 'Meus Processos', encontre o processo na lista e clique em 'Alterar'. Você poderá modificar o status no modal que se abrirá." },
    { q: "Onde vejo as ferramentas?", a: "Clique na aba 'Ferramentas' no menu lateral para acessar o Hollides, Reader, Ticker e o contato de suporte." },
  ];
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Sobre */}
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

      {/* Notificações (Simulado - o real está no sino) */}
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

      {/* FAQ */}
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


// --- ATUALIZADO: DashboardGestorComponent ---
const DashboardGestorComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode, processes, onContactSupport, onEditProcess }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const filteredProcesses = useFilteredProcesses(searchQuery, processes);

  // Calcula estatísticas reais baseadas nos processos carregados
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

  const StatCard = ({ title, value, icon, color }) => {
    // ... (componente StatCard permanece o mesmo) ...
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
    // Simulação de chamada à API (agora usa dados reais)
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


// --- COMPONENTE PRINCIPAL APP (ATUALIZADO COM NOVOS STATES E HANDLERS) ---
const App = () => {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);
  // ATUALIZADO: Aba padrão muda para o perfil de Suporte
  const [activeTab, setActiveTab] = useState('Tickets'); 
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [processes, setProcesses] = useState([]); 
  
  // --- NOVOS STATES PARA MODAIS ---
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null); // Para edição

  // Listener do Firebase Auth (ATUALIZADO para pegar 'setor')
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        // Ouve mudanças no documento do usuário em tempo real
        const unsubDoc = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              username: userData.fullName,
              role: userData.role,
              sector: userData.sector, // --- CAMPO SETOR ADICIONADO ---
              avatar: userData.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${userData.fullName?.charAt(0) || '?'}`,
              email: firebaseUser.email
            });
            // Define a aba padrão baseada no role
            setActiveTab(getDefaultTabForRole(userData.role));
            setView('dashboard');
          } else {
            console.error("Usuário autenticado mas sem dados no Firestore:", firebaseUser.uid);
            signOut(auth);
          }
        });
        setIsLoadingAuth(false);
        return () => unsubDoc(); // Limpa o listener do documento
        
      } else {
        setUser(null);
        setView('login');
        setIsLoadingAuth(false);
      }
    });
    return () => unsubscribe(); // Limpa o listener da autenticação
  }, []);

  // Efeitos para Dark Mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // --- ATUALIZADO: useEffect para carregar processos (agora filtra por setor) ---
  useEffect(() => {
    if (user) {
      let q;
      // Gestor e Suporte veem todos os processos
      if (user.role === 'Gestor' || user.role === 'Suporte') {
        q = query(collection(db, "processes"), orderBy("dataSubmissao", "desc"));
      } 
      // Analista vê apenas os processos do seu setor
      else if (user.role === 'Analista') {
        q = query(
          collection(db, "processes"), 
          where("sector", "==", user.sector),
          orderBy("dataSubmissao", "desc")
        );
      } else {
        // Se for um role desconhecido, não carrega nada
        setProcesses([]);
        return;
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const processesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dataSubmissao = (data.dataSubmissao && data.dataSubmissao.toDate)
            ? data.dataSubmissao.toDate().toLocaleDateString('pt-BR') // Formato BR
            : 'Data Inválida'; 
          
          processesData.push({ 
            id: doc.id, 
            ...data,
            dataSubmissao: dataSubmissao 
          });
        });
        setProcesses(processesData);
      });

      return () => unsubscribe();
    } else {
      setProcesses([]);
    }
  }, [user]); // Depende do 'user'

  // Define a aba padrão ao logar
  const getDefaultTabForRole = (role) => {
    switch(role) {
      case 'Gestor': return 'Início';
      case 'Analista': return 'Início';
      case 'Suporte': return 'Tickets';
      default: return 'Início';
    }
  };
  
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('Login'); // Reseta a aba
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  
  // --- NOVOS HANDLERS PARA MODAIS ---
  
  // Abre o modal de processo (null = novo, objeto = editar)
  const handleEditProcess = (process) => {
    setCurrentProcess(process);
    setIsProcessModalOpen(true);
  };
  
  // Abre o modal de contato com o suporte
  const handleContactSupport = () => {
    setIsSupportModalOpen(true);
  };

  // Função para renderizar o Dashboard correto
  const renderDashboard = () => {
    if (!user) return null;

    let DashboardComponent;
    switch (user.role) {
      case 'Gestor': DashboardComponent = <DashboardGestorComponent />; break;
      case 'Analista': DashboardComponent = <DashboardAnalistaComponent />; break;
      case 'Suporte': DashboardComponent = <DashboardSuporteComponent />; break;
      default:
        console.warn("Role de usuário não reconhecido:", user.role);
        DashboardComponent = <DashboardSuporteComponent />; // Fallback
        break;
    }
    return (
      <DashboardLayout
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {React.cloneElement(DashboardComponent, { 
          user, 
          darkMode, 
          toggleDarkMode, 
          activeTab,
          processes,
          onContactSupport: handleContactSupport, // Passa a função para abrir o modal
          onEditProcess: handleEditProcess // Passa a função para abrir o modal
        })}
      </DashboardLayout>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'login': return <LoginComponent onViewChange={setView} onLogin={() => {}} />;
      case 'register': return <RegisterComponent onViewChange={setView} />;
      case 'forgotPassword': return <ForgotPasswordComponent onViewChange={setView} />;
      case 'dashboard': return renderDashboard();
      default: return <LoginComponent onViewChange={setView} onLogin={() => {}} />;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      {renderView()}
      
      {/* Modais Globais */}
      <ProcessModal
        isOpen={isProcessModalOpen}
        setIsOpen={setIsProcessModalOpen}
        process={currentProcess}
        user={user}
      />
      <SupportModal
        isOpen={isSupportModalOpen}
        setIsOpen={setIsSupportModalOpen}
        user={user}
      />
    </>
  );
};

// --- NOVO: ProcessModal (Para registrar e alterar processos) ---
const ProcessModal = ({ isOpen, setIsOpen, process, user }) => {
  const [formData, setFormData] = useState({
    solicitante: '',
    status: 'Pendente',
    descricao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = process !== null;
  const statusOptions = ["Pendente", "Em Análise", "Aprovado", "Rejeitado"];

  useEffect(() => {
    if (isEditing) {
      setFormData({
        solicitante: process.solicitante || '',
        status: process.status || 'Pendente',
        descricao: process.descricao || ''
      });
    } else {
      // Reset para novo processo
      setFormData({
        solicitante: '',
        status: 'Pendente',
        descricao: ''
      });
    }
  }, [process, isOpen]); // Roda quando o modal abre ou o processo muda

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    // Cria o log de auditoria
    const auditEntry = {
      action: isEditing ? "Alteração de Status" : "Criação de Processo",
      status: formData.status,
      user: user.username,
      userId: user.uid,
      timestamp: Timestamp.now()
    };
    
    try {
      if (isEditing) {
        // --- ALTERA PROCESSO ---
        const processRef = doc(db, "processes", process.id);
        const existingLogs = process.auditLog || [];
        await updateDoc(processRef, {
          ...formData,
          auditLog: [...existingLogs, auditEntry] // Adiciona novo log
        });
      } else {
        // --- CRIA NOVO PROCESSO ---
        await addDoc(collection(db, "processes"), {
          ...formData,
          analystId: user.uid,
          analystName: user.username,
          sector: user.sector,
          dataSubmissao: Timestamp.now(),
          auditLog: [auditEntry] // Inicia o log
        });
      }
      setIsSubmitting(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar processo:", error);
      setIsSubmitting(false);
      alert("Erro ao salvar processo.");
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                  {isEditing ? 'Alterar Processo' : 'Registrar Novo Processo'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <InputField
                    id="solicitante"
                    name="solicitante"
                    label="Nome do Solicitante"
                    type="text"
                    value={formData.solicitante}
                    onChange={handleChange}
                    required
                  />
                  <SelectField
                    id="status"
                    name="status"
                    label="Status do Processo"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </SelectField>
                  <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição/Observações</label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      rows="4"
                      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// --- NOVO: SupportModal (Para contatar o suporte) ---
const SupportModal = ({ isOpen, setIsOpen, user }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !message) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "supportTickets"), {
        message: message,
        fromId: user.uid,
        fromName: user.username,
        fromSector: user.sector,
        status: "Aberto",
        timestamp: serverTimestamp()
      });
      setIsSubmitting(false);
      setMessage('');
      setIsOpen(false);
      alert('Ticket de suporte enviado com sucesso!');
    } catch (error) {
      console.error("Erro ao enviar ticket:", error);
      setIsSubmitting(false);
      alert('Erro ao enviar ticket. Tente novamente.');
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                  Contatar Suporte
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Descreva seu problema, solicitação ou feedback. Nossa equipe de suporte (Perfil: Suporte) receberá sua mensagem.
                  </p>
                  <div>
                    <label htmlFor="support-message" className="sr-only">Sua Mensagem</label>
                    <textarea
                      id="support-message"
                      name="message"
                      rows="5"
                      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem aqui..."
                      required
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};


export default App;
