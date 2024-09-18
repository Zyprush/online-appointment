"use client"
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'; // Removed useRouter
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ClientRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const router = useRouter(); // Removed router
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/log-in'; // Changed to use window.location
      } else {
        setLoading(false); // Set loading to false when user is authenticated
      }
    });

    return () => unsubscribe();
  }, []); // Removed router dependency

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  return <>{children}</>;
};

export default ClientRouteGuard;