import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Verifique o caminho

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor (Componente que vai envolver o App)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Esta é a sua lógica que estava no App.jsx
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listener para dados do usuário em tempo real
        const unsubDoc = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              username: userData.fullName,
              role: userData.role,
              sector: userData.sector,
              avatar: userData.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${userData.fullName?.charAt(0) || '?'}`,
              email: firebaseUser.email
            });
          } else {
            console.error("Usuário autenticado mas sem dados no Firestore.");
            firebaseSignOut(auth);
          }
          setIsLoadingAuth(false);
        });

        return () => unsubDoc(); // Limpa o listener do documento
      } else {
        setUser(null);
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe(); // Limpa o listener da autenticação
  }, []);

  // O 'value' é o que será compartilhado com todos os componentes filhos
  const value = {
    user,
    isLoadingAuth,
    // Você pode adicionar 'login', 'logout', 'register' aqui se quiser
  };

  // Não renderiza nada até que a autenticação seja verificada
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Criar o Hook (Forma fácil de consumir o contexto)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};