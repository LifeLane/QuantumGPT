"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, BellRing } from "lucide-react"; // Removed Edit3
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
}

export default function PriceAlertsManager() {
  const [alerts, setAlerts] = React.useState<PriceAlert[]>([
    { id: "btc70k", symbol: "BTC", targetPrice: 70000, condition: "above", isActive: true },
    { id: "eth3k", symbol: "ETH", targetPrice: 3000, condition: "below", isActive: false },
  ]);
  const [newSymbol, setNewSymbol] = React.useState("");
  const [newTargetPrice, setNewTargetPrice] = React.useState("");
  const [newCondition, setNewCondition] = React.useState<"above" | "below">("above");
  const { toast } = useToast();

  // Mock price check interval for demo purposes
  React.useEffect(() => {
    const interval = setInterval(() => {
      alerts.forEach(alert => {
        if (alert.isActive) {
          // Simulate price fluctuation around the target for more frequent demo alerts
          const priceFluctuation = (Math.random() - 0.5) * (alert.targetPrice * 0.1); // +/- 5% of target
          const currentPrice = alert.targetPrice + priceFluctuation;
          
          let triggered = false;
          if (alert.condition === "above" && currentPrice > alert.targetPrice) {
            triggered = true;
          } else if (alert.condition === "below" && currentPrice < alert.targetPrice) {
            triggered = true;
          }

          if (triggered) {
            toast({
              title: `🔔 Price Alert: ${alert.symbol}`,
              description: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice.toLocaleString()}. Current price: $${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
              variant: "default",
              duration: 10000,
            });
            // Optionally deactivate alert after it triggers
            // toggleAlertStatus(alert.id, false); 
          }
        }
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]); // Removed toast from dependencies as it's stable


  const addPriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim() === "" || newTargetPrice.trim() === "") {
      toast({ title: "Error", description: "Symbol and target price cannot be empty.", variant: "destructive" });
      return;
    }
    const targetPriceNum = parseFloat(newTargetPrice);
    if (isNaN(targetPriceNum) || targetPriceNum <= 0) {
      toast({ title: "Error", description: "Invalid target price.", variant: "destructive" });
      return;
    }

    const newAlert: PriceAlert = {
      id: `${newSymbol.toLowerCase()}-${targetPriceNum}-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      targetPrice: targetPriceNum,
      condition: newCondition,
      isActive: true,
    };
    setAlerts([...alerts, newAlert]);
    setNewSymbol("");
    setNewTargetPrice("");
    toast({ title: "Success", description: `Alert for ${newAlert.symbol} set.` });
  };

  const removePriceAlert = (id: string) => {
    const alertToRemove = alerts.find(alert => alert.id === id);
    setAlerts(alerts.filter(alert => alert.id !== id));
     if (alertToRemove) {
        toast({ title: "Removed", description: `Alert for ${alertToRemove.symbol} removed.` });
    }
  };

  const toggleAlertStatus = (id: string, isActive: boolean) => {
    setAlerts(alerts.map(alert => alert.id === id ? { ...alert, isActive } : alert));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Price Alerts</CardTitle>
        <CardDescription>Get notified when cryptocurrencies reach your target prices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addPriceAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-md bg-card">
          <div>
            <Label htmlFor="alert-symbol">Symbol</Label>
            <Input
              id="alert-symbol"
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g., BTC"
              className="bg-background mt-1"
            />
          </div>
          <div>
            <Label htmlFor="alert-price">Target Price ($)</Label>
            <Input
              id="alert-price"
              type="number"
              value={newTargetPrice}
              onChange={(e) => setNewTargetPrice(e.target.value)}
              placeholder="e.g., 75000"
              className="bg-background mt-1"
            />
          </div>
          <div>
            <Label htmlFor="alert-condition">Condition</Label>
            <Select value={newCondition} onValueChange={(value: "above" | "below") => setNewCondition(value)}>
              <SelectTrigger id="alert-condition" className="bg-background mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Alert
          </Button>
        </form>

        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">You have no active price alerts. Create one to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Target Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-accent" />
                      {alert.symbol}
                    </TableCell>
                    <TableCell>
                      {alert.condition === "above" ? "Price >" : "Price <"}
                    </TableCell>
                    <TableCell className="text-right">${alert.targetPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={(checked) => toggleAlertStatus(alert.id, checked)}
                        aria-label={`Toggle alert for ${alert.symbol}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePriceAlert(alert.id)}
                        aria-label={`Remove alert for ${alert.symbol}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
  );
}
