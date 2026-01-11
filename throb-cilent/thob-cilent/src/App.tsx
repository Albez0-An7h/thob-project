import { useState } from 'react';
import SofaViewer from './components/SofaViewer';
import Configurator from './components/Configurator';
import PricingSummary from './components/PricingSummary';
import type { Configuration, ConfigurationResponse } from './types';

function App() {
  const [configuration, setConfiguration] = useState<Configuration>({
    material: '',
    color: '',
    size: '',
    addons: [],
  });

  const [pricingData, setPricingData] = useState<ConfigurationResponse | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 px-8 py-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Sofa Configurator</h1>
        <p className="text-lg text-gray-600">Design your perfect sofa</p>
      </header>

      <div className="p-6 lg:p-8 max-w-[1800px] mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 p-6 lg:p-8">
            <div className="lg:col-span-1">
              <SofaViewer configuration={configuration} />
            </div>

            <div className="lg:col-span-2">
              <Configurator
                onConfigurationChange={setConfiguration}
                onPriceUpdate={setPricingData}
              />
            </div>

            <div className="lg:col-span-1">
              <PricingSummary pricingData={pricingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;