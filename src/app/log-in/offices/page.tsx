"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Office {
  name: string;
  password: string;
  username: string;
}

const OfficesLogin = () => {
  const [officesData, setOfficesData] = useState<Office[]>([]); // Stores offices data from Firestore
  const [office, setOffice] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Initialize router

  // Fetch the offices data from Firestore
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const docRef = doc(db, "settings", "officesAccount");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOfficesData(data.officesAccount || []);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching offices data: ", err);
      }
    };

    fetchOffices();
  }, []);

  const handleLogin = () => {
    const officeData = officesData.find(
      (o) => o.name === office && o.username === username && o.password === password
    );

    if (officeData) {
      // Save to localStorage
      localStorage.setItem(
        "officeLoginData",
        JSON.stringify({ office: officeData.name, username: officeData.username, password: officeData.password })
      );

      setError(null);
      setSuccess("Login successful!");
      setLoading(false);
      
      // Navigate to the dashboard after successful login
      router.push("/staff/dashboard");
    } else {
      setError("Incorrect office, username, or password. Please try again.");
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full overflow-scroll fixed top-0 bottom-0 right-0 left-0 p-5 bg-[url('/img/omsc.jpg')] bg-cover bg-center">
      <div className="w-2/3 h-full"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 max-w-md"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Office Login</h2>
            <p className="text-sm text-center text-gray-600 mb-8">Sign in to access your office account</p>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-500 text-center">{success}</div>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                handleLogin();
              }}
              className="space-y-6"
            >
              <div className="relative">
                <label htmlFor="office" className="block mb-1 font-semibold">
                  Office
                </label>
                <select
                  id="office"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select an office</option>
                  {officesData.map((office, index) => (
                    <option key={index} value={office.name}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label htmlFor="username" className="block mb-1 font-semibold">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  aria-label="Username"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block mb-1 font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  aria-label="Password"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full ${loading ? "bg-gray-400" : "bg-primary"} text-white py-2 rounded-md transition duration-300`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              By using this service, you agree to the OMSC Online Services{" "}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 hover:underline">
                Privacy Statement
              </a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OfficesLogin;
