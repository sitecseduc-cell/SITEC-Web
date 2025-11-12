import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Ajuste o caminho se necessário
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

const useProcesses = (user) => {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProcesses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let q;
    
    // Lógica de query que estava no App.jsx
    if (user.role === 'Gestor' || user.role === 'Suporte') {
      q = query(collection(db, "processes"), orderBy("dataSubmissao", "desc"));
    } 
    else if (user.role === 'Analista') {
      q = query(
        collection(db, "processes"), 
        where("sector", "==", user.sector),
        orderBy("dataSubmissao", "desc")
      );
    } else {
      setProcesses([]);
      setIsLoading(false);
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
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]); // Depende do 'user'

  return { processes, isLoading };
};

export default useProcesses;