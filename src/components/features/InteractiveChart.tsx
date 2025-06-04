
"use client";

import React, { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

declare global {
  interface Window {
    TradingView: any;
  }
}

function ChartComponent() {
  const container = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || "BINANCE:BTCUSDT"; // Default to BTCUSDT

  useEffect(() => {
    if (container.current && window.TradingView) {
      // Ensure the container is empty before appending a new widget
      container.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (container.current && window.TradingView && typeof window.TradingView.widget === 'function') {
          new window.TradingView.widget({
            "autosize": true,
            "symbol": initialSymbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": container.current.id,
            "studies": [
              "STD;MA%1Cross" // Example: Moving Average Cross
            ],
            "withdateranges": true,
          });
        } else {
          console.error("TradingView library not fully loaded or widget function unavailable.");
        }
      };
      document.body.appendChild(script);

      return () => {
        // Clean up the script when the component unmounts
        // Although TradingView widgets might manage their own lifecycle, this is good practice.
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        // Also clear the container if you want to be absolutely sure no remnants are left
        // if (container.current) {
        //   container.current.innerHTML = '';
        // }
      };
    }
  }, [initialSymbol]); // Re-run effect if initialSymbol changes

  return (
    <Card className="shadow-xl col-span-1 lg:col-span-3 h-[600px] lg:h-auto">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Advanced Real-Time Chart</CardTitle>
        <CardDescription>
          Analyze market trends with comprehensive TradingView charting tools. Current symbol: {initialSymbol}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]"> {/* Adjust height to fill card content area */}
        <div id="tradingview_adv_chart" ref={container} className="h-full w-full"/>
      </CardContent>
    </Card>
  );
}

export default function InteractiveChart() {
  return (
    // Suspense is necessary because useSearchParams() can suspend
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
      <ChartComponent />
    </Suspense>
  );
}
