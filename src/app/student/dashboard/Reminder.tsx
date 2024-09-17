import React from 'react';

const Reminder = () => {
  return (
    <div className="bg-teal-100 p-4 rounded mb-6">
      <h3 className="font-bold text-lg">Reminder</h3>
      <p className="mt-2">
        Click the button to answer the Health Declaration Form.
      </p>
      <p className="mt-1">
        You may answer the Health Declaration Form once your appointment request has been approved and a day before your scheduled appointment.
      </p>
      <p className="mt-1">
        Click the button to generate Gate Pass.
      </p>
      <p className="mt-1">
        You may generate a Gate Pass after answering the Health Declaration Form. You will not be allowed to enter the premises if you do not have a Gate Pass.
      </p>
    </div>
  );
};

export default Reminder;