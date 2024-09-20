"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Lock, Phone, GraduationCap } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Link from "next/link";
import NavLayout from "@/components/NavLayout";

export default function CreateStudent() {
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contact, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const currentUser = auth.currentUser;
    setLoading(true); // Set loading to true when starting

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const uid = newUser.uid;

      // Save the user data to Firestore
      await setDoc(doc(db, "users", uid), {
        studentId,
        fullName,
        email,
        birthday,
        contact,
        course,
        role: "student",
      });

      // Clear all input fields upon successful submission
      setStudentId("");
      setFullName("");
      setEmail("");
      setBirthday("");
      setPhone("");
      setCourse("");
      setPassword("");
      setConfirmPassword("");

      if (currentUser) {
        await auth.updateCurrentUser(currentUser);
      }

      // Navigate to admin/student page
      router.push("/admin/student");
    } catch (err) {
      alert("Error creating account: " + (err as Error).message);
    } finally {
      setLoading(false); // Set loading to false after the process completes
    }
  };

  return (
    <NavLayout>
      <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center p-4 bg-[url('/img/omsc.jpg')] ">
        <div className="w-1/2"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg flex"
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary text-center mb-4">
                OMSC Student Registration
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Student ID"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    aria-label="Student ID"
                  />
                </div>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    aria-label="Full Name"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="student@omsc.edu.ph"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email Address"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                    aria-label="Birth Date"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={contact}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    aria-label="Phone Number"
                  />
                </div>
                <div className="relative">
                  <GraduationCap className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Course/Program"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    aria-label="Course/Program"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-label="Confirm Password"
                  />
                </div>
                <div className="flex space-x-4">
                  <Link
                    href="/admin/student"
                    className="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </Link>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading} // Disable when loading
                    className={`flex-1 py-2 rounded-md transition duration-300 ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-primary text-white"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </motion.button>
                </div>
              </form>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-center text-gray-600">
                By registering, you agree to the OMSC{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </NavLayout>
  );
}
