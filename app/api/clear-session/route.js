import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { session_id } = await req.json();

    console.log("🔄 Received session ID to clear:", session_id);

    if (!session_id) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    // Update the row where session_id matches, setting session_id to null
    const { data, error } = await supabase
      .from("auth0_cookies")
      .update({ session_id: null })
      .eq("session_id", session_id);

    if (error) {
      console.error("❌ Supabase update error:", error);
      return NextResponse.json({ error: "Failed to clear session ID" }, { status: 500 });
    }

    console.log(`✅ Successfully cleared session ID: ${session_id}`);

    const response = NextResponse.json({
      message: `Session ID ${session_id} cleared successfully`,
      data,
    });

    // ✅ Allow localhost & cross-origin requests for testing
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("❌ Error clearing session ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
