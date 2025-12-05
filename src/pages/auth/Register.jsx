import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebaseConfig';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Icon from '../../components/Icon';

const RegisterComponent = ({ darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    registration: '',
    email: '',
    password: '',
    confirmPassword: '',
    sector: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const sectors = ["TI", "Recursos Humanos", "Financeiro", "Administrativo", "Pedagógico"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        registration: formData.registration,
        email: formData.email,
        sector: formData.sector,
        role: 'Analista'
      });

      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Conta criada com sucesso! Redirecionando...' });
      
      setTimeout(() => navigate('/login'), 2000); 

    } catch (error) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está em uso.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar conta. Tente novamente.' });
      }
    }
  };

  return (
    <AuthLayout 
      title="Criar Conta" 
      description="Junte-se à plataforma SITEC" 
      icon="userPlus" 
      iconColor="text-green-600 bg-green-100"
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {message.text && (
          <div role="alert" className={`border-l-4 p-4 rounded-md text-sm flex items-center gap-2 ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
              : 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            <Icon name={message.type === 'error' ? 'x' : 'shieldCheck'} className="w-4 h-4" />
            <p>{message.text}</p>
          </div>
        )}
        
        <InputField id="fullName" name="fullName" label="Nome Completo" type="text" value={formData.fullName} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="registration" name="registration" label="Matrícula" type="text" value={formData.registration} onChange={handleChange} disabled={isSubmitting} required />
        
        <SelectField id="sector" name="sector" label="Setor" value={formData.sector} onChange={handleChange} disabled={isSubmitting} required>
          <option value="">Selecione seu setor</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>

        <InputField id="email" name="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} required />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField id="password" name="password" label="Senha" type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} required />
            <InputField id="confirmPassword" name="confirmPassword" label="Confirmar" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} required />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-green-500/30 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-2"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            type="button"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            disabled={isSubmitting}
          >
            Faça login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterComponent;
