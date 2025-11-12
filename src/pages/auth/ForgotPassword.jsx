import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importe
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebaseConfig'; // 2. Ajuste os caminhos
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';

// 3. Remova 'onViewChange' das props
const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate(); // 4. Inicialize

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Link de recuperação enviado! Verifique seu e-mail (e a caixa de spam).' });
      setEmail('');
    } catch (error) {
      setIsSubmitting(false);
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
          // 5. Use o navigate
          onClick={() => navigate('/login')}
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

export default ForgotPasswordComponent;
