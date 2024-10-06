import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-[url('/img/omsc.jpg')] bg-cover bg-center fixed inset-0">
      <div className="w-full md:w-auto h-full hidden md:flex justify-center items-center"></div>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center flex flex-col border w-full max-w-sm md:max-w-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Login
        </h1>
        <h2 className="text-lg md:text-xl font-bold text-primary mb-4">
          OMSC Appointment System
        </h2>
        <p className="text-primary mb-6 text-sm md:text-base">
          Please click or tap the appropriate button.
        </p>
        <Link
          href={"/log-in/student"}
          className="bg-primary text-white rounded-lg py-3 w-full hover:bg-blue-600 transition duration-300 mb-4"
        >
          Student/Alumni
        </Link>
        <Link
          href={"/log-in/client"}
          className="bg-gray-500 text-white rounded-lg py-3 w-full hover:bg-gray-600 transition duration-300 mb-4"
        >
          Client
        </Link>
        <Link
          href={"/log-in/offices"}
          className="bg-secondary text-white rounded-lg py-3 w-full transition duration-300 mb-4"
        >
          Office Administrator
        </Link>
        <Link
          href={"/log-in/admin"}
          className="bg-secondary text-white rounded-lg py-3 w-full transition duration-300"
        >
          System Administrator
        </Link>
        <p className="text-gray-500 text-xs md:text-sm mt-4">
          By using this service, you understand and agree to the OMSC Online
          Services{" "}
          <Link href="/etc/terms" className="text-blue-600 underline">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default page;
