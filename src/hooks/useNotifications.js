import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Ajuste o caminho se necessário
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy
} from "firebase/firestore";

// Cole o hook useNotifications que estava no App.jsx
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

export default useNotifications;