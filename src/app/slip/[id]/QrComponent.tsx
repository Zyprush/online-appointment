import React from "react";
import QRCode from "react-qr-code"; // Import from the new library

const QrComponent = () => {
  const qrValue = window.location.href

  return (
    <span className="flex flex-col m-auto border">
      {qrValue && <QRCode value={qrValue} size={80} bgColor="#244E8A" fgColor="#fff" />}
    </span>
  );
};

export default QrComponent;
