import { NextResponse } from "next/server"; // Import NextResponse
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  if (!accountSid || !authToken || !twilioPhoneNumber) {
    return NextResponse.json(
      { success: false, error: "Twilio credentials or phone number are missing." },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const {
      appointmentId,
      contact, // Use this contact field for sending the SMS
      selectedDate,
      timeRange,
      selectedOffice,
    } = await req.json();

    // Construct the SMS message
    const messageBody = `Your appointment has been declined.\n \nCode: ${appointmentId} \nDetails:\nDate: ${selectedDate}\nTime: ${timeRange}\nOffice: ${selectedOffice}.`;

    // Send the SMS
    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber, // Use the Twilio phone number from environment variables
      to: `+63${contact}`, // Send to the dynamic contact number provided
      // to: `+639633538466`,
    });

    console.log('message', message)
    // Respond with success if the message was sent
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
