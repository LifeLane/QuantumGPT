
import TradingStrategyForm from "@/components/forms/TradingStrategyForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

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
