"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestTradingStrategy, type SuggestTradingStrategyOutput } from "@/ai/flows/ai-trading-strategy-suggestion"; // Removed unused SuggestTradingStrategyInput
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
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
      cryptocurrency: "BTC",
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
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">AI Trading Strategy Suggestion</CardTitle>
          <CardDescription>Get an AI-generated trading strategy for a specific cryptocurrency.</CardDescription>
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
                      <Input placeholder="e.g., ETH, SOL" {...field} className="bg-background" />
                    </FormControl>
                    <FormDescription>Enter the ticker symbol (e.g., BTC).</FormDescription>
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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

      {suggestion && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Suggested Trading Strategy for {form.getValues("cryptocurrency")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg font-headline">Strategy Explanation:</h3>
              <p className="text-muted-foreground">{suggestion.strategyExplanation}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Entry Point" value={`$${suggestion.entryPoint.toLocaleString()}`} />
              <InfoItem label="Exit Point" value={`$${suggestion.exitPoint.toLocaleString()}`} />
              <InfoItem label="Stop-Loss Level" value={`$${suggestion.stopLossLevel.toLocaleString()}`} />
              <InfoItem label="Profit Target" value={`$${suggestion.profitTarget.toLocaleString()}`} />
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

