
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { suggestTradingStrategy, type SuggestTradingStrategyInput, type SuggestTradingStrategyOutput } from "@/ai/flows/ai-trading-strategy-suggestion";
import { Loader2, Lightbulb, LineChart, AlertTriangle, TrendingUp, TrendingDown, MinusCircle, ShieldQuestion, ShieldAlert, ShieldCheck, ShieldHalf, Brain } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import TradingPredictionCard from "@/components/features/TradingPredictionCard";
import { Skeleton } from "@/components/ui/skeleton";

const tradingStrategyFormSchema = z.object({
  cryptocurrency: z.string().min(1, "Cryptocurrency symbol is required (e.g., BTC, ETH).").transform(val => val.toUpperCase()),
});

type TradingStrategyFormValues = z.infer<typeof tradingStrategyFormSchema>;

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
  const [selectedRiskTolerance, setSelectedRiskTolerance] = React.useState<UserRiskTolerance>("medium");
  const { toast } = useToast();

  const form = useForm<TradingStrategyFormValues>({
    resolver: zodResolver(tradingStrategyFormSchema),
    defaultValues: {
      cryptocurrency: "",
    },
  });
  const currentCryptoInput = form.watch("cryptocurrency");

  const onSubmit: SubmitHandler<TradingStrategyFormValues> = async (data) => {
    setIsLoading(true);
    setStrategy(null);
    setCurrentSymbolForWidget(null); 

    const inputForAI: SuggestTradingStrategyInput = {
      cryptocurrency: data.cryptocurrency,
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
        aiMarketSentiment: "Neutral", // Default AI sentiment on error
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
        disclaimer: "QuantumGPT, powered by Blocksmith AI, was developed following extensive research in quantitative finance, market intelligence, and applied machine learning. Our models are built to deliver adaptive trading insights, deep behavioral analytics, and tailored strategies through real-time data analysis and visualization.\n\nWhile QuantumGPT provides cutting-edge analytical tools, it is not a financial advisor. All outputs are for educational and informational purposes only. Trading and investing carry risks, and decisions should be made with careful due diligence and consideration of your financial situation. Blocksmith AI assumes no liability for losses or outcomes related to the use of QuantumGPT."
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
        chartType: "line", 
        maLineColor: "#2962FF",
        maLineWidth: 1,
        maLength: 9,
        backgroundColor: "rgba(0, 0, 0, 0)",
        lineWidth: 2,
        lineType: 0,
        dateRanges: ["1d", "1w", "1m", "3m", "1y", "all"],
      };

      const widgetContainerId = `tradingview-chart-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const container = document.getElementById(widgetContainerId);
      if (container) {
        container.innerHTML = ''; // Clear previous widget
        new window.TradingView.MediumWidget({
          ...commonConfig,
          symbols: [[`${currentSymbolForWidget.toUpperCase()}|1D`]], // Default to 1D view
          container_id: widgetContainerId,
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
  
  const getAIMarketSentimentIcon = (sentiment?: "Bullish" | "Bearish" | "Neutral") => {
    if (sentiment === "Bullish") return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (sentiment === "Bearish") return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <MinusCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getAIMarketSentimentText = (sentiment?: "Bullish" | "Bearish" | "Neutral") => {
    if (!sentiment) return "N/A";
    return sentiment;
  };


  const getRiskToleranceDisplayText = () => {
    if (selectedRiskTolerance === 'low') return "Low Risk";
    if (selectedRiskTolerance === 'medium') return "Medium Risk";
    if (selectedRiskTolerance === 'high') return "High Risk";
    return "Medium Risk";
  };


  return (
    <div className="space-y-6"> 
      <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-xl sm:text-2xl lg:text-3xl flex items-center justify-center gap-2 text-foreground">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Trading Strategy
          </CardTitle>
          <CardDescription className="text-muted-foreground font-body text-sm sm:text-base">
            Get AI-powered trading strategy suggestions.
            The AI attempts to use live market data and will determine its own market sentiment.
            Select your risk tolerance.
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

      {!isLoading && !strategy && (
        <>
        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl mt-6">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-xl sm:text-2xl lg:text-3xl flex items-center justify-center gap-2 text-foreground">
                <LineChart className="h-5 w-5 text-accent" />
                AI Strategy for {currentCryptoInput ? currentCryptoInput.toUpperCase() : "Your Crypto"}
            </CardTitle>
             <div className="text-sm text-muted-foreground font-body text-center">
                Analysis based on: Risk Tolerance: <span className="font-semibold text-foreground">{getRiskToleranceDisplayText()}</span>
              </div>
            <Alert variant="default" className="mt-2 bg-background/50 border-border text-sm text-left">
              <AlertTitle className="font-semibold font-body text-foreground">Live Data Notice & Disclaimer</AlertTitle>
              <AlertDescription className="text-muted-foreground font-body">
              QuantumGPT isn't just another trading tool — it’s a research-grade intelligence system crafted through months of dedicated blockchain modeling, market psychology analysis, and financial AI simulation.
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6 font-body">
            <div className="h-[400px] rounded-md overflow-hidden shadow-inner bg-background/30 flex flex-col items-center justify-center">
                 <Skeleton id={`tradingview-chart-${(currentCryptoInput || "default").toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="w-full h-full flex items-center justify-center text-muted-foreground">Price Chart: Awaiting Symbol</Skeleton>
            </div>
             <div className="text-sm text-muted-foreground text-center italic">
                Note: Chart above is a simplified line chart with volume. It defaults to a daily view, but you can use its controls to select other timeframes. For detailed candlestick charts, please use the "Charting Tools" page.
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground text-center">Strategy Explanation:</h3>
              <div className="bg-background/30 p-4 rounded-md border border-border shadow-sm min-h-[100px]">
                <Skeleton className="h-5 w-3/4 mb-2 bg-muted/40" />
                <Skeleton className="h-4 w-full mb-1 bg-muted/40" />
                <Skeleton className="h-4 w-full mb-1 bg-muted/40" />
                <Skeleton className="h-4 w-5/6 bg-muted/40" />
                <p className="text-muted-foreground text-sm mt-3 text-center">Enter your criteria above to generate an AI strategy.</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-center">
              <div>
                <h4 className="font-medium text-primary">Fetched Current Price:</h4>
                <p className="text-2xl font-bold text-foreground">N/A</p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="font-medium text-foreground flex items-center gap-1.5"><Brain className="h-5 w-5 text-accent"/> QuantumGPT Sentiment:</h4>
                <div className="flex items-center gap-1">
                   <MinusCircle className="h-5 w-5 text-yellow-500" /> 
                   <span className="text-lg font-semibold text-muted-foreground">N/A</span>
                </div>
              </div>
              <div>
                  <h4 className="font-medium text-foreground">AI Confidence Level:</h4>
                  <p className="text-lg font-semibold text-muted-foreground">N/A</p>
              </div>
            </div>
            <div className="text-center">
                <h4 className="font-medium text-destructive flex items-center justify-center gap-2"><AlertTriangle className="h-5 w-5" /> Risk Warnings:</h4>
                <p className="text-muted-foreground text-sm mt-1">Warnings (if any) will appear here.</p>
            </div>
            <Separator />
            <div className="text-center px-4">
              <p className="text-muted-foreground text-xs italic">
                QuantumGPT, powered by Blocksmith AI, was developed following extensive research in quantitative finance, market intelligence, and applied machine learning. Our models are built to deliver adaptive trading insights, deep behavioral analytics, and tailored strategies through real-time data analysis and visualization.
                <br/><br/>
                While QuantumGPT provides cutting-edge analytical tools, it is not a financial advisor. All outputs are for educational and informational purposes only. Trading and investing carry risks, and decisions should be made with careful due diligence and consideration of your financial situation. Blocksmith AI assumes no liability for losses or outcomes related to the use of QuantumGPT.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl mt-6">
            <CardHeader>
                <CardTitle className="font-headline text-lg text-center text-foreground">AI Trade Suggestion Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground font-body">Trade parameters and specific suggestions will appear here after analysis.</p>
            </CardContent>
        </Card>
        </>
      )}

      {strategy && !isLoading && (
        <>
          <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-xl mt-6">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-xl sm:text-2xl lg:text-3xl flex items-center justify-center gap-2 text-foreground">
                  <LineChart className="h-5 w-5 text-accent" />
                  AI Strategy for {form.getValues("cryptocurrency").toUpperCase()}
              </CardTitle>
              <div className="text-sm text-muted-foreground font-body text-center">
                Analysis based on: Risk Tolerance: <span className="font-semibold text-foreground">{getRiskToleranceDisplayText()}</span>
              </div>
              <Alert variant="default" className="mt-2 bg-background/50 border-border text-sm text-left">
                <AlertTitle className="font-semibold font-body text-foreground">Live Data Notice & Disclaimer</AlertTitle>
                <AlertDescription className="text-muted-foreground font-body">
                QuantumGPT isn't just another trading tool — it’s a research-grade intelligence system crafted through months of dedicated blockchain modeling, market psychology analysis, and financial AI simulation.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6 font-body">
              {currentSymbolForWidget && (
                  <div className="h-[400px] rounded-md overflow-hidden shadow-inner bg-background/30">
                      <div id={`tradingview-chart-${currentSymbolForWidget.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="w-full h-full"/>
                  </div>
              )}
               <div className="text-sm text-muted-foreground text-center italic">
                 Note: Chart above is a simplified line chart with volume. It defaults to a daily view, but you can use its controls to select other timeframes. For detailed candlestick charts, please use the "Charting Tools" page.
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground text-center mb-2">Strategy Explanation:</h3>
                <div className="bg-background/30 p-4 rounded-md border border-border shadow-sm">
                  <p className="text-muted-foreground text-sm whitespace-pre-line text-left leading-relaxed">{strategy.strategyExplanation}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-center">
                <div>
                  <h4 className="font-medium text-primary">Fetched Current Price:</h4>
                  <p className="text-2xl font-bold text-foreground">{strategy.currentPrice !== undefined && strategy.currentPrice !== null ? `$${formatPrice(strategy.currentPrice)}` : 'N/A'}</p>
                </div>
                 <div className="flex flex-col items-center">
                    <h4 className="font-medium text-foreground flex items-center gap-1.5"><Brain className="h-5 w-5 text-accent"/> QuantumGPT Sentiment:</h4>
                    <div className="flex items-center gap-1">
                        {getAIMarketSentimentIcon(strategy.aiMarketSentiment)}
                        <span className={`text-lg font-semibold ${
                            strategy.aiMarketSentiment === "Bullish" ? "text-green-500" :
                            strategy.aiMarketSentiment === "Bearish" ? "text-red-500" :
                            "text-yellow-500"
                        }`}>
                            {getAIMarketSentimentText(strategy.aiMarketSentiment)}
                        </span>
                    </div>
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

              <div className="text-center px-4">
                <p className="text-muted-foreground text-xs italic">{strategy.disclaimer}</p>
              </div>
            </CardContent>
          </Card>

          <TradingPredictionCard
            trade={strategy.tradePossible}
            position={strategy.suggestedPosition}
            entryPrice={strategy.entryPoint}
            exitPrice={strategy.exitPoint} // Assuming this is the general exit/take profit
            stopLoss={strategy.stopLossLevel}
            takeProfit={strategy.profitTarget}
            confidenceLevel={strategy.confidenceLevel}
            riskWarnings={strategy.riskWarnings}
          />
        </>
      )}
    </div>
  );
}
