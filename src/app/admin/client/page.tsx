"use client";

import React, { useState } from "react";
import VerifiedClient from "./VerifiedClient";
import RestrictedClient from "./RestrictedClient"; // Updated import statement
import NavLayout from "@/components/NavLayout";
     
export default function Page() {
  const [showVerified, setShowVerified] = useState(true);

  return (
    <NavLayout>
      <div className="w-full mx-auto p-4">
        <div className="flex flex-col sm:flex-row border-b pb-3 justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowVerified(true)}
            className={`btn btn-sm rounded-sm w-full sm:w-auto ${
              showVerified ? "btn-primary text-white" : "btn-ghost"
            }`}
          >
            Verified Clients
          </button>
          <button
            onClick={() => setShowVerified(false)}
            className={`btn btn-sm w-full rounded-sm sm:w-auto ${
              !showVerified ? "btn-primary text-white" : "btn-ghost"
            }`}
          >
            Restricted Clients
          </button>
        </div>

        <div className="">
          <div className="transition-opacity duration-300 ease-in-out">
            {showVerified ? <VerifiedClient /> : <RestrictedClient />} 
          </div>
        </div>
      </div>
    </NavLayout>
  );
}
