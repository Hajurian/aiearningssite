import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// export interface Transcript {
//   quarter: "Q1" | "Q2" | "Q3" | "Q4";
//   text: string;
// }
// export interface OllamaResponse {
//   model: string;
//   created_at: string;
//   response: string;
//   done: boolean;
//   done_reason?: string;
//   context?: number[];
//   total_duration?: number;
//   load_duration?: number;
//   prompt_eval_duration?: number;
//   eval_duration?: number;
// }
export async function main() {
  try {
    // Recreate __dirname for ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Go up two directories to reach the project root (adjust as needed)
    const transcriptsPath = path.resolve(
      __dirname,
      "../transcripts/transcripts.json"
    );
    if (existsSync(transcriptsPath)) {
      const raw = readFileSync(transcriptsPath, "utf8");
      //Have transcriptions in JSON
      const transcripts = JSON.parse(raw);

      analyzeAllQuarters(transcripts);
    } else {
      console.log(transcriptsPath);
    }
  } catch (err) {
    console.error(err);
  }
  // const AIRes = await generateAIResponse();
  // return NextResponse.json({ status: 200 });
}

async function generateAIResponse(
  transcriptSegment,
  currentSegment,
  totalSegments
) {
  const prompt = `You are analyzing a quarterly earnings call transcript.

The transcript is provided in segments. This is segment ${currentSegment} of ${totalSegments}.
Only analyze the content in this segment. Do NOT attempt to summarize the entire call yet.

For this segment, provide:
1. Management Sentiment: Return a numeric score between 0 (very negative) and 1 (very positive) for the tone of the prepared remarks.
2. Q&A Sentiment: Return a numeric score between 0 (very negative) and 1 (very positive) for the tone of the Q&A portion.
3. Key strategic themes (up to 3 themes mentioned in this segment).

Respond ONLY as a JSON object in this exact format (do not include explanations):
{
  "managementSentiment": <number between 0 and 1>,
  "qaSentiment": <number between 0 and 1>,
  "strategicFocuses": ["theme1", "theme2", "theme3"]
}

Here is the transcript segment:
"""
${transcriptSegment}
"""
`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });
  const data = await res.json();
  return data;
}

export function chunkText(text, maxLength = 3000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxLength;

    if (end >= text.length) {
      chunks.push(text.slice(start).trim());
      break;
    }

    let lastBreak = text.lastIndexOf("\n", end);
    if (lastBreak === -1 || lastBreak <= start) {
      lastBreak = end;
    }

    chunks.push(text.slice(start, lastBreak).trim());
    start = lastBreak;
  }

  return chunks;
}

async function analyzeAllQuarters(transcriptions) {
  const results = {};
  //1. Loop through transcriptions.
  for (const transcription of transcriptions) {
    const chunkedTexts = chunkText(transcription.text);
    console.log("Chunked ", transcription.quarter);
    const chunkResults = [];
    //2. For each transcription, chunk the text, and pass it through to ollama
    for (let i = 0; i < chunkedTexts.length; i++) {
      const response = await generateAIResponse(
        chunkedTexts[i],
        i + 1,
        chunkedTexts.length
      );
      chunkResults.push(response.response);
    }
    //3 For all of the chunked responses, pass it through with another prompt that aggregates all of the data.
    const aggregated = await aggregateQuarterAnalysis(
      transcription.quarter,
      chunkResults
    );
    results[transcription.quarter] = {
      chunks: chunkResults,
      finalSummary: aggregated.response, // the combined JSON string
    };
  }
  //4 Paste the aggregated data into a json file. Return the json file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputFile = path.join(__dirname, "analysis.json");
  writeFileSync(outputFile, JSON.stringify(results));
  return results;
}

async function aggregateQuarterAnalysis(quarter, chunkAnalyses) {
  const prompt = `You are an expert financial analyst.

You have been given partial analyses of the ${quarter} NVIDIA earnings call, each representing a different segment of the transcript.
Each chunk analysis is already structured as JSON.

Combine them into ONE final summary for the quarter.

Rules:
- Merge all strategic focuses, removing duplicates.
- Combine sentiment (majority wins: positive/neutral/negative) for management and Q&A.
- If a previous quarter summary is provided, compare tone and describe quarter-over-quarter tone change.

Return ONLY as JSON in this format:
{
  "quarter":"<Q1 | Q2 | Q3 | Q4>",
  "managementSentiment": "Return a numeric score between 0 (very negative) and 1 (very positive) for the tone of the prepared remarks.",
  "qaSentiment": "Return a numeric score between 0 (very negative) and 1 (very positive) for the tone of the Q&A portion.",
  "strategicFocuses": [
    "<theme1>",
    "<theme2>",
    "<theme3>",
    "... up to 5 themes"
  ]
}

Chunk analyses:
"""
${chunkAnalyses.join("\n")}
"""
`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });

  const data = await res.json();
  return data;
}
main();
