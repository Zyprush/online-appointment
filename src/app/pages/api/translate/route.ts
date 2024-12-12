import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Parse request body
    const {
      text, // Text to translate
      targetLanguage, // Language to translate into (e.g., 'es' for Spanish)
    } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: text or targetLanguage." },
        { status: 400 }
      );
    }

    // Call Google Translate API
    const response = await axios.post(
      "https://translate.googleapis.com/translate_a/single",
      null, // No request body needed for this endpoint
      {
        params: {
          client: "gtx",
          sl: "auto", // Automatically detect the source language
          tl: targetLanguage, // Target language for translation
          dt: "t", // Return translated text
          q: text, // Text to translate
        },
      }
    );

    // Extract translated text from the response
    const translatedText = response.data[0][0][0];

    // Respond with the translated text
    return NextResponse.json({ success: true, translatedText });
  } catch (error) {
    console.error("Error using Google Translate API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to translate text." },
      { status: 500 }
    );
  }
}
