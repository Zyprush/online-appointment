"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

interface StudentRouteGuardProps {
  children: React.ReactNode;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && (userDoc.data().role === 'student' || userDoc.data().role === 'alumni') ) {
            setIsLoading(false);
          } else {
            window.location.href = '/log-in';
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          window.location.href = '/log-in';
        }
      } else {
        window.location.href = '/log-in';
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className='h-screen w-screen flex justify-center items-center'>Loading...</div>;
  }

  return <>{children}</>;
};

export default StudentRouteGuard;