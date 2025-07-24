import puppeteer from "puppeteer";
import "fs/promises";
import { writeFileSync, readFileSync } from "fs";
import { load } from "cheerio";

async function fetchFullPage(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  const fullHtml = await page.content();

  const filename = `page_dump.html`;
  writeFileSync(filename, fullHtml);
  console.log(`Saved full page HTML to ${filename}`);

  await browser.close();
  return fullHtml;
}

function extractTranscript(filePath) {
  const html = readFileSync(filePath, "utf8");
  const $ = load(html);

  // Get every <p> on the page
  const paragraphs = $("p")
    .map((i, el) => $(el).text().trim())
    .get()
    // Filter out navigation/ads by length or keywords
    .filter(
      (line) =>
        line.length > 30 && !/cookie|advert|subscribe|sign in/i.test(line)
    );

  return paragraphs.join("\n\n");
}
(async () => {
  const url =
    "https://www.fool.com/earnings/call-transcripts/2024/05/29/nvidia-nvda-q1-2025-earnings-call-transcript/"; //I replaced the URLs manually to get the data
  await fetchFullPage(url);

  const text = extractTranscript("page_dump.html");
  writeFileSync("transcripts/q1_earnings.txt", text);
  console.log("Extracted text saved to page_text.txt");
})();
