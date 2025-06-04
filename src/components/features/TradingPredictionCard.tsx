import React from 'react';
import PredictionChat from './PredictionChat';

interface Prediction {
  trade: boolean;
  position: 'Long' | 'Short' | 'None';
  entryPrice: number | null;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
}

interface TradingPredictionCardProps {
  prediction: Prediction;
}

const TradingPredictionCard: React.FC<TradingPredictionCardProps> = ({ prediction }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Trading Prediction</h3>
        {prediction.trade ? (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${prediction.position === 'Long' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
            {prediction.position}
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            No Trade
          </span>
        )}
      </div>

      {prediction.trade && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Entry Price:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {prediction.entryPrice !== null ? `$${prediction.entryPrice.toFixed(2)}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Exit Price:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {prediction.exitPrice !== null ? `$${prediction.exitPrice.toFixed(2)}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Stop Loss:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {prediction.stopLoss !== null ? `$${prediction.stopLoss.toFixed(2)}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Take Profit:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {prediction.takeProfit !== null ? `$${prediction.takeProfit.toFixed(2)}` : 'N/A'}
            </p>
          </div>
        </div>
      )}
      <PredictionChat />
    </div>
  );
};

export default TradingPredictionCard;