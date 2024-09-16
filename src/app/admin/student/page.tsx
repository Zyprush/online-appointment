"use client";
import React, { useState } from "react";
import AlumniAccount from "./AlumniAccount";
import StudentAccount from "./StudentAccount";
import NavLayout from "@/components/NavLayout";
import Link from "next/link";

const Page = () => {
  const [table, setTable] = useState<"student" | "alumni">("student");

  const handleToggle = () => {
    setTable((prevTable) => (prevTable === "student" ? "alumni" : "student"));
  };

  const renderAccountTable = () => {
    switch (table) {
      case "student":
        return <StudentAccount />;
      case "alumni":
        return <AlumniAccount />;
      default:
        return null;
    }
  };

  return (
    <NavLayout>
      <div className="p-4">
        <div className="flex w-full border-b pb-4 flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleToggle}
            className={`btn btn-sm w-full rounded-sm sm:w-auto ${
              table === "student" ? "btn-primary text-white" : "btn-ghost"
            }`}
          >
            Student Accounts
          </button>
          <button
            onClick={handleToggle}
            className={`btn btn-sm w-full rounded-sm sm:w-auto ${
              table === "alumni" ? "btn-primary text-white" : "btn-ghost"
            }`}
          >
            Alumni Accounts
          </button>
          <Link
            href={"/admin/register-student"}
            className={`btn btn-sm w-full rounded-sm sm:w-auto hover:bg-primary hover:text-white btn-ghost`}
          >
            Register Student
          </Link>
        </div>

        {/* Render the selected account table */}
        {renderAccountTable()}
      </div>
    </NavLayout>
  );
};

export default Page;
