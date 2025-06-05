
'use client';

import TradingStrategyForm from "@/components/forms/TradingStrategyForm";

export default function StrategyPage() {
  return (
    <div className="h-full overflow-y-auto space-y-6 flex-shrink-0 p-4 md:p-6 lg:p-8 w-[calc(100vw-var(--sidebar-width,0rem)-2rem)] md:w-[60rem] lg:w-[70rem]">
      {/* The w-[...] is an example, adjust as needed for desired width in horizontal scroll */}
      {/* Or use flex-1 if it's the only/main expanding item */}
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
