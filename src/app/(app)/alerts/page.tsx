
'use client';

import PriceAlertsManager from "@/components/features/PriceAlertsManager";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold tracking-tight">Price Alerts</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Set up and manage price alerts for cryptocurrencies. (Client-side simulation)
          </p>
        </div>
      </div>
      <PriceAlertsManager />
    </div>
  );
}
