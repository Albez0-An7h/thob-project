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

export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        details?: unknown;
    };
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: unknown;
    };
}
