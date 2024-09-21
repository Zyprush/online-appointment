// ResetPassword.tsx
"use client";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();

    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully.");
      setEmail(""); // Clear input after success
    } catch (error) {
      alert("Failed to send reset email. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Password Email"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
