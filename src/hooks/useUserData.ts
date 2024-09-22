import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { getAuth } from 'firebase/auth';

// Define the interface for user data
interface UserData {
  barangay?: string;
  birthdate?: string;
  city?: string;
  contact?: string;
  email?: string;
  extensionName?: string;
  firstName?: string;
  fullName?: string;
  homeAddress?: string;
  lastName?: string;
  middleName?: string;
  province?: string;
  role?: string;
  sex?: string;
  verified?: boolean;
  zipCode?: string;
  uid?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(); // Get the Auth instance
    const user = auth.currentUser; // Get the current user
    if (user) {
      setUid(user.uid); // Set the user ID
    }
  }, []);

  const fetchUserData = async () => {
    try {
      if (!uid) throw new Error('User ID is null'); // Check for null uid
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userDataWithUid = { ...userDoc.data(), uid } as UserData; // Add uid to userData
        setUserData(userDataWithUid);
      } else {
        setError('No user record found.');
      }
    } catch (err) {
      setError('Error fetching user data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUserData when uid changes
  useEffect(() => {
    if (uid) {
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return { userData, loading, error, uid };
}
