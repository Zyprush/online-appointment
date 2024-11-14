import { NextResponse } from "next/server";
import axios from "axios";

// Replace with your Semaphore API key
const apiKey = process.env.SEMAPHORE_API_KEY;
// const senderName = process.env.SEMAPHORE_SENDER_NAME || 'SEMAPHORE';
const senderName = "Semaphore";

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Semaphore API key is missing." },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const {
      contact, // Contact number to send SMS to
      messageBody,
    } = await req.json();

    // Send the SMS via Semaphore
    const response = await axios.post(
      "https://api.semaphore.co/api/v4/messages",
      {
        apikey: apiKey,
        number: `0${contact}`, // Sending to a dynamic contact number provided
        message: messageBody,
        sendername: senderName, // Optional; only if sender name is configured in Semaphore
      }
    );

    // Log the response for debugging purposes
    console.log("Semaphore response", response.data);

    // Respond with success if the message was sent
    return NextResponse.json({ success: true, message: response.data });
  } catch (error) {
    console.error("Error sending SMS via Semaphore:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
