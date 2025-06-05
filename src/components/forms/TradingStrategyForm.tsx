
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { suggestTradingStrategy, type SuggestTradingStrategyInput, type SuggestTradingStrategyOutput } from "@/ai/flows/ai-trading-strategy-suggestion";
import { Loader2, Lightbulb, LineChart, AlertTriangle, TrendingUp, TrendingDown, MinusCircle, ShieldQuestion, ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import TradingPredictionCard from "@/components/features/TradingPredictionCard";

const tradingStrategyFormSchema = z.object({
  cryptocurrency: z.string().min(1, "Cryptocurrency symbol is required (e.g., BTC, ETH).").transform(val => val.toUpperCase()),
});

type TradingStrategyFormValues = z.infer<typeof tradingStrategyFormSchema>;

type UserUISentiment = "bullish" | "neutral" | "bearish";
type AISentiment = "bullish" | "bearish" | undefined; // For AI input
type UserRiskTolerance = "low" | "medium" | "high";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingStrategyForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [strategy, setStrategy] = React.useState<SuggestTradingStrategyOutput | null>(null);
  const [currentSymbolForWidget, setCurrentSymbolForWidget] = React.useState<string | null>(null);
  const [selectedUISentiment, setSelectedUISentiment] = React.useState<UserUISentiment>("neutral");
  const [selectedRiskTolerance, setSelectedRiskTolerance] = React.useState<UserRiskTolerance>("medium");
  const { toast } = useToast();

  const form = useForm<TradingStrategyFormValues>({
    resolver: zodResolver(tradingStrategyFormSchema),
    defaultValues: {
      cryptocurrency: "",
    },
  });

  const onSubmit: SubmitHandler<TradingStrategyFormValues> = async (data) => {
    setIsLoading(true);
    setStrategy(null);
    setCurrentSymbolForWidget(null);

    let aiSentiment: AISentiment;
    if (selectedUISentiment === 'bullish') {
      aiSentiment = 'bullish';
    } else if (selectedUISentiment === 'bearish') {
      aiSentiment = 'bearish';
    } else {
      aiSentiment = undefined; // Neutral means general analysis, no specific sentiment passed for that param
    }

    const inputForAI: SuggestTradingStrategyInput = {
      cryptocurrency: data.cryptocurrency,
      userSentiment: aiSentiment,
      riskTolerance: selectedRiskTolerance,
    };

    try {
      const output = await suggestTradingStrategy(inputForAI);
      setStrategy(output);
      if (output.tradePossible || output.currentPrice !== null) {
        setCurrentSymbolForWidget(data.cryptocurrency);
      }
      toast({
        title: "Strategy Suggested",
        description: `AI has generated a trading strategy for ${data.cryptocurrency}.`,
      });
    } catch (error) {
      console.error("Trading Strategy error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      setStrategy({
        tradePossible: false,
        suggestedPosition: "None",
        strategyExplanation: `Error generating strategy: ${errorMessage}`,
        currentPrice: null,
        entryPoint: null,
        exitPoint: null,
        stopLossLevel: null,
        profitTarget: null,
        confidenceLevel: "Very Low - Risk Warning",
        riskWarnings: ["Failed to generate strategy. Please check your input or try again later."],
        disclaimer: "An error occurred. All trading involves risk."
      });
      toast({
        title: "Strategy Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentSymbolForWidget && window.TradingView && typeof window.TradingView.MediumWidget === 'function') {
      const commonConfig = {
        symbols: [[`${currentSymbolForWidget.toUpperCase()}|1D`]],
        chartOnly: false,
        width: "100%",
        height: "100%", 
        locale: "en",
        colorTheme: "dark",
        autosize: true,
        showVolume: true,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily: "Inter, sans-serif",
        fontSize: "12",
        noTimeScale: false,
        valuesTracking: "1",
        changeMode: "price-and-percent",
        chartType: "area",
        maLineColor: "#2962FF",
        maLineWidth: 1,
        maLength: 9,
        backgroundColor: "rgba(0, 0, 0, 0)", 
        lineWidth: 2,
        lineType: 0,
        dateRanges: ["1d", "1w", "1m", "3m", "1y", "all"],
      };

      const widgetContainerId1 = `tradingview-chart1-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const container1 = document.getElementById(widgetContainerId1);
      if (container1) {
        container1.innerHTML = ''; 
        new window.TradingView.MediumWidget({
          ...commonConfig,
          container_id: widgetContainerId1,
        });
      }

      const widgetContainerId2 = `tradingview-chart2-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const container2 = document.getElementById(widgetContainerId2);
      if (container2) {
        container2.innerHTML = ''; 
        new window.TradingView.MediumWidget({
          ...commonConfig,
          container_id: widgetContainerId2,
        });
      }
    }
  }, [currentSymbolForWidget]);

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return 'N/A';
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 8 : 4 });
  };

  const getConfidenceColor = (level?: string) => {
    if (level === "Very Low - Risk Warning") return "text-destructive dark:text-red-400";
    if (level === "Low") return "text-orange-500 dark:text-orange-400";
    if (level === "Medium") return "text-yellow-500 dark:text-yellow-400";
    if (level === "High") return "text-green-500 dark:text-green-400";
    return "text-muted-foreground";
  }

  const getSentimentDisplayText = () => {
    if (selectedUISentiment === 'bullish') return "Bullish";
    if (selectedUISentiment === 'bearish') return "Bearish";
    return "Neutral / General";
  };

  const getRiskToleranceDisplayText = () => {
    if (selectedRiskTolerance === 'low') return "Low Risk";
    if (selectedRiskTolerance === 'medium') return "Medium Risk";
    if (selectedRiskTolerance === 'high') return "High Risk";
    return "Medium Risk"; 
  };


  return (
    <div className="space-y-8">
      <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2 text-foreground">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Trading Strategy
          </CardTitle>
          <CardDescription className="text-muted-foreground font-body">
            Get AI-powered trading strategy suggestions.
            The AI attempts to use live market data.
            Select your market view (optional) and risk tolerance.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-foreground font-body text-center block">Cryptocurrency Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BTC, ETH, SOL" {...field} className="text-base font-body max-w-md mx-auto"/>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormItem className="flex flex-col items-center space-y-2">
                  <FormLabel className="text-foreground font-body">Your Market View (Optional)</FormLabel>
                  <Tabs value={selectedUISentiment} onValueChange={(value) => setSelectedUISentiment(value as UserUISentiment)} className="w-auto max-w-md">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                      <TabsTrigger value="bullish" className="flex items-center data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md font-body">
                        <TrendingUp className="mr-1.5 h-4 w-4 text-green-500" /> Bullish
                      </TabsTrigger>
                      <TabsTrigger value="neutral" className="flex items-center data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md font-body">
                        <MinusCircle className="mr-1.5 h-4 w-4 text-yellow-500" /> Neutral / General
                      </TabsTrigger>
                      <TabsTrigger value="bearish" className="flex items-center data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md font-body">
                        <TrendingDown className="mr-1.5 h-4 w-4 text-red-500" /> Bearish
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>

                <FormItem className="flex flex-col items-center space-y-2">
                  <FormLabel className="text-foreground font-body">Your Risk Tolerance</FormLabel>
                  <Tabs value={selectedRiskTolerance} onValueChange={(value) => setSelectedRiskTolerance(value as UserRiskTolerance)} className="w-auto max-w-md">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                      <TabsTrigger value="low" className="flex items-center data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-md font-body">
                        <ShieldCheck className="mr-1.5 h-4 w-4 text-green-600" /> Low
                      </TabsTrigger>
                      <TabsTrigger value="medium" className="flex items-center data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-md font-body">
                        <ShieldHalf className="mr-1.5 h-4 w-4 text-yellow-600" /> Medium
                      </TabsTrigger>
                      <TabsTrigger value="high" className="flex items-center data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-md font-body">
                        <ShieldAlert className="mr-1.5 h-4 w-4 text-red-600" /> High
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              </div>

            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/80 text-primary-foreground font-body text-base py-3 px-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Strategy
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground font-body text-lg">AI is crafting your strategy...</p>
        </div>
      )}

      {strategy && !isLoading && (
        <>
          <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl mt-6">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-xl flex items-center justify-center gap-2 text-foreground">
                  <LineChart className="h-5 w-5 text-accent" />
                  AI Strategy for {form.getValues("cryptocurrency").toUpperCase()}
              </CardTitle>
              <div className="text-sm text-muted-foreground font-body text-center">
                Analysis based on:
                Market View: <span className="font-semibold text-foreground">{getSentimentDisplayText()}</span> |
                Risk Tolerance: <span className="font-semibold text-foreground">{getRiskToleranceDisplayText()}</span>
              </div>
              <Alert variant="default" className="mt-2 bg-background/50 border-border text-sm text-left">
                <AlertTitle className="font-semibold font-body text-foreground">Live Data Notice & Disclaimer</AlertTitle>
                <AlertDescription className="text-muted-foreground font-body">
                  Blocksmith AI and QuantumGPT are research-driven, AI-powered platforms. $BSAI is a utility token, not a security, and is intended for platform access and governance. Cryptocurrency investments carry inherent risk. QuantumGPT outputs are for educational use only and do not constitute financial advice. Users must perform their own due diligence and comply with regional regulations.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6 font-body">
              {currentSymbolForWidget && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div id={`tradingview-chart1-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="w-full h-[300px] md:h-[350px] rounded-md overflow-hidden shadow-inner bg-background/30"/>
                    <div id={`tradingview-chart2-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="w-full h-[300px] md:h-[350px] rounded-md overflow-hidden shadow-inner bg-background/30"/>
                  </div>
              )}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1 text-foreground">Strategy Explanation:</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line text-left">{strategy.strategyExplanation}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-center">
                <div>
                  <h4 className="font-medium text-primary">Fetched Current Price:</h4>
                  <p className="text-2xl font-bold text-foreground">{strategy.currentPrice !== undefined && strategy.currentPrice !== null ? `$${formatPrice(strategy.currentPrice)}` : 'N/A'}</p>
                </div>
                {strategy.confidenceLevel && (
                  <div>
                     <h4 className="font-medium text-foreground">AI Confidence Level:</h4>
                     <p className={`text-lg font-semibold ${getConfidenceColor(strategy.confidenceLevel)}`}>{strategy.confidenceLevel}</p>
                  </div>
                )}
              </div>

              {strategy.riskWarnings && strategy.riskWarnings.length > 0 && (
                <div className="text-center">
                  <h4 className="font-medium text-destructive flex items-center justify-center gap-2"><AlertTriangle className="h-5 w-5" /> Risk Warnings:</h4>
                  <ul className="list-disc list-inside text-sm text-destructive/90 dark:text-red-400/90 space-y-1 mt-1 text-left max-w-md mx-auto">
                    {strategy.riskWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1 text-foreground">Disclaimer:</h3>
                <p className="text-muted-foreground text-xs italic">{strategy.disclaimer}</p>
              </div>
            </CardContent>
          </Card>

          <TradingPredictionCard
            prediction={{
              trade: strategy.tradePossible,
              position: strategy.suggestedPosition || "None",
              entryPrice: strategy.entryPoint,
              exitPrice: strategy.exitPoint,
              stopLoss: strategy.stopLossLevel,
              takeProfit: strategy.profitTarget,
              confidenceLevel: strategy.confidenceLevel,
              riskWarnings: strategy.riskWarnings,
            }}
          />
        </>
      )}

      {!isLoading && !strategy && (
        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground font-body">
                    Enter a cryptocurrency symbol, select your market view (optional), and define your risk tolerance to get an AI-powered trading strategy.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
