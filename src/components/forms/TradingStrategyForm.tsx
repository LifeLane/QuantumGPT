
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestTradingStrategy, type SuggestTradingStrategyOutput } from "@/ai/flows/ai-trading-strategy-suggestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, InfoIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  cryptocurrency: z.string().min(2, "Symbol too short.").max(10, "Symbol too long.").toUpperCase(),
  riskTolerance: z.enum(['low', 'medium', 'high'], { required_error: "Please select a risk tolerance level." }),
});

type FormData = z.infer<typeof formSchema>;

export default function TradingStrategyForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] = React.useState<SuggestTradingStrategyOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: "",
      riskTolerance: "medium",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const output = await suggestTradingStrategy(data);
      setSuggestion(output);
    } catch (e) {
      console.error("Trading Strategy Error:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred while generating the strategy. The AI model might have failed to process the request or use tools correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">AI Trading Strategy Suggestion</CardTitle>
          <CardDescription>Get an AI-generated trading strategy for a specific cryptocurrency, using (simulated) real-time data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ETH, SOL, BTC" {...field} className="bg-background" />
                    </FormControl>
                    <FormDescription>Enter the ticker symbol. The AI will attempt to fetch its current price.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Get Strategy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && suggestion === null && !error && (
         <Alert variant="default" className="border-accent">
            <InfoIcon className="h-4 w-4 !text-accent" />
            <AlertTitle>Ready for Strategy</AlertTitle>
            <AlertDescription>Enter a cryptocurrency and your risk tolerance to get an AI-suggested trading strategy. Note: Real-time data fetching is simulated.</AlertDescription>
        </Alert>
      )}

      {suggestion && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Suggested Trading Strategy for {form.getValues("cryptocurrency")}</CardTitle>
             {suggestion.currentPrice !== undefined && suggestion.currentPrice !== null && (
              <CardDescription>Based on current price of ${suggestion.currentPrice.toLocaleString()} (simulated real-time data).</CardDescription>
            )}
             {(suggestion.currentPrice === undefined || suggestion.currentPrice === null) && (
                 <CardDescription>Current price data was not available for this cryptocurrency. Strategy is based on general analysis.</CardDescription>
             )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg font-headline">Strategy Explanation:</h3>
              <p className="text-muted-foreground">{suggestion.strategyExplanation}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestion.currentPrice !== undefined && suggestion.currentPrice !== null && (
                <InfoItem label="Fetched Current Price" value={`$${suggestion.currentPrice.toLocaleString()}`} />
              )}
              <InfoItem label="Suggested Entry Point" value={`$${suggestion.entryPoint.toLocaleString()}`} />
              <InfoItem label="Suggested Exit Point" value={`$${suggestion.exitPoint.toLocaleString()}`} />
              <InfoItem label="Suggested Stop-Loss" value={`$${suggestion.stopLossLevel.toLocaleString()}`} />
              <InfoItem label="Suggested Profit Target" value={`$${suggestion.profitTarget.toLocaleString()}`} />
            </div>
          </CardContent>
          <CardFooter>
            <Alert variant="default" className="border-accent">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertTitle className="font-headline text-accent">Disclaimer</AlertTitle>
              <AlertDescription>{suggestion.disclaimer}</AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-secondary rounded-md shadow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-lg text-foreground">{value}</p>
    </div>
  );
}
