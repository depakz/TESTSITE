import { NextResponse } from "next/server";

// Benign placeholder endpoint — not part of the intentional vulnerability.
export async function POST(request) {
  return NextResponse.json({ status: "received", message: "Thanks, we'll be in touch." });
}
