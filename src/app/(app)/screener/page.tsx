
import CryptoScreenerForm from "@/components/forms/CryptoScreenerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function ScreenerPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight">AI Crypto Screener</h2>
          <p className="text-muted-foreground">
            Leverage artificial intelligence to discover cryptocurrencies based on your criteria.
          </p>
        </div>
      </div>
      <CryptoScreenerForm />
    </div>
  );
}
