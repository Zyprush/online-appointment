import { NextResponse } from "next/server"; // Import NextResponse
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(req: Request) {

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { success: false, error: "Twilio credentials are missing." },
      { status: 500 }
    );
  }

  try {
    console.log("TRY SENDING MESS")
    const {
      appointmentId,
      phone,
      selectedDate,
      timeRange,
      selectedOffice,
      selectedPersonnel,
    } = await req.json();

    // Construct the SMS message
    const messageBody = `Your appointment (Code: ${appointmentId}) has been approved.\nDetails:\nDate: ${selectedDate}\nTime: ${timeRange}\nOffice/Personnel: ${
      selectedOffice || selectedPersonnel
    }.`;

    // Send the SMS
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER, // Make sure this is set
      to: phone,
    });
    if (message) {
      console.log("MESSAGE SENT OK");
    }
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}

// You can also export other HTTP methods if needed, e.g., GET, DELETE, etc.
