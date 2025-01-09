"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DirectorRouteGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    // Check for office login data in localStorage
    const officeLoginData = localStorage.getItem("officeLoginData");
    // Parse the localStorage data
    const storedLoginData = officeLoginData
      ? JSON.parse(officeLoginData)
      : null;
    if (!storedLoginData || storedLoginData.office !== "Campus Director") {
      // Redirect to login if not authenticated
      router.push("/log-in/offices");
    } else {
      setLoading(false); // Set loading to false when office login data exists
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center gap-2 items-center w-screen h-screen text-primary">
        <span className="loading loading-spinner loading-xs"></span>Loading...
      </div>
    ); // Display loading message while checking authentication
  }

  return <>{children}</>; // Render children if authenticated
};

export default DirectorRouteGuard;
