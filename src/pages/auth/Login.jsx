import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField'; // 1. Importe o InputField

const LoginComponent = () => {
  const [username, setUsername] = useState(''); // E-MAIL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    const email = username; 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O AuthContext cuida do resto
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
        
        {/* 2. Use o Componente InputField */}
        <InputField
          id="username"
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isSubmitting}
        />
        
        {/* 3. Use o Componente InputField */}
        <InputField
          id="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-end text-sm">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')} 
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
          onClick={() => navigate('/register')}
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

export default LoginComponent;