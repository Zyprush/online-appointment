import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex gap-0">
      <div className="justify-center items-center h-screen hidden w-2/3 md:flex  bg-gray-100"></div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col justify-center w-1/3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://via.placeholder.com/150"
          alt="Logo"
          className="mb-4 mx-auto"
          width="150"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Login to OMSC Appointment System{" "}
        </h1>
        <p className="text-gray-700 mb-6">
          Please click or tap the appropriate button.
        </p>
        <Link
          href={"/log-in/student"}
          className="bg-blue-500 text-white rounded-lg p-4 w-full hover:bg-blue-600 transition duration-300 mb-4"
        >
          Student
        </Link>
        <Link
          href={"/log-in/client"}
          className="bg-gray-500 text-white rounded-lg p-4 w-full hover:bg-gray-600 transition duration-300 mb-4"
        >
          Client
        </Link>
        <Link
          href={"/log-in/admin"}
          className="bg-green-500 text-white rounded-lg p-4 w-full hover:bg-green-600 transition duration-300"
        >
          College/Office Administrator
        </Link>
        <p className="text-gray-500 text-sm mt-4">
          By using this service, you understand and agree to the PUP Online
          Services{" "}
          <a href="#" className="text-blue-600 underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Statement
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default page;
