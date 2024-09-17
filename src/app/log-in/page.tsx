import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-full overflow-scroll fixed top-0  bottom-0 right-0 left-0 p-5 bg-[url('/img/omsc.jpg')]">
      <div className="justify-center items-center h-full hidden w-full md:flex"></div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col border justify-center w-1/3">
      <h1 className="text-3xl font-bold text-primary mb-2">
          Login
        </h1>
        <h1 className="text-xl font-bold text-primary mb-2">
          OMSC Appointment System
        </h1>
        <p className="text-primary mb-6 text-sm">
          Please click or tap the appropriate button.
        </p>
        <Link
          href={"/log-in/student"}
          className="bg-primary text-white rounded-lg p-4 w-full hover:bg-blue-600 transition duration-300 mb-4"
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
          className="bg-secondary text-white rounded-lg p-4 w-full transition duration-300"
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
