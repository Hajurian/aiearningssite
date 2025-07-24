import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Mock data representing NVIDIA earnings analysis
const mockData = {
  quarters: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
  managementSentiment: [0.75, 0.82, 0.78, 0.85],
  qaSentiment: [0.65, 0.72, 0.68, 0.76],
  strategicFocuses: {
    "Q1 2024": [
      "AI Infrastructure",
      "Data Center Growth",
      "Gaming Recovery",
      "Automotive AI",
      "Cloud Partnerships",
    ],
    "Q2 2024": [
      "Generative AI Boom",
      "H100 Demand",
      "Enterprise AI",
      "Edge Computing",
      "Software Revenue",
    ],
    "Q3 2024": [
      "AI Sovereignty",
      "Omniverse Expansion",
      "Robotics Platform",
      "Healthcare AI",
      "Sustainable Computing",
    ],
    "Q4 2024": [
      "AI Agents",
      "Blackwell Architecture",
      "Digital Twins",
      "Autonomous Vehicles",
      "Quantum Computing",
    ],
  },
  transcripts: {
    "Q1 2024":
      "Management prepared remarks focused heavily on the unprecedented demand for AI infrastructure...",
    "Q2 2024":
      "CEO Jensen Huang emphasized the transformative impact of generative AI across industries...",
    "Q3 2024":
      "The quarter demonstrated continued momentum in AI adoption with record data center revenue...",
    "Q4 2024":
      "Looking ahead, we see tremendous opportunities in AI agents and autonomous systems...",
  },
};

export default function EarningsAnalyzer() {
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
        <AnalysisOverview data={mockData} />

        {/* Main Content */}
        <Tabs defaultValue="sentiment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Sentiment Analysis
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tone Changes
            </TabsTrigger>
            <TabsTrigger value="strategic" className="flex items-center gap-2">
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
                    data={mockData.quarters.map((quarter, index) => ({
                      quarter,
                      sentiment: mockData.managementSentiment[index],
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
                    data={mockData.quarters.map((quarter, index) => ({
                      quarter,
                      sentiment: mockData.qaSentiment[index],
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
                <ToneChangeChart data={mockData} />
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
                <StrategicFocusChart data={mockData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcripts" className="space-y-6">
            <TranscriptViewer data={mockData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
