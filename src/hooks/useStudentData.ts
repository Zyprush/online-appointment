import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

// Define the interface for student data
interface StudentData {
  birthday: string;
  course: string;
  email: string;
  fullName: string;
  phone: string;
  studentId: string;
}


export function useStudentData(uid: string) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    try {
      // Fetch student data from Firestore
      const studentDoc = await getDoc(doc(db, 'students', uid));
      if (studentDoc.exists()) {
        setStudentData(studentDoc.data() as StudentData);
      } else {
        setError('No student record found.');
      }
    } catch (err) {
      setError('Error fetching student data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchStudentData when uid changes
  useEffect(() => {  // Changed useState to useEffect
    if (uid) {
      fetchStudentData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return { studentData, loading, error };
}