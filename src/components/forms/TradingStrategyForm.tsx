
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
import { Loader2, AlertTriangle, InfoIcon, LineChart, DatabaseZap } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Ensure TradingView is declared globally
declare global {
  interface Window { TradingView?: any; }
}

const formSchema = z.object({
  cryptocurrency: z.string().min(2, "Symbol too short.").max(20, "Symbol too long (e.g. BINANCE:BTCUSDT).").toUpperCase(),
  riskTolerance: z.enum(['low', 'medium', 'high'], { required_error: "Please select a risk tolerance level." }),
});

type FormData = z.infer<typeof formSchema>;

const TradingViewSymbolOverview: React.FC<{ symbol: string; key?: string }> = React.memo(({ symbol }) => {
  const containerId = `tv-symbol-overview-${symbol.replace(/[^a-zA-Z0-9]/g, "")}-${React.useId().replace(/:/g, "")}`;

  React.useEffect(() => {
    if (typeof window.TradingView === 'undefined' || !document.getElementById(containerId)) {
      return;
    }
    const widgetContainer = document.getElementById(containerId);
    if (widgetContainer) {
        widgetContainer.innerHTML = ''; // Clear previous widget
        new window.TradingView.SymbolOverview({
            "symbols": [
              [symbol]
            ],
            "chartOnly": false,
            "width": "100%",
            "height": 300,
            "locale": "en",
            "colorTheme": "dark",
            "autosize": true,
            "showVolume": true,
            "showMA": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "Inter, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "area",
            "maLineColor": "#2962FF",
            "maLineWidth": 1,
            "maLength": 9,
            "lineWidth": 2,
            "lineType": 0,
            "dateRanges": [
              "1d|1",
              "1w|15",
              "1m|30",
              "3m|60",
              "12m|1D",
              "all|1M"
            ],
            "container_id": containerId
          });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, containerId]); 

  return <div id={containerId} className="mt-4 w-full h-[300px]" />;
});
TradingViewSymbolOverview.displayName = 'TradingViewSymbolOverview';


export default function TradingStrategyForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] = React.useState<SuggestTradingStrategyOutput | null>(null);
  const [formSubmittedSymbol, setFormSubmittedSymbol] = React.useState<string | null>(null);


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
    setFormSubmittedSymbol(data.cryptocurrency); 
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
          <CardDescription>Get an AI-generated trading strategy. Enter a full symbol like "BINANCE:ETHUSDT" or "COINBASE:SOLUSD". The AI will use its market data tool (currently using simulated real-time data from <code>src/services/crypto-data-service.ts</code>).</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency Symbol (e.g., BINANCE:BTCUSDT)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BINANCE:ETHUSDT" {...field} className="bg-background" />
                    </FormControl>
                    <FormDescription>The AI will attempt to fetch current market data using its tool.</FormDescription>
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
            <AlertDescription>Enter a cryptocurrency and your risk tolerance to get an AI-suggested trading strategy. Market data for AI analysis is currently fetched using a <strong>simulated data service</strong>. For live data, please integrate a real API in <code>src/services/crypto-data-service.ts</code>.</AlertDescription>
        </Alert>
      )}

      {suggestion && formSubmittedSymbol && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Suggested Trading Strategy for {formSubmittedSymbol}</CardTitle>
             <CardDescription>
                AI analysis based on market data.
             </CardDescription>
             <Alert variant="default" className="mt-2 border-primary/50">
                <DatabaseZap className="h-4 w-4 !text-primary" />
                <AlertTitle className="text-primary">Simulated Data Notice</AlertTitle>
                <AlertDescription>
                    The "Fetched Current Price" (if available) is from the AI's tool, which currently uses a <strong>simulated data service</strong> (<code>src/services/crypto-data-service.ts</code>). All other figures (entry, exit, etc.) are illustrative AI suggestions based on this data. For live, accurate market data, the service needs to be connected to a real API provider.
                </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-4">
            <TradingViewSymbolOverview symbol={formSubmittedSymbol} key={formSubmittedSymbol} />
            <div>
              <h3 className="font-semibold text-lg font-headline mt-4">Strategy Explanation:</h3>
              <p className="text-muted-foreground">{suggestion.strategyExplanation}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestion.currentPrice !== undefined && suggestion.currentPrice !== null && (
                <InfoItem label="Fetched Current Price (AI Tool)" value={`$${suggestion.currentPrice.toLocaleString()}`} />
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
