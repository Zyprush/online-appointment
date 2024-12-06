"use client";
import React from "react";

const data = [
  {
    title: "Editing Client Requirement (Office Admin)",
    description:
      "Editing Client Requirements as Admin involves updating the requirements for a client to conform to new regulations or standards. This can be done by selecting the client from the list of clients, then clicking the 'Edit Requirements' button to update the requirements.",
    link:
      "https://scribehow.com/shared/Editing_Client_Requirements_in_Admin_Portal__fulVLeVJTIyidZhCEfuqpA?fbclid=IwZXh0bgNhZW0CMTEAAR0f6eynhUsBIrky-5RAAndZa1nFe53adJkkQn12x3lqmkBEC_sv30YbZng_aem_20Ullw4U4MTeYr7soMI60g",
  },
  {
    title: "Creating a Holiday in Calendar (Admin)",
    description:
      "Creating a Holiday in Calendar allows the admin to add a new holiday to the calendar. This can be done by clicking the 'New Holiday' button and filling in the required details.",
    link:
      "https://scribehow.com/shared/Creating_a_Holiday_in_Calendar__GfXhcnORRcqvsqqbi7vk8A?fbclid=IwZXh0bgNhZW0CMTEAAR3KG6MRlTlzRZT3z9osUNq51hXNGHW2MgTLe_cuykIKhJxLU1gPQP5F1x8_aem_N2kf5MtZs1nh7HYuoVmESQ",
  },
  {
    title: "Booking an Appointment (Client)",
    description:
      "Booking an Appointment allows the user to schedule a meeting with a personnel of the chosen office. This can be done by selecting the desired office, date, and time, and filling in the required details.",
    link:
      "https://scribehow.com/shared/Booking_an_Appointment__-YRfK5U_TOWPf4M127up7A",
  },
  {
    title: "Adding Announcements (Office Admin)",
    description:
      "Booking an Appointment allows the user to schedule a meeting with a personnel of the chosen office. This can be done by selecting the desired office, date, and time, and filling in the required details.",
    link:
      "https://scribehow.com/shared/Add_Announcement_Documentation__8BDMqtXbROWjJNrj8ZU4ag?fbclid=IwZXh0bgNhZW0CMTEAAR1osHsS5iA40dT2rAF1TZQ1npr52C6oF-j26wtJyHA7KyqPedRVXgaUINQ_aem_2-NL-JG2_Ym-a99506c3dQ",
  },
];

const page = () => {
  return (
    <div className="p-10 space-y-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl text-primary font-bold">User Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white flex flex-col h-[300px] shadow group relative"
          >
            <div className="h-full">
              <div className="bg-[url('/img/omsc.jpg')] bg-cover bg-center h-full group-hover:opacity-100 opacity-0 transition duration-300 ease-linear">
                {/* this is the background when the component is hover */}
              </div>
              <div className="absolute top-0 p-5 m-5 overflow-hidden group-hover:bg-white group-hover:bg-opacity-80">
                <h1 className="text-xl text-primary font-bold">{item.title}</h1>
                <p className="text-gray-600 text-sm mt-3">
                  {item.description}
                </p>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 right-0 p-2 m-5 bg-primary bg-opacity-100 text-white"
              >
                see more..
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;

