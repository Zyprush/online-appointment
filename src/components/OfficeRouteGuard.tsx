"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OfficeRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    // Check for office login data in localStorage
    const officeLoginData = localStorage.getItem("officeLoginData");

    if (!officeLoginData) {
      // Redirect to login if not authenticated
      router.push("/log-in/offices");
    } else {
      setLoading(false); // Set loading to false when office login data exists
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while checking authentication
  }

  return <>{children}</>; // Render children if authenticated
};

export default OfficeRouteGuard;
