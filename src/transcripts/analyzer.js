import { fileURLToPath } from "url";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

const TRANSCRIPTS = [
  "q1_earnings.txt",
  "q2_earnings.txt",
  "q3_earnings.txt",
  "q4_earnings.txt",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "transcripts.json");

function loadTranscript(transcriptName) {
  const filePath = path.join(__dirname, transcriptName);
  const text = readFileSync(filePath, "utf8");
  return text;
}

function makeTranscriptionJSON() {
  const transcriptionData = TRANSCRIPTS.map((fileName) => {
    const text = loadTranscript(fileName);
    const quarter = fileName.split("_")[0].toUpperCase();
    return { quarter, text };
  });
  writeFileSync(outputFile, JSON.stringify(transcriptionData));
  console.log("Saved transcripts to transcipts.json");
}
makeTranscriptionJSON();
