"use client";
import Navbar from "@/components/topNavbar";
import Image from "next/image";
import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-12 py-16 bg-white">
        <Navbar/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl w-full">
        {/* World Map Section */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <Image
              src="/img/booking.svg"
              alt="World Map"
              width={500}
              height={500}
              className="w-full max-w-md my-auto"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center space-y-4 text-left">
          <h4 className="text-blue-700 font-bold tracking-wide">
            ABOUT THE SYSTEM
          </h4>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Experience a Seamless Appointment Booking System!
          </h1>
          <p className="text-gray-600 text-sm">
            The OMSC Appointment System is designed to streamline the process of
            booking appointments for students, faculty, alumni, and external
            clients. Whether you re planning to meet with an advisor, schedule
            an event, or visit the campus, our platform simplifies the entire
            process for you.
          </p>
          <p className="text-gray-600 text-sm">
            With real-time availability, automated notifications, and
            user-friendly interface, our system ensures that scheduling your
            appointments is easy, fast, and hassle-free. Join us in embracing
            modern and efficient appointment management!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
