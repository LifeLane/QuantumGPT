
'use client';

import InteractiveChart from "@/components/features/InteractiveChart";

export default function ChartingPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold tracking-tight">Advanced Charting Tools</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Analyze market trends with comprehensive TradingView charts.
          </p>
        </div>
      </div>
      <InteractiveChart />
    </div>
  );
}
