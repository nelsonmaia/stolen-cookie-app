import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  

export async function POST(req) {
  try {
    const { cookie, session_id } = await req.json();

    console.log("Received cookie:", cookie, session_id);

    if (!cookie) {
      return NextResponse.json({ error: "No cookie provided" }, { status: 400 });
    }

    // Store the cookie in the Supabase `auth0_cookies` table
    const { data, error } = await supabase
      .from("auth0_cookies")
      .insert([{ value: cookie, session_id: session_id }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save cookie to database" }, { status: 500 });
    }

    const response = NextResponse.json({ message: "Cookie saved", data });

    // ✅ Allow localhost for testing
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error saving cookie:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
