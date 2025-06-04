
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cryptoScreener, type CryptoScreenerInput, type CryptoScreenerOutput } from "@/ai/flows/crypto-screener";
import { Loader2, Search, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const screenerFormSchema = z.object({
  criteria: z.string().min(10, "Please provide more detailed screening criteria (min 10 characters)."),
});

type ScreenerFormValues = z.infer<typeof screenerFormSchema>;

export default function CryptoScreenerForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<CryptoScreenerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ScreenerFormValues>({
    resolver: zodResolver(screenerFormSchema),
    defaultValues: {
      criteria: "Identify 3-5 cryptocurrencies with strong recent upward momentum, positive news sentiment, and high trading volume.",
    },
  });

  const onSubmit: SubmitHandler<ScreenerFormValues> = async (data) => {
    setIsLoading(true);
    setResults(null);
    try {
      const output = await cryptoScreener(data);
      setResults(output);
      toast({
        title: "Screening Complete",
        description: `Found ${output.results.length} potential cryptocurrencies.`,
      });
    } catch (error) {
      console.error("Crypto Screener error:", error);
      toast({
        title: "Screening Error",
        description: (error as Error).message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            AI Crypto Screener
          </CardTitle>
          <CardDescription>
            Define your criteria and let our AI find promising cryptocurrencies. 
            The AI attempts to use live market data via Messari API.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screening Criteria</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., low-cap gems with recent exchange listings" 
                        {...field} 
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Screen Cryptocurrencies
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">AI is analyzing the market...</p>
        </div>
      )}

      {results && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Screening Results</CardTitle>
            <Alert variant="default" className="mt-2 bg-secondary/50">
              <AlertTitle className="font-semibold">Live Data Notice</AlertTitle>
              <AlertDescription>
                Market data (price, volume) for these results is attempted to be fetched live via the Messari API. 
                If live data is unavailable for an asset or an API error occurs, the AI may use fallback data or omit values. 
                News summaries are AI-generated based on general knowledge. Always DYOR.
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent>
            {results.results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">Volume (24h)</TableHead>
                    <TableHead>AI Summary</TableHead>
                    <TableHead>Recent News/Context</TableHead>
                    <TableHead>Chart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.results.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.symbol.toUpperCase()}</TableCell>
                      <TableCell className="text-right">
                        {item.price !== undefined && item.price !== null ? `$${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: item.price < 1 ? 8 : 2 })}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.volume !== undefined && item.volume !== null ? `$${item.volume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs break-words">{item.summary}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs break-words">{item.recentNews}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/charting?symbol=${encodeURIComponent(item.symbol.includes(':') ? item.symbol : `BINANCE:${item.symbol.toUpperCase()}USDT`)}`} title={`View chart for ${item.symbol}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No cryptocurrencies matched your criteria, or the AI could not fetch results.</p>
            )}
          </CardContent>
        </Card>
      )}
       {!isLoading && !results && (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                    Enter your criteria above and click "Screen Cryptocurrencies" to see AI-powered results.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
