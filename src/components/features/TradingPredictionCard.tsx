
import React from 'react';
import PredictionChat from './PredictionChat';
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

interface TradingPredictionCardProps {
  prediction: Prediction;
}

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

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return 'N/A';
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 8 : 4 });
  };

  // Helper function to determine label suffix and color for Short positions
  const getShortSpecifics = (
    type: 'sl' | 'tp',
    entry: number | null,
    value: number | null
  ): { labelSuffix: string; percentText: string; colorClass: string } => {
    let labelSuffix = ':';
    let percentText = '';
    let colorClass = 'text-muted-foreground';

    if (entry === null || value === null) {
      return { labelSuffix, percentText, colorClass };
    }

    const difference = value - entry; // For SL, positive diff is loss. For TP, negative diff is profit.
    const percent = (difference / entry) * 100;
    
    if (type === 'sl') { // Stop Loss for Short
      percentText = `(${percent.toFixed(2)}%)`; // Percentage relative to entry. Positive means price rose.
      if (difference > 0) { // Price rose to SL: loss
        labelSuffix = ' (Above Entry):';
        colorClass = 'text-destructive';
      } else if (difference < 0) { // Price fell to SL: anomaly (gain)
        labelSuffix = ' (Below Entry - Anomaly for SL):';
        colorClass = 'text-green-500';
      } else { // At entry
        labelSuffix = ' (At Entry):';
        colorClass = 'text-muted-foreground';
      }
    } else if (type === 'tp') { // Take Profit for Short
      // For TP, we typically think of (Entry - TP) / Entry for profit %
      const profitPercent = ((entry - value) / entry) * 100;
      percentText = `(${profitPercent.toFixed(2)}%)`; // Positive means profit target is below entry.

      if (value < entry) { // TP is below entry: profit
        labelSuffix = ' (Below Entry):';
        colorClass = 'text-green-500';
      } else if (value > entry) { // TP is above entry: anomaly (loss)
        labelSuffix = ' (Above Entry - Anomaly for TP):';
        colorClass = 'text-destructive';
      } else { // At entry
        labelSuffix = ' (At Entry):';
        colorClass = 'text-muted-foreground';
      }
    }
    return { labelSuffix, percentText, colorClass };
  };


  const slShortSpecifics = prediction.position === 'Short' ? getShortSpecifics('sl', prediction.entryPrice, prediction.stopLoss) : null;
  const tpShortSpecifics = prediction.position === 'Short' ? getShortSpecifics('tp', prediction.entryPrice, prediction.takeProfit) : null;

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
          
          {/* Stop Loss */}
          <div>
            <p className="text-muted-foreground dark:text-gray-400">
              Stop Loss{prediction.position === 'Short' && slShortSpecifics ? slShortSpecifics.labelSuffix : ':'}
            </p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.stopLoss)}`}{' '}
              {prediction.entryPrice !== null && prediction.stopLoss !== null && (
                <span className={`text-xs font-normal ${
                  prediction.position === 'Short' && slShortSpecifics ? slShortSpecifics.colorClass :
                  prediction.stopLoss < prediction.entryPrice ? 'text-destructive' : // Long: SL below entry is loss
                  prediction.stopLoss > prediction.entryPrice ? 'text-green-500' : // Long: SL above entry is 'gain' (anomaly for SL)
                  'text-muted-foreground' // Long: SL at entry
                }`}>
                  {prediction.position === 'Short' && slShortSpecifics ? slShortSpecifics.percentText :
                   `(${(( (prediction.stopLoss - prediction.entryPrice) / prediction.entryPrice ) * 100).toFixed(2)}%)`
                  }
                </span>
              )}
            </p>
          </div>

          {/* Take Profit */}
          <div>
            <p className="text-muted-foreground dark:text-gray-400">
              Profit Target{prediction.position === 'Short' && tpShortSpecifics ? tpShortSpecifics.labelSuffix : ':'}
            </p>
            <p className="font-medium text-card-foreground dark:text-white">
              {`$${formatPrice(prediction.takeProfit)}`}{' '}
              {prediction.entryPrice !== null && prediction.takeProfit !== null && (
                 <span className={`text-xs font-normal ${
                    prediction.position === 'Short' && tpShortSpecifics ? tpShortSpecifics.colorClass :
                    prediction.takeProfit > prediction.entryPrice ? 'text-green-500' : // Long: TP above entry is profit
                    prediction.takeProfit < prediction.entryPrice ? 'text-destructive' : // Long: TP below entry is 'loss' (anomaly for TP)
                    'text-muted-foreground' // Long: TP at entry
                  }`}>
                    {prediction.position === 'Short' && tpShortSpecifics ? tpShortSpecifics.percentText :
                    `(${(((prediction.takeProfit - prediction.entryPrice) / prediction.entryPrice) * 100).toFixed(2)}%)`
                    }
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
