# AI Powered NVIDIA Earnings Transcript Analysis Viewer
## <a href="https://aiearningssite.vercel.app/">https://aiearningssite.vercel.app/</a>
## What the app does
This app pulls data from <a href="[http://motleyfool.com/](https://www.fool.com/quote/nasdaq/nvda/#quote-earnings-transcripts)">[http://motleyfool.com/](https://www.fool.com/quote/nasdaq/nvda/#quote-earnings-transcripts)</a> and uses the provided earnings transcriptions to generate a quarterly earning report using ollama. <br> The data is first fetched using puppeteer and then formatted into JSON where an API endpoint reads the data and passes it to an ollama model to derive information such as management sentiment, qa sentiment, and specific strategic foci from that quarter. This data is then presented on a simple NextJS website.
## How to run locally
- Clone or download repository
- Navigate to the root directory and run npm i. This will install all necessary dependencies.
- Once installed, run npm run dev an go to http://localhost:3000

## AI/NLP Models used
For this project, I utilized ollama's llama3 to do all of the analysis. I used ollama because it is free and I could run it locally to do a lot of testing on how I would prompt the model and how I wanted the output to be structured. I considered using openAI and or togetherAI for this project but due to time / monetary concerns, I ultimately ended up using ollama for the factors mentioned prior. <br>
Beyond analysis, I used Vercel's v0 to generate much of the UI of the app as the UI was less important than the core functionality.

## Key Assumptions and Limitations
For this project, there were many assumptions made and a few limitations that led me to make specific design chocies in the app. The main limitation I encountered was time and I did a lot of things to save time. Below are a list of things I did in response to my assumptions and limitations
- I wanted the app to run quicker and since I only needed data from the last four quarters, I decided to have the web scraper that fetched the transcription data to be ran locally and then have the outputs cached in a json file.
- The AI analysis was cached in a similar manner and this had to be done given that I utilized ollama which only runs locally. Given a more fleshed out app, I would've liked to implement a scraper that would fetch the transcription data in real time and then have a different non local model do the AI analysis on the transcriptions.
- A major limitation was the ollama model I used was not trained so the sentiment scoring and Q&A sentiment are pretty arbitrary as I just prompted the model to give it a score between 0 and 1. With more time, I would've wished to train a model to provide more accurate analysis.
- The app lacks substantial error handling to save time. I didn't bother implementing much error handling as for the most part, this is a static page as I am pulling the AI analysis from a cached JSON file. Given a real app with the need to send API requests to get the data, I would've opted to incorporate more robust error handling.
- A lot of the utility functions such as scraping the transcripts and generating the ai responses were done in javascript rather than typescript for convenience. Given more time, I would've opted to do them in Typescript for better type safety and better code quality.
<br>
There were definitely more assumptions I made and most of them boil down to wanting to produce a functioning app in as short of time as possible so there are some organizational issues and code cleanliness issues that I would address given more time.
