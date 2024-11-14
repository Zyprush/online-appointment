"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
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
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
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
      (o) =>
        o.name === office && o.username === username && o.password === password
    );

    if (officeData) {
      // Save to localStorage
      localStorage.setItem(
        "officeLoginData",
        JSON.stringify({
          office: officeData.name,
          username: officeData.username,
          password: officeData.password,
        })
      );

      setError(null);
      setSuccess("Login successful!");
      setLoading(false);

      // Navigate to the dashboard after successful login
      router.push("/office/appointment");
    } else {
      setError("Incorrect office, username, or password. Please try again.");
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full overflow-scroll fixed top-0 bottom-0 right-0 left-0 p-5 bg-[url('/img/omsc.jpg')] bg-cover bg-center sm:p-10 md:p-20">
      <div className="hidden lg:block w-2/3 h-full"></div>
      <div className="w-full max-w-sm sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 py-7 md:px-5">
              <h2 className="text-2xl font-bold text-center text-primary   mb-1 sm:mb-2 md:mb-3">
                Office Login
              </h2>
              <p className="text-sm text-center text-gray-600 mb-8 sm:mb-10 md:mb-12">
                Sign in to access your office account
              </p>
              {error && <div className="text-red-500 text-center">{error}</div>}
              {success && (
                <div className="text-green-500 text-center">{success}</div>
              )}
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
                  <label
                    htmlFor="username"
                    className="block mb-1 font-semibold"
                  >
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
                  <label
                    htmlFor="password"
                    className="block mb-1 font-semibold"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-1 flex items-end pb-3"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex gap-4 w-full">
                  <Link
                    className="flex-1 text-center bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition duration-300 w-1/2"
                    href={"/log-in"}
                  >
                    Back
                  </Link>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-1/2 ${
                      loading ? "bg-gray-400" : "bg-primary"
                    } text-white py-2 rounded-md transition duration-300`}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </motion.button>
                </div>
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
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OfficesLogin;
