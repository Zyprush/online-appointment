"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          console.log("userDoc.data()?.role", userDoc.data()?.role);
          // TODO: fix the logic here
          if (
            userDoc.data()?.role === "admin" ||
            userDoc.data()?.role === "student"
          ) {
            setIsLoading(false);
          } else {
            window.location.href = "/log-in";
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          window.location.href = "/log-in";
        }
      } else {
        window.location.href = "/log-in";
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    ); // You can replace this with a loading spinner or component
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
