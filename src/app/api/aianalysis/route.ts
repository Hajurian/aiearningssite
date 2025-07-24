import { existsSync, readFileSync } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { fileURLToPath } from "url";
export async function GET() {
  try {
    // Recreate __dirname for ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Go up two directories to reach the project root (adjust as needed)
    const transcriptsPath = path.resolve(
      __dirname,
      "../../../transcripts/transcripts.json"
    );
    console.log(transcriptsPath);
    if (existsSync(transcriptsPath)) {
      const raw = readFileSync(transcriptsPath, "utf8");
      const transcripts = JSON.parse(raw);
      return NextResponse.json({ transcripts }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Did not find file" },
        { status: 404 } // More appropriate than 500
      );
    }
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
