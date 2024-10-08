// hooks/useOffice.ts

import { useState, useEffect } from 'react';

interface OfficeData {
  office: string;
  username: string;
  password: string;
}

export const useOffice = () => {
  const [officeData, setOfficeData] = useState<OfficeData | null>(null);

  useEffect(() => {
    const fetchOfficeData = () => {
      const storedData = localStorage.getItem('officeLoginData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as OfficeData;
          setOfficeData(parsedData);
        } catch (error) {
          console.error('Error parsing office data:', error);
          setOfficeData(null);
        }
      }
    };

    fetchOfficeData();
  }, []);

  return officeData;
};