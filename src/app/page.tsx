"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/topNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-white flex flex-col items-center justify-center px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center space-y-4"
        >
          <span className="bg-blue-100 text-primary px-4 py-2 rounded-full text-sm mb-2">
            Seamless Appointments
          </span>
          <h1 className="text-4xl text-center md:text-5xl font-extrabold text-gray-800">
            YOUR <span className="text-blue-600">CONVENIENT</span> APPOINTMENT
            SOLUTION
          </h1>
          <p className="text-gray-600 max-w-lg text-center">
            Easily book and manage appointments with OMSC. Experience
            hassle-free scheduling for students, faculty, and staff.
          </p>
          <div className="mt-4 gap-5 flex">
            <Link
              href="/calendar"
              className="btn btn-primary rounded-md text-white px-6 py-3 font-normal"
            >
              Schedule
            </Link>

            <Link
              href="/signup/client"
              className="btn btn-primary rounded-md text-white px-6 py-3 font-normal"
            >
              Client Signup
            </Link>
          </div>
        </motion.div>

        {/* Background Elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-1/4 left-4 hidden lg:block"
        >
          {/* Add illustration or image */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-0 right-4 hidden lg:block"
        >
          {/* Add another illustration or image */}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-gray-100 text-center mt-auto">
        <p className="text-gray-600">
          © 2024 OMSC Appointment System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
