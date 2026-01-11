export const PRICING_RULES = {
    BASE_PRICE: 800,

    MATERIAL_MULTIPLIERS: {
        leather: 1.4,
        fabric: 1.1,
    } as const,

    SIZE_MULTIPLIERS: {
        two_seater: 1.0,
        three_seater: 1.25,
        l_shape: 1.6,
    } as const,

    ADDON_PRICES: {
        recliner: 200,
        storage: 120,
        headrest: 80,
    } as const,

    DISCOUNTS: {
        
        stockClearance: { threshold: 90, discount: 0.15 },
        seasonalSale: { active: true, discount: 0.10 },
        bundleDiscount: { minAddons: 3, discount: 0.08 },
        lowStockPremium: { multiplier: 1.05 },
        
    } as const,
} as const;


export function getMaterialMultiplier(material: string): number {
    return (
        PRICING_RULES.MATERIAL_MULTIPLIERS[
        material as keyof typeof PRICING_RULES.MATERIAL_MULTIPLIERS
        ] || 1.0
    );
}


export function getSizeMultiplier(size: string): number {
    return (
        PRICING_RULES.SIZE_MULTIPLIERS[
        size as keyof typeof PRICING_RULES.SIZE_MULTIPLIERS
        ] || 1.0
    );
}


export function getAddonPrice(addon: string): number {
    return (
        PRICING_RULES.ADDON_PRICES[
        addon as keyof typeof PRICING_RULES.ADDON_PRICES
        ] || 0
    );
}


export function getBasePrice(): number {
    return PRICING_RULES.BASE_PRICE;
}
