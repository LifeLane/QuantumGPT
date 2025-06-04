
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { suggestTradingStrategy, type SuggestTradingStrategyInput, type SuggestTradingStrategyOutput } from "@/ai/flows/ai-trading-strategy-suggestion";
import { Loader2, Lightbulb, LineChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const tradingStrategyFormSchema = z.object({
  cryptocurrency: z.string().min(1, "Cryptocurrency symbol is required (e.g., BTC, ETH).").transform(val => val.toUpperCase()),
  riskTolerance: z.enum(["low", "medium", "high"], { required_error: "Risk tolerance is required." }),
});

type TradingStrategyFormValues = z.infer<typeof tradingStrategyFormSchema>;

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingStrategyForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [strategy, setStrategy] = React.useState<SuggestTradingStrategyOutput | null>(null);
  const [currentSymbolForWidget, setCurrentSymbolForWidget] = React.useState<string | null>(null);
  const toast = useToast();

  const form = useForm<TradingStrategyFormValues>({
    resolver: zodResolver(tradingStrategyFormSchema),
    defaultValues: {
      cryptocurrency: "",
      riskTolerance: "medium",
    },
  });

  const onSubmit: SubmitHandler<TradingStrategyFormValues> = async (data) => {
    setIsLoading(true);
    setStrategy(null);
    setCurrentSymbolForWidget(null);
    try {
      const output = await suggestTradingStrategy(data);
      setStrategy(output);
      setCurrentSymbolForWidget(data.cryptocurrency); // For the widget
      toast({
        title: "Strategy Suggested",
        description: `AI has generated a trading strategy for ${data.cryptocurrency}.`,
      });
    } catch (error) {
      console.error("Trading Strategy error:", error);
      toast({
        title: "Strategy Error",
        description: (error as Error).message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentSymbolForWidget && window.TradingView) {
      const widgetContainerId = `tradingview-symbol-overview-${currentSymbolForWidget.toLowerCase()}`;
      const container = document.getElementById(widgetContainerId);
      if (container && !container.querySelector('iframe')) { // Check if widget not already loaded
        new window.TradingView.MediumWidget({
          symbols: [[`${currentSymbolForWidget.toUpperCase()}USD|1D`]], // Attempt common pairing
          chartOnly: false,
          width: "100%",
          height: 300,
          locale: "en",
          colorTheme: "dark", // Match app theme
          autosize: true,
          showVolume: true,
          hideDateRanges: false,
          hideMarketStatus: false,
          hideSymbolLogo: false,
          scalePosition: "right",
          scaleMode: "Normal",
          fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          fontSize: "10",
          noTimeScale: false,
          valuesTracking: "1",
          changeMode: "price-and-percent",
          chartType: "area",
          maLineColor: "#2962FF",
          maLineWidth: 1,
          maLength: 9,
          backgroundColor: "rgba(0, 0, 0, 0)", // Transparent to blend with card
          lineWidth: 2,
          lineType: 0,
          dateRanges: ["1d", "1w", "1m", "3m", "1y", "all"],
          container_id: widgetContainerId,
        });
      }
    }
  }, [currentSymbolForWidget, strategy]); // Re-run if symbol or strategy changes

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'N/A';
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 8 : 4 });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Trading Strategy
          </CardTitle>
          <CardDescription>
            Get AI-powered trading strategy suggestions. 
            The AI attempts to use live market data via Messari API for current price.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BTC, ETH, SOL" {...field} className="text-base"/>
                    </FormControl>
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
                        <SelectTrigger className="text-base">
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
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Strategy
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">AI is crafting your strategy...</p>
        </div>
      )}

      {strategy && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <LineChart className="h-5 w-5 text-accent" />
                AI Strategy for {form.getValues("cryptocurrency").toUpperCase()}
            </CardTitle>
            <Alert variant="default" className="mt-2 bg-secondary/50">
              <AlertTitle className="font-semibold">Live Data Notice</AlertTitle>
              <AlertDescription>
                The "Fetched Current Price" is attempted to be sourced live via the Messari API. 
                If live data is unavailable or an API error occurs, fallback data may be used.
                All other figures (entry, exit, stop-loss, targets) are AI-generated illustrative examples based on this price and are NOT financial advice.
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSymbolForWidget && (
                <div id={`tradingview-symbol-overview-${currentSymbolForWidget.toLowerCase()}`} className="w-full h-[300px] rounded-md overflow-hidden shadow-inner bg-card"/>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-1">Strategy Explanation:</h3>
              <p className="text-muted-foreground text-sm">{strategy.strategyExplanation}</p>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h4 className="font-medium text-primary">Fetched Current Price:</h4>
                <p className="text-2xl font-bold">{strategy.currentPrice !== undefined && strategy.currentPrice !== null ? `$${formatPrice(strategy.currentPrice)}` : 'N/A (Tool did not provide)'}</p>
              </div>
              <div>
                <h4 className="font-medium">Suggested Entry Point:</h4>
                <p className="text-lg">${formatPrice(strategy.entryPoint)}</p>
              </div>
              <div>
                <h4 className="font-medium">Suggested Exit Point:</h4>
                <p className="text-lg">${formatPrice(strategy.exitPoint)}</p>
              </div>
              <div>
                <h4 className="font-medium">Suggested Stop-Loss:</h4>
                <p className="text-lg">${formatPrice(strategy.stopLossLevel)}</p>
              </div>
              <div>
                <h4 className="font-medium">Suggested Profit Target:</h4>
                <p className="text-lg">${formatPrice(strategy.profitTarget)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold text-lg mb-1">Disclaimer:</h3>
              <p className="text-muted-foreground text-xs italic">{strategy.disclaimer}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !strategy && (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                    Enter a cryptocurrency symbol and select your risk tolerance to get an AI-powered trading strategy.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
