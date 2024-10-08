import NavLayout from "@/components/NavLayout";
import React from "react";
import OfficePendingAppointment from "./OfficePendingAppointment";

const page = () => {
  return (
    <NavLayout>
      <div className="flex flex-col p-4 md:p-10">
        <OfficePendingAppointment />
      </div>
    </NavLayout>
  );
};

export default page;
