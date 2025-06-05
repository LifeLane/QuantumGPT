'use client';

import TradingStrategyForm from "@/components/forms/TradingStrategyForm";

export default function StrategyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight">AI Trading Strategy</h2>
          <p className="text-muted-foreground">
            Get personalized, AI-driven trading strategy suggestions.
          </p>
        </div>
      </div>
      <TradingStrategyForm />
    </div>
  );
}
