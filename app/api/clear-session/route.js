import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use the service role key for updates
);

export async function POST(req) {
  try {
    const { session_id } = await req.json();

    console.log("🔄 Received session ID to clear:", session_id);

    if (!session_id) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    // Step 1: Verify session exists before updating
    const { data: existingData, error: fetchError } = await supabase
      .from("auth0_cookies")
      .select("session_id")
      .eq("session_id", session_id);

    if (fetchError) {
      console.error("❌ Error fetching session before update:", fetchError);
      return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
    }

    if (!existingData || existingData.length === 0) {
      console.log(`⚠️ No record found with session_id: ${session_id}`);
      return NextResponse.json({ message: `No record found for session_id: ${session_id}` });
    }

    const { id } = existingData[0]; // Extract id and session_id
    console.log(`✅ Found Record - ${existingData} ${existingData[0]}`);
    console.log(`✅ Found Record - ID: ${id}, Session ID: ${session_id}`);

    // Step 2: Update session_id to NULL
    const { error } = await supabase
      .from("auth0_cookies")
      .update({ session_id: null })
      .eq("id", id);

    if (error) {
      console.error("❌ Supabase update error:", error);
      return NextResponse.json({ error: "Failed to clear session ID" }, { status: 500 });
    }

    console.log(`✅ Successfully cleared session ID: ${session_id}`);

    const response = NextResponse.json({
      message: `Session ID ${session_id} cleared successfully`,
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("❌ Error clearing session ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
