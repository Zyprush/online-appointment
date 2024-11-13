"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";

const ClientRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // To track email sending state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = "/log-in";
      } else {
        // Check if the user's email is verified
        setIsEmailVerified(user.emailVerified);
        setLoading(false); // Set loading to false after checking email verification
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
      setEmailSent(true); // Show feedback after sending email
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-2 items-center w-screen h-screen text-primary">
        <span className="loading loading-spinner loading-xs"></span>Loading...
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen text-primary">
        <p>Your email is not verified. Please verify your email to continue.</p>
        <button
          onClick={handleSendVerification}
          className="btn btn-primary mt-4"
          disabled={emailSent}
        >
          {emailSent ? "Verification Email Sent to your email, refresh this page after the confirming your email" : "Send Verification Email"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ClientRouteGuard;
