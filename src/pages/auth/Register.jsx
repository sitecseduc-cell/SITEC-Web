import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importe
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebaseConfig'; // 2. Ajuste os caminhos
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';

// 3. Remova 'onViewChange' das props
const RegisterComponent = () => {
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
  
  const navigate = useNavigate(); // 4. Inicialize

  const sectors = ["TI", "Recursos Humanos", "Financeiro", "Administrativo", "Pedagógico"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (lógica de validação) ...
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    // ...
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
      setMessage({ type: 'success', text: 'Conta criada com sucesso! Você será redirecionado para o login.' });
      
      // 5. Use o navigate
      setTimeout(() => navigate('/login'), 2000); 

    } catch (error) {
      // ... (lógica de erro) ...
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está em uso.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar conta. Tente novamente.' });
      }
    }
  };

  return (
    <AuthLayout title="Cadastre-se" description="Crie sua conta na Plataforma" icon="userPlus" iconColor="text-green-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (renderização do formulário) ... */}
        {message.text && (
          <div role="alert" className={`${message.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
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
          // 6. Use o navigate
          onClick={() => navigate('/login')}
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

export default RegisterComponent;
