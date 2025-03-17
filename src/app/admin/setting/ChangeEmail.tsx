// ChangeEmail.tsx
"use client";
import { useState } from "react";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updateEmail, sendEmailVerification } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const ChangeEmail = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !currentEmail || !newEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (currentEmail === newEmail) {
      setError("New email must be different from the current email.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(currentEmail, password);
      await reauthenticateWithCredential(user, credential);

      // Temporarily update the email (Firebase will send a verification email)
      await updateEmail(user, newEmail);

      // Send a verification email to the new email address
      await sendEmailVerification(user);

      alert("A verification email has been sent to your new email address. Please verify it to complete the email change process.");
      setCurrentEmail("");
      setNewEmail("");
      setPassword("");
    } catch (error: unknown) {
      console.error("Error updating email:", error);
      if (error instanceof FirebaseError) {
        setError(error.message || "Failed to update email. Please check your credentials and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <h2 className="text-lg font-semibold mb-4">Change Email</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleChangeEmail} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Current email"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="email"
          placeholder="New email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Change Email"}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmail;