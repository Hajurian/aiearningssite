import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const transcriptsPath = path.join(
    process.cwd(),
    "public",
    "transcripts",
    "analysis.json"
  );
  try {
    await fs.access(transcriptsPath); // check if file exists
    return NextResponse.json({ message: "Exists" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: transcriptsPath }, { status: 500 });
  }
}
