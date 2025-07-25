# AI Powered NVIDIA Earnings Transcript Viewer
## What the app does
This app pulls data from <a href="[http://motleyfool.com/](https://www.fool.com/quote/nasdaq/nvda/#quote-earnings-transcripts)">[http://motleyfool.com/](https://www.fool.com/quote/nasdaq/nvda/#quote-earnings-transcripts)</a> and uses the provided earnings transcriptions to generate a quarterly earning report using ollama. <br> The data is first fetched using puppeteer and then formatted into JSON where an API endpoint reads the data and passes it to an ollama model to derive information such as management sentiment, qa sentiment, and specific strategic foci from that quarter. This data is then presented on a simple NextJS website.
## How to run locally
- Clone or download repository
- Navigate to the root directory and run npm i. This will install all necessary dependencies.
- Once installed, run npm run dev an go to http://localhost:3000
