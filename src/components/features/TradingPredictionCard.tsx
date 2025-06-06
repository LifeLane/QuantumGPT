
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';

interface Prediction {
  trade: boolean;
  position: 'Long' | 'Short' | 'None';
  entryPrice: number | null;
  exitPrice: number | null; // General exit, could be TP or SL
  stopLoss: number | null;
  takeProfit: number | null;
  confidenceLevel?: string;
  riskWarnings?: string[];
}

const formatPrice = (price?: number | null) => {
  if (price === undefined || price === null) return 'N/A';
  // Ensure price is treated as a number for toLocaleString
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) return 'N/A';
  return numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: numericPrice < 1 ? 8 : 4 });
};

const getPricePointDetails = (
  position: 'Long' | 'Short' | 'None',
  type: 'sl' | 'tp', // 'sl' for Stop Loss, 'tp' for Take Profit
  entry: number | null,
  value: number | null // The actual SL or TP price
): { labelSuffix: string; percentText: string; colorClass: string } => {
  let labelSuffix = ':';
  let percentText = '';
  let colorClass = 'text-muted-foreground';

  if (entry === null || value === null || position === 'None' || entry === 0) {
    return { labelSuffix, percentText, colorClass };
  }

  let pnlPercent: number;
  if (position === 'Long') {
    pnlPercent = ((value - entry) / entry) * 100;
  } else { // Short position
    pnlPercent = ((entry - value) / entry) * 100; // P/L for short: positive is profit, negative is loss
  }

  if (isNaN(pnlPercent) || !isFinite(pnlPercent)) {
    percentText = '(N/A)';
    // colorClass remains 'text-muted-foreground'
  } else {
    const plusSign = pnlPercent > 0 ? '+' : '';
    percentText = pnlPercent !== 0 ? `(${plusSign}${pnlPercent.toFixed(2)}%)` : '(0.00%)';
  }
  

  // Determine color based on P/L (positive P/L is profit, negative P/L is loss)
  if (pnlPercent > 0) {
    colorClass = 'text-green-500'; 
  } else if (pnlPercent < 0) {
    colorClass = 'text-destructive'; 
  } else { 
    colorClass = 'text-muted-foreground';
  }

  // Determine label suffix including anomaly checks
  if (position === 'Long') {
    if (type === 'sl') { 
      // Standard SL for Long is below entry (loss). Anomalous if above (profit).
      labelSuffix = value < entry ? ' (Below Entry):' : 
                    value > entry ? ' (Above Entry - Anomaly for SL):' : 
                    ' (At Entry):';
    } else { // tp for Long
      // Standard TP for Long is above entry (profit). Anomalous if below (loss).
      labelSuffix = value > entry ? ' (Above Entry):' : 
                    value < entry ? ' (Below Entry - Anomaly for TP):' : 
                    ' (At Entry):';
    }
  } else { // Short position
    if (type === 'sl') { 
      // Standard SL for Short is above entry (loss). Anomalous if below (profit).
      labelSuffix = value > entry ? ' (Above Entry):' : 
                    value < entry ? ' (Below Entry - Anomaly for SL):' : 
                    ' (At Entry):';
    } else { // tp for Short
      // Standard TP for Short is below entry (profit). Anomalous if above (loss).
      labelSuffix = value < entry ? ' (Below Entry):' : 
                    value > entry ? ' (Above Entry - Anomaly for TP):' : 
                    ' (At Entry):';
    }
  }
  return { labelSuffix, percentText, colorClass };
};


const TradingPredictionCard: React.FC<TradingPredictionCardProps> = ({ prediction }) => {
  const getPositionBadge = () => {
    if (!prediction.trade || prediction.position === 'None') {
      return (
        <Badge variant="outline" className="px-3 py-1 text-sm font-semibold border-muted-foreground/50 text-muted-foreground flex items-center gap-1">
          <MinusCircle className="h-4 w-4" />
          No Trade Suggested
        </Badge>
      );
    }
    if (prediction.position === 'Long') {
      return (
        <Badge className="px-3 py-1 text-sm font-semibold bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 border border-green-500/30 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Long
        </Badge>
      );
    }
    if (prediction.position === 'Short') {
      return (
        <Badge className="px-3 py-1 text-sm font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
          <TrendingDown className="h-4 w-4" />
          Short
        </Badge>
      );
    }
    return null;
  };

  const slDetails = getPricePointDetails(prediction.position, 'sl', prediction.entryPrice, prediction.stopLoss);
  const tpDetails = getPricePointDetails(prediction.position, 'tp', prediction.entryPrice, prediction.takeProfit);

  return (
    <div className="bg-card dark:bg-slate-800/80 rounded-lg shadow-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-card-foreground dark:text-white">AI Trade Suggestion Overview</h3>
        {getPositionBadge()}
      </div>

      {prediction.confidenceLevel && (
        <div className={`mb-3 p-2 rounded-md text-sm ${
          prediction.confidenceLevel === "Very Low - Risk Warning" ? "bg-destructive/20 text-destructive-foreground border border-destructive/50" :
          prediction.confidenceLevel === "Low" ? "bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/30" :
          prediction.confidenceLevel === "Medium" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30" :
          "bg-primary/10 text-primary border border-primary/20"
        }`}>
          <strong>Confidence:</strong> {prediction.confidenceLevel}
        </div>
      )}

      {prediction.riskWarnings && prediction.riskWarnings.length > 0 && (
        <div className="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <AlertTriangle className="h-5 w-5" />
            Risk Warnings:
          </div>
          <ul className="list-disc list-inside text-sm space-y-1">
            {prediction.riskWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {prediction.trade && prediction.position !== 'None' && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground dark:text-gray-400">Entry Price:</p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.entryPrice)}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground dark:text-gray-400">Target Exit (General):</p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.exitPrice)}`}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground dark:text-gray-400">
              Stop Loss{slDetails.labelSuffix}
            </p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.stopLoss)}`}{' '}
              {(prediction.entryPrice !== null && prediction.stopLoss !== null && prediction.entryPrice !== 0) && (
                <span className={`text-xs font-normal ${slDetails.colorClass}`}>
                  {slDetails.percentText}
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground dark:text-gray-400">
              Profit Target{tpDetails.labelSuffix}
            </p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.takeProfit)}`}{' '}
              {(prediction.entryPrice !== null && prediction.takeProfit !== null && prediction.entryPrice !== 0) && (
                 <span className={`text-xs font-normal ${tpDetails.colorClass}`}>
                    {tpDetails.percentText}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      {(!prediction.trade || prediction.position === 'None') && !prediction.riskWarnings?.length && (
         <p className="text-muted-foreground text-center py-4">No specific trade parameters advised by AI at this time.</p>
      )}
    </div>
  );
};

export default TradingPredictionCard;
