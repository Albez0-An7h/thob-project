import React from 'react';
import type { ConfigurationResponse } from '../types';

interface PricingSummaryProps {
  pricingData: ConfigurationResponse | null;
}

const PricingSummary: React.FC<PricingSummaryProps> = ({ pricingData }) => {
  if (!pricingData) {
    return (
      <div className="h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Price Summary</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 italic text-center">Complete your configuration to see pricing</p>
        </div>
      </div>
    );
  }

  const { pricing } = pricingData;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Price Summary</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-semibold text-gray-800">${pricing.basePrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Material Cost:</span>
            <span className="font-semibold text-gray-800">×{pricing.materialMultiplier}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Size Adjustment:</span>
            <span className="font-semibold text-gray-800">×{pricing.sizeMultiplier}</span>
          </div>
          
          {pricing.addonsTotal > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Add-ons:</span>
              <span className="font-semibold text-gray-800">+${pricing.addonsTotal.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-4 my-2 border-t border-b border-gray-300">
            <span className="text-gray-700 font-semibold text-lg">Subtotal:</span>
            <span className="font-bold text-gray-800 text-lg">${pricing.subtotal.toFixed(2)}</span>
          </div>
          
          {pricing.discounts && pricing.discounts.total > 0 && (
            <>
              <div className="bg-green-50 p-4 rounded-lg my-4 space-y-2">
                <h4 className="text-green-800 text-sm font-semibold mb-2">Discounts Applied:</h4>
                {pricing.discounts.stockClearance && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm">Stock Clearance:</span>
                    <span className="text-green-700 font-semibold">-${pricing.discounts.stockClearance.toFixed(2)}</span>
                  </div>
                )}
                {pricing.discounts.seasonal && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm">Seasonal Discount:</span>
                    <span className="text-green-700 font-semibold">-${pricing.discounts.seasonal.toFixed(2)}</span>
                  </div>
                )}
                {pricing.discounts.bundle && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm">Bundle Discount:</span>
                    <span className="text-green-700 font-semibold">-${pricing.discounts.bundle.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {pricing.savings && (
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg text-center font-semibold my-4 animate-pulse">
                  You save ${pricing.savings.toFixed(2)}!
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-indigo-500">
            <span className="text-gray-800 font-bold text-xl">Final Price:</span>
            <span className="font-bold text-indigo-600 text-2xl">${pricing.finalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default PricingSummary;
