"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Search } from "lucide-react";

interface TranscriptViewerProps {
  data: {
    quarters: string[];
    transcripts: Record<string, string>;
    managementSentiment: number[];
    qaSentiment: number[];
  };
}

export function TranscriptViewer({ data }: TranscriptViewerProps) {
  const [selectedQuarter, setSelectedQuarter] = useState(data.quarters[0]);

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment >= 0.8)
      return (
        <Badge className="bg-green-100 text-green-800">Very Positive</Badge>
      );
    if (sentiment >= 0.7)
      return <Badge className="bg-blue-100 text-blue-800">Positive</Badge>;
    if (sentiment >= 0.6)
      return <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>;
    return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
  };

  // Mock full transcript data

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {data.quarters.map((quarter, index) => (
          <Button
            key={quarter}
            variant={selectedQuarter === quarter ? "default" : "outline"}
            onClick={() => setSelectedQuarter(quarter)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {quarter}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {selectedQuarter} Earnings Call Transcript
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Management Sentiment:
              </span>
              {getSentimentBadge(
                data.managementSentiment[data.quarters.indexOf(selectedQuarter)]
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Q&A Sentiment:
              </span>
              {getSentimentBadge(
                data.qaSentiment[data.quarters.indexOf(selectedQuarter)]
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {/* {fullTranscripts[selectedQuarter as keyof typeof fullTranscripts]} */}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
