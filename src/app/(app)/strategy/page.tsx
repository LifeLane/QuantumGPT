
'use client';

import TradingStrategyForm from "@/components/forms/TradingStrategyForm";

export default function StrategyPage() {
  return (
    <div className="w-full h-full overflow-y-auto space-y-6 flex-shrink-0">
      {/* The main layout's padding will apply here */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold tracking-tight">AI Trading Strategy</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get personalized, AI-driven trading strategy suggestions.
          </p>
        </div>
      </div>
      <TradingStrategyForm />
    </div>
  );
}
