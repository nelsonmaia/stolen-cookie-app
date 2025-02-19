import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req, { params }) {
  try {
    const { id } = params; // Extract the family ID from the URL

    if (!id) {
      return NextResponse.json({ error: "No family ID provided" }, { status: 400 });
    }

    console.log(`🔍 Searching for records with family_id: ${id}`);

    // Search for records in the `auth0_cookies` table with the given family_id
    const { data, error } = await supabase
      .from("auth0_cookies")
      .select("id, value, session_id, family_id")
      .eq("family_id", id);

    if (error) {
      console.error("❌ Supabase query error:", error);
      return NextResponse.json({ error: "Database query failed" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.log(`❌ No records found for family_id: ${id}`);
      return NextResponse.json({ message: "No records found", family_id: id }, { status: 404 });
    }

    console.log(`✅ Found ${data.length} record(s) for family_id: ${id}`);

    return NextResponse.json({ message: "Records found", data }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
