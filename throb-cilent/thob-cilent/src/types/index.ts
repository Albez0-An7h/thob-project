export interface PricingBreakdown {
  basePrice: number;
  materialMultiplier: number;
  sizeMultiplier: number;
  addonsTotal: number;
  subtotal: number;
  discounts?: {
    stockClearance?: number;
    seasonal?: number;
    bundle?: number;
    total: number;
  };
  finalPrice: number;
  savings?: number;
}

export interface ConfigurationResponse {
  success: boolean;
  configuration: {
    material: string;
    color: string;
    size: string;
    addons: string[];
  };
  pricing: PricingBreakdown;
}

export interface Material {
  name: string;
  priceMultiplier: number;
  allowedColors: readonly string[];
  maxWidthCm: number;
  description: string;
  daysInStock: number;
  stockLevel: 'high' | 'medium' | 'low';
}

export interface Size {
  name: string;
  seats: number;
  widthCm: number;
  priceMultiplier: number;
  description: string;
}

export interface Addon {
  name: string;
  price: number;
  description: string;
}

export interface Configuration {
  material: string;
  color: string;
  size: string;
  addons: string[];
}
