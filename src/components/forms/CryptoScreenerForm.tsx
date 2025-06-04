"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cryptoScreener, type CryptoScreenerOutput } from "@/ai/flows/crypto-screener";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, InfoIcon } from "lucide-react";
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
      criteria: "Cryptocurrencies with strong upward momentum, positive news sentiment, and market cap over $1B. Use real-time data for price and volume.",
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
          <CardDescription>Define your criteria to find promising cryptocurrencies. The AI will attempt to use real-time data tools.</CardDescription>
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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
         <Alert variant="default" className="border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <InfoIcon className="h-4 w-4 !text-blue-500 dark:!text-blue-400" />
            <AlertTitle>Ready to Screen</AlertTitle>
            <AlertDescription>Enter your criteria above and click "Screen Cryptos" to see AI-powered results. Note: Real-time data fetching is simulated.</AlertDescription>
        </Alert>
      )}


      {results && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Screening Results</CardTitle>
            <CardDescription>
              The following cryptocurrencies were identified based on your criteria.
              Prices and volumes are fetched using a (simulated) real-time data tool.
            </CardDescription>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((crypto) => (
                      <TableRow key={crypto.symbol}>
                        <TableCell className="font-medium">{crypto.symbol}</TableCell>
                        <TableCell>${crypto.price ? crypto.price.toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>${crypto.volume ? crypto.volume.toLocaleString() : 'N/A'}</TableCell>
                        <TableCell className="max-w-xs text-sm">{crypto.summary}</TableCell>
                        <TableCell className="max-w-xs text-sm">{crypto.recentNews}</TableCell>
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
