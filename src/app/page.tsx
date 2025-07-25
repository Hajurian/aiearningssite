import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SentimentChart } from "@/components/SentimentChart";
import { StrategicFocusChart } from "@/components/StrategicFocus";
import { ToneChangeChart } from "@/components/ToneChangeChart";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { AnalysisOverview } from "@/components/AnalysisOverview";
import {
  TrendingUp,
  Brain,
  MessageSquare,
  Target,
  BarChart3,
} from "lucide-react";

export const dynamic = "force-dynamic";
interface ExtractedSummary {
  managementSentiment: number;
  qaSentiment: number;
  strategicFocuses: string[];
}
interface QuarterAnalysis {
  finalSummary: string;
}

interface Analysis {
  [quarter: string]: QuarterAnalysis;
}
interface Transcription {
  quarter: string;
  text: string;
}

function extractSummaryData(finalSummary: string): ExtractedSummary | null {
  // Match the JSON object inside the string using a regex
  const jsonMatch = finalSummary.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      managementSentiment: parsed.managementSentiment ?? 0,
      qaSentiment: parsed.qaSentiment ?? 0,
      strategicFocuses: Array.isArray(parsed.strategicFocuses)
        ? parsed.strategicFocuses
        : [],
    };
  } catch (err) {
    console.error("Failed to parse summary JSON:", err);
    return null;
  }
}

async function getJSONOutput(fileLocation: string) {
  const raw = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/transcripts/${fileLocation}`
  );
  if (!raw.ok) throw new Error(`Failed to load ${fileLocation}`);
  const jsonOutput = await raw.json();
  return jsonOutput;
}
function formatAnalysisArrays(
  analysis: Analysis,
  transcriptions: Transcription[]
) {
  const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  const managementSentiment: number[] = [];
  const qaSentiment: number[] = [];
  const strategicFocuses: Record<string, string[]> = {};
  const transcriptionArray: Record<string, string> = {};
  for (const quarter in QUARTERS) {
    managementSentiment.push(
      extractSummaryData(analysis[QUARTERS[quarter]].finalSummary)
        ?.managementSentiment || 0
    );
    qaSentiment.push(
      extractSummaryData(analysis[QUARTERS[quarter]].finalSummary)
        ?.qaSentiment || 0
    );
    strategicFocuses[QUARTERS[quarter]] =
      extractSummaryData(analysis[QUARTERS[quarter]].finalSummary)
        ?.strategicFocuses || [];
    transcriptionArray[QUARTERS[quarter]] = transcriptions[quarter].text;
  }
  return {
    quarters: QUARTERS,
    managementSentiment,
    qaSentiment,
    strategicFocuses,
    transcripts: transcriptionArray,
  };
}

export default async function EarningsAnalyzer() {
  const baseURL = process.env.NEXT_PUBLIC_URL;
  const res = await fetch(`${baseURL}/api/aianalysis`, {
    method: "GET",
  });
  if (res.status == 200) {
    //1. Get transcripts
    const transcriptions = await getJSONOutput("transcripts.json");

    //2. Get AI analysis
    const AIAnalysis = await getJSONOutput("analysis.json");
    //3. Format data AI data in a way that is presentable
    const data = formatAnalysisArrays(AIAnalysis, transcriptions);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">
              NVIDIA Earnings Call Signal Extraction
            </h1>
            <p className="text-slate-600 text-lg">
              AI-powered analysis of the last four quarters
            </p>
          </div>

          {/* Overview Cards */}
          <AnalysisOverview data={data} />

          {/* Main Content */}
          <Tabs defaultValue="sentiment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="sentiment"
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Sentiment Analysis
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Tone Changes
              </TabsTrigger>
              <TabsTrigger
                value="strategic"
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Strategic Focus
              </TabsTrigger>
              <TabsTrigger
                value="transcripts"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Transcripts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      Management Sentiment
                    </CardTitle>
                    <CardDescription>
                      Sentiment analysis of prepared executive remarks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SentimentChart
                      data={data.quarters.map((quarter, index) => ({
                        quarter,
                        sentiment: data.managementSentiment[index],
                      }))}
                      type="management"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      Q&A Sentiment
                    </CardTitle>
                    <CardDescription>
                      Sentiment analysis of Q&A session interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SentimentChart
                      data={data.quarters.map((quarter, index) => ({
                        quarter,
                        sentiment: data.qaSentiment[index],
                      }))}
                      type="qa"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Quarter-over-Quarter Tone Changes
                  </CardTitle>
                  <CardDescription>
                    Comparative analysis of sentiment shifts across quarters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ToneChangeChart data={data} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    Strategic Focus Areas
                  </CardTitle>
                  <CardDescription>
                    Key themes and initiatives emphasized each quarter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StrategicFocusChart data={data} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcripts" className="space-y-6">
              <TranscriptViewer data={data} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
}
