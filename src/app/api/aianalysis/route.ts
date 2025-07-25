import { existsSync } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { fileURLToPath } from "url";

export async function GET() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Go up two directories to reach the project root (adjust as needed)
  const transcriptsPath = path.resolve(
    __dirname,
    "../../../transcripts/analysis.json"
  );
  if (existsSync(transcriptsPath)) {
    return NextResponse.json(
      {
        message: "Exists",
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ message: transcriptsPath }, { status: 500 });
  }
}
