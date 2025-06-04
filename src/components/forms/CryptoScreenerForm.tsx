
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cryptoScreener, type CryptoScreenerOutput } from "@/ai/flows/crypto-screener";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, InfoIcon, ExternalLink, DatabaseZap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  criteria: z.string().min(10, "Please provide more detailed criteria (min 10 characters).").max(500, "Criteria too long (max 500 characters)."),
});

type FormData = z.infer<typeof formSchema>;

export default function CryptoScreenerForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<CryptoScreenerOutput['results'] | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      criteria: "Identify cryptocurrencies with potential based on market trends and volume. Fetch current prices.",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const output = await cryptoScreener(data);
      setResults(output.results);
    } catch (e) {
      console.error("Crypto Screener Error:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred during screening. The AI model might have failed to process the request or use tools correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">AI Crypto Screener</CardTitle>
          <CardDescription>Define your criteria. The AI will attempt to use its market data tool (currently using simulated real-time data from <code>src/services/crypto-data-service.ts</code>).</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screening Criteria</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Low cap gems with recent high volume and bullish indicators. Fetch current prices."
                        rows={4}
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Screen Cryptos
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
      
      {!isLoading && results === null && !error && (
         <Alert variant="default" className="border-accent">
            <InfoIcon className="h-4 w-4 !text-accent" />
            <AlertTitle>Ready to Screen</AlertTitle>
            <AlertDescription>Enter your criteria above and click "Screen Cryptos" to see AI-powered results. Market data for AI analysis is currently fetched using a <strong>simulated data service</strong>. For live data, please integrate a real API in <code>src/services/crypto-data-service.ts</code>.</AlertDescription>
        </Alert>
      )}


      {results && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Screening Results</CardTitle>
            <CardDescription>
              The following cryptocurrencies were identified. 
            </CardDescription>
             <Alert variant="default" className="mt-2 border-primary/50">
                <DatabaseZap className="h-4 w-4 !text-primary" />
                <AlertTitle className="text-primary">Simulated Data Notice</AlertTitle>
                <AlertDescription>
                    Prices and volumes displayed below are from the AI's analysis tool, which currently uses a <strong>simulated data service</strong> (<code>src/services/crypto-data-service.ts</code>). For live, accurate market data, this service needs to be connected to a real API provider.
                </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p>No cryptocurrencies found matching your criteria, or the AI could not process the request.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Price (USD)</TableHead>
                      <TableHead>Volume (24h USD)</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Recent News/Context</TableHead>
                      <TableHead className="text-right">Chart</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((crypto) => (
                      <TableRow key={crypto.symbol}>
                        <TableCell className="font-medium">{crypto.symbol}</TableCell>
                        <TableCell>${(crypto.price !== undefined && crypto.price !== null) ? crypto.price.toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>${(crypto.volume !== undefined && crypto.volume !== null) ? crypto.volume.toLocaleString() : 'N/A'}</TableCell>
                        <TableCell className="max-w-xs text-sm">{crypto.summary}</TableCell>
                        <TableCell className="max-w-xs text-sm">{crypto.recentNews}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/charting?symbol=${encodeURIComponent(crypto.symbol.includes(':') ? crypto.symbol : `BINANCE:${crypto.symbol}USDT`)}`} target="_blank" rel="noopener noreferrer">
                              View Chart <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
