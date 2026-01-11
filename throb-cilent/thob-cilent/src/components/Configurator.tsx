import React, { useState, useEffect } from 'react';
import type { Material, Size, Addon, Configuration, ConfigurationResponse } from '../types';
import { getMaterials, getSizes, getAddons, submitConfiguration } from '../services/api';

interface ConfiguratorProps {
  onConfigurationChange: (config: Configuration) => void;
  onPriceUpdate: (response: ConfigurationResponse | null) => void;
}

const Configurator: React.FC<ConfiguratorProps> = ({ onConfigurationChange, onPriceUpdate }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const [configuration, setConfiguration] = useState<Configuration>({
    material: '',
    color: '',
    size: '',
    addons: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    onConfigurationChange(configuration);
    if (isConfigurationComplete()) {
      calculatePrice();
    } else {
      onPriceUpdate(null);
    }
  }, [configuration]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [materialsData, sizesData, addonsData] = await Promise.all([
        getMaterials(),
        getSizes(),
        getAddons(),
      ]);
      setMaterials(materialsData);
      setSizes(sizesData);
      setAddons(addonsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const isConfigurationComplete = () => {
    return configuration.material && configuration.color && configuration.size;
  };

  const calculatePrice = async () => {
    if (!isConfigurationComplete()) return;

    try {
      setConfigError(null);
      const response = await submitConfiguration(configuration);
      onPriceUpdate(response);
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : 'Failed to calculate price');
      onPriceUpdate(null);
    }
  };

  const selectedMaterial = materials.find(m => m.name === configuration.material);
  const availableColors = selectedMaterial?.allowedColors || [];

  const handleMaterialChange = (materialName: string) => {
    setConfiguration(prev => ({
      ...prev,
      material: materialName,
      color: '',
    }));
  };

  const handleAddonToggle = (addonName: string) => {
    setConfiguration(prev => ({
      ...prev,
      addons: prev.addons.includes(addonName)
        ? prev.addons.filter(name => name !== addonName)
        : [...prev.addons, addonName],
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-600">Loading configurator...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button onClick={loadData} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 lg:mb-8 text-center">Configure Your Sofa</h2>

      {/* Material Selection */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">1. Choose Material</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(material => (
            <button
              key={material.name}
              className={`bg-gray-100 border-2 rounded-lg p-6 text-left transition-all hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg ${
                configuration.material === material.name ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500' : 'border-gray-300'
              }`}
              onClick={() => handleMaterialChange(material.name)}
            >
              <div className="text-lg font-semibold mb-2 capitalize">{material.name}</div>
              <div className={`text-sm ${configuration.material === material.name ? 'text-white/90' : 'text-gray-600'}`}>
                {material.description && <p>{material.description}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {configuration.material && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">2. Choose Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {availableColors.map(color => (
              <button
                key={color}
                className={`bg-gray-100 border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:border-indigo-500 hover:scale-105 ${
                  configuration.color === color ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-gray-300'
                }`}
                onClick={() => setConfiguration(prev => ({ ...prev, color }))}
                title={color}
              >
                <div 
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md" 
                  style={{ backgroundColor: color.toLowerCase() }} 
                />
                <span className="text-sm font-medium capitalize text-gray-800">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">3. Choose Size</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sizes.map(size => (
            <button
              key={size.name}
              className={`bg-gray-100 border-2 rounded-lg p-6 text-left transition-all hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg ${
                configuration.size === size.name ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500' : 'border-gray-300'
              }`}
              onClick={() => setConfiguration(prev => ({ ...prev, size: size.name }))}
            >
              <div className="text-lg font-semibold mb-2 capitalize">{size.name.replace('_', ' ')}</div>
              <div className={`text-sm ${configuration.size === size.name ? 'text-white/90' : 'text-gray-600'}`}>
                <p className="font-mono text-xs mb-2">
                  {size.seats} seats • {size.widthCm}cm wide
                </p>
                {size.description && <p className="leading-relaxed">{size.description}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">4. Add-ons (Optional)</h3>
        <div className="space-y-4">
          {addons.map(addon => (
            <label key={addon.name} className="flex items-start bg-gray-100 border-2 border-gray-300 rounded-lg p-4 cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50">
              <input
                type="checkbox"
                checked={configuration.addons.includes(addon.name)}
                onChange={() => handleAddonToggle(addon.name)}
                className="w-5 h-5 mt-0.5 mr-4 accent-indigo-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800 capitalize">{addon.name}</span>
                  <span className="text-indigo-600 font-semibold text-lg">+${addon.price}</span>
                </div>
                {addon.description && <p className="text-sm text-gray-600 leading-relaxed">{addon.description}</p>}
              </div>
            </label>
          ))}
        </div>
      </div>

      {configError && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-700">
          <p>⚠️ {configError}</p>
        </div>
      )}
    </div>
  );
};

export default Configurator;
