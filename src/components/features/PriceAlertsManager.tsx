
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, PlusCircle, BellRing, Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  isActive: boolean;
}

// MOCK PRICE DATA - In a real app, this would come from a live feed.
const mockPrices: Record<string, number> = {
  "BTCUSDT": 68000,
  "ETHUSDT": 3800,
  "SOLUSDT": 160,
  "ADAUSDT": 0.45,
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function PriceAlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadAlertsFromLocalStorage = useCallback(() => {
    const storedAlerts = localStorage.getItem('priceAlerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  const saveAlertsToLocalStorage = useCallback((currentAlerts: Alert[]) => {
    localStorage.setItem('priceAlerts', JSON.stringify(currentAlerts));
  }, []);

  useEffect(() => {
    loadAlertsFromLocalStorage();
  }, [loadAlertsFromLocalStorage]);

  // Simulate price checking
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAlerts = alerts.filter(a => a.isActive);
      if (activeAlerts.length === 0) return;

      activeAlerts.forEach(alert => {
        const currentSymbol = alert.symbol.toUpperCase().replace('BINANCE:', '').replace('COINBASE:', ''); // Simplify for mock
        let currentPrice = mockPrices[currentSymbol];

        if (currentPrice === undefined) { // Simulate some price fluctuation if not in fixed mock
            currentPrice = parseFloat((Math.random() * 100).toFixed(2));
            mockPrices[currentSymbol] = currentPrice; // Update for next check
        } else {
             // Simulate slight fluctuation for known mocks
            mockPrices[currentSymbol] = currentPrice * (1 + (Math.random() - 0.5) * 0.001);
        }


        if (alert.condition === 'above' && currentPrice > alert.targetPrice) {
          toast({
            title: "Price Alert Triggered!",
            description: `${alert.symbol} is now above your target of $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
            variant: "default",
            duration: 10000,
          });
          // Optionally disable alert after triggering
          // handleToggleAlert(alert.id, false); 
        } else if (alert.condition === 'below' && currentPrice < alert.targetPrice) {
          toast({
            title: "Price Alert Triggered!",
            description: `${alert.symbol} is now below your target of $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
            variant: "default",
            duration: 10000,
          });
          // Optionally disable alert after triggering
          // handleToggleAlert(alert.id, false);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [alerts, toast]);

  const resetForm = () => {
    setSymbol('');
    setCondition('above');
    setTargetPrice('');
    setEditingAlertId(null);
  };

  const handleSubmitAlert = () => {
    if (!symbol || !targetPrice || isNaN(parseFloat(targetPrice))) {
      toast({ title: "Invalid Input", description: "Please fill all fields correctly.", variant: "destructive" });
      return;
    }

    const newAlert: Alert = {
      id: editingAlertId || generateId(),
      symbol: symbol.toUpperCase(),
      condition,
      targetPrice: parseFloat(targetPrice),
      isActive: true,
    };

    let updatedAlerts;
    if (editingAlertId) {
      updatedAlerts = alerts.map(a => a.id === editingAlertId ? newAlert : a);
      toast({ title: "Alert Updated", description: `Alert for ${newAlert.symbol} updated.` });
    } else {
      updatedAlerts = [...alerts, newAlert];
      toast({ title: "Alert Created", description: `Alert for ${newAlert.symbol} set.` });
    }
    
    setAlerts(updatedAlerts);
    saveAlertsToLocalStorage(updatedAlerts);
    resetForm();
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlertId(alert.id);
    setSymbol(alert.symbol);
    setCondition(alert.condition);
    setTargetPrice(alert.targetPrice.toString());
  };
  
  const handleRemoveAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== alertId);
    setAlerts(updatedAlerts);
    saveAlertsToLocalStorage(updatedAlerts);
    toast({ title: "Alert Removed", description: "Price alert has been removed." });
    if (editingAlertId === alertId) resetForm();
  };

  const handleToggleAlert = (alertId: string, forceState?: boolean) => {
    const updatedAlerts = alerts.map(a => 
      a.id === alertId ? { ...a, isActive: forceState !== undefined ? forceState : !a.isActive } : a
    );
    setAlerts(updatedAlerts);
    saveAlertsToLocalStorage(updatedAlerts);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            {editingAlertId ? "Edit Price Alert" : "Create New Price Alert"}
          </CardTitle>
          <CardDescription>
            Get notified when a cryptocurrency reaches your target price. Alerts are browser-based and use simulated price movements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="symbol" className="text-sm font-medium">Symbol</label>
              <Input
                id="symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., BTCUSDT"
                className="text-base"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="condition" className="text-sm font-medium">Condition</label>
              <Select value={condition} onValueChange={(value: 'above' | 'below') => setCondition(value)}>
                <SelectTrigger id="condition" className="text-base">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price is Above</SelectItem>
                  <SelectItem value="below">Price is Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="targetPrice" className="text-sm font-medium">Target Price (USD)</label>
              <Input
                id="targetPrice"
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g., 70000"
                className="text-base"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmitAlert} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingAlertId ? "Update Alert" : "Set Alert"}
            </Button>
            {editingAlertId && (
              <Button variant="outline" onClick={resetForm}>Cancel Edit</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <BellRing className="h-5 w-5 text-accent" />
                Active Price Alerts
            </CardTitle>
            <CardDescription>
                These alerts will trigger a notification based on simulated price changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${alert.isActive ? 'bg-secondary/30 border-secondary' : 'bg-muted/50 border-muted'}`}>
                <div className="flex-1">
                  <span className={`font-semibold text-lg ${alert.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{alert.symbol}</span>
                  <p className={`text-sm ${alert.isActive ? 'text-muted-foreground' : 'text-muted-foreground/70 line-through'}`}>
                    Notify if price is {alert.condition} ${alert.targetPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button 
                        variant={alert.isActive ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => handleToggleAlert(alert.id)}
                        className={alert.isActive ? "border-yellow-500 hover:bg-yellow-500/10 text-yellow-600" : "bg-green-600 hover:bg-green-700"}
                    >
                        {alert.isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditAlert(alert)}>
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveAlert(alert.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
