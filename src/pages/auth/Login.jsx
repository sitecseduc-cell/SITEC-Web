import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Icon from '../../components/Icon';

// Recebe darkMode e toggleDarkMode via props do App.jsx
const LoginComponent = ({ darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      // ... (lógica de login permanece igual)
  };

  return (
    // Passa as props para o layout
    <AuthLayout 
        title="Bem-vindo de volta!" 
        description="Acesse sua conta SITEC" 
        icon="logIn" 
        iconColor="text-blue-600 bg-blue-100"
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
    >
      {/* ... (o resto do formulário permanece igual) ... */}
        <form onSubmit={handleLogin} className="space-y-5">
            {/* ... */}
        </form>
       {/* ... */}
    </AuthLayout>
  );
};

export default LoginComponent;
