import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req, { params }) {
  try {
    let { id } = params; // Correct way to extract the ID in App Router

    console.log(`🔍 Searching for records with session / cookie id : '${id}'`); 

    if (!id) {
      return NextResponse.json({ error: "No cookie ID provided" }, { status: 400 });
    }
    id = String(id).trim();

    const { data, error } = await supabase
      .from("auth0_cookies")
      .select("id, value, session_id, family_id")
      .eq("session_id", `${id}`); 

    if (error) {
      console.error("❌ Supabase query error:", error);
      return NextResponse.json({ error: "Database query failed" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.log(`❌ No records found for cookie id: '${id}'`);
      
      return NextResponse.json({ message: "No records found", id: id }, { status: 404 });
    }

    console.log(`✅ Found ${data.length} record(s) for cookie id: '${id}'`);

    return NextResponse.json({ message: "Records found", data }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
