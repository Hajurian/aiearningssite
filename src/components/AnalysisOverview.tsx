import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  MessageSquare,
  Target,
  Activity,
} from "lucide-react";

interface AnalysisOverviewProps {
  data: {
    quarters: string[];
    managementSentiment: number[];
    qaSentiment: number[];
    strategicFocuses: Record<string, string[]>;
  };
}

export function AnalysisOverview({ data }: AnalysisOverviewProps) {
  const latestQuarter = data.quarters[data.quarters.length - 1];
  const latestMgmtSentiment =
    data.managementSentiment[data.managementSentiment.length - 1];
  const latestQASentiment = data.qaSentiment[data.qaSentiment.length - 1];
  const prevMgmtSentiment =
    data.managementSentiment[data.managementSentiment.length - 2];
  const prevQASentiment = data.qaSentiment[data.qaSentiment.length - 2];

  const mgmtChange = latestMgmtSentiment - prevMgmtSentiment;
  const qaChange = latestQASentiment - prevQASentiment;

  const getTrendIcon = (change: number) => {
    if (change > 0.02) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < -0.02)
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0.02) return "text-green-600";
    if (change < -0.02) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Quarter</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestQuarter}</div>
          <p className="text-xs text-muted-foreground">Most recent analysis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Management Sentiment
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(latestMgmtSentiment * 100).toFixed(0)}%
          </div>
          <div
            className={`text-xs flex items-center gap-1 ${getTrendColor(
              mgmtChange
            )}`}
          >
            {getTrendIcon(mgmtChange)}
            {mgmtChange > 0 ? "+" : ""}
            {(mgmtChange * 100).toFixed(1)}% from prev quarter
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Q&A Sentiment</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(latestQASentiment * 100).toFixed(0)}%
          </div>
          <div
            className={`text-xs flex items-center gap-1 ${getTrendColor(
              qaChange
            )}`}
          >
            {getTrendIcon(qaChange)}
            {qaChange > 0 ? "+" : ""}
            {(qaChange * 100).toFixed(1)}% from prev quarter
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Strategic Themes
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.strategicFocuses[latestQuarter]?.length || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Key focus areas identified
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
