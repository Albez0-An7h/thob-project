import { PricingBreakdown } from '../../types';
import { getBasePrice, getMaterialMultiplier, getSizeMultiplier, getAddonPrice, PRICING_RULES } from './rules';
import { safeMultiply, safeAdd } from '../../utils/math';
import { getMaterial } from '../catalog/materials.data';

export interface PricingInput {
    material: string;
    size: string;
    addons: string[];
    applyDiscounts?: boolean;
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
    const basePrice = getBasePrice();
    let materialMultiplier = getMaterialMultiplier(input.material);
    const sizeMultiplier = getSizeMultiplier(input.size);

    // check stock level for premium pricing
    const material = getMaterial(input.material);
    if (material?.stockLevel === 'low') {
        materialMultiplier = safeMultiply(materialMultiplier, PRICING_RULES.DISCOUNTS.lowStockPremium.multiplier);
    }

    const baseWithMaterial = safeMultiply(basePrice, materialMultiplier);
    const baseWithSize = safeMultiply(baseWithMaterial, sizeMultiplier);

    const addonsTotal = input.addons.reduce((total: number, addon: string) => {
        return safeAdd(total, getAddonPrice(addon));
    }, 0);

    const subtotal = safeAdd(baseWithSize, addonsTotal);

    // apply discounts if enabled
    let discountAmount = 0;
    let discountBreakdown: PricingBreakdown['discounts'];

    if (input.applyDiscounts !== false) {
        const discounts: Record<string, number> = {};

        // stock clearance discount
        if (material && material.daysInStock >= PRICING_RULES.DISCOUNTS.stockClearance.threshold) {
            const stockDiscount = safeMultiply(subtotal, PRICING_RULES.DISCOUNTS.stockClearance.discount);
            discounts.stockClearance = stockDiscount;
            discountAmount = safeAdd(discountAmount, stockDiscount);
        }

        // seasonal sale
        if (PRICING_RULES.DISCOUNTS.seasonalSale.active) {
            const seasonalDiscount = safeMultiply(subtotal, PRICING_RULES.DISCOUNTS.seasonalSale.discount);
            discounts.seasonal = seasonalDiscount;
            discountAmount = safeAdd(discountAmount, seasonalDiscount);
        }

        // bundle discount for 3+ addons
        if (input.addons.length >= PRICING_RULES.DISCOUNTS.bundleDiscount.minAddons) {
            const bundleDiscount = safeMultiply(addonsTotal, PRICING_RULES.DISCOUNTS.bundleDiscount.discount);
            discounts.bundle = bundleDiscount;
            discountAmount = safeAdd(discountAmount, bundleDiscount);
        }

        if (discountAmount > 0) {
            discountBreakdown = {
                ...discounts,
                total: Math.round(discountAmount * 100) / 100,
            };
        }
    }

    const finalPrice = subtotal - discountAmount;

    return {
        basePrice,
        materialMultiplier,
        sizeMultiplier,
        addonsTotal,
        subtotal: Math.round(subtotal * 100) / 100,
        discounts: discountBreakdown,
        finalPrice: Math.round(finalPrice * 100) / 100,
        savings: discountAmount > 0 ? Math.round(discountAmount * 100) / 100 : undefined,
    };
}

export function calculatePriceWithDetails(input: PricingInput): {
    breakdown: PricingBreakdown;
    addonDetails: Array<{ name: string; price: number }>;
} {
    const breakdown = calculatePrice(input);

    const addonDetails = input.addons.map((addon: string) => ({
        name: addon,
        price: getAddonPrice(addon),
    }));

    return {
        breakdown,
        addonDetails,
    };
}

export function estimatePriceRange(
    material: string,
    size: string
): { min: number; max: number } {
    const basePrice = getBasePrice();
    const materialMultiplier = getMaterialMultiplier(material);
    const sizeMultiplier = getSizeMultiplier(size);

    const minPrice = safeMultiply(safeMultiply(basePrice, materialMultiplier), sizeMultiplier);

    const allAddonPrices = [getAddonPrice('recliner'), getAddonPrice('storage'), getAddonPrice('headrest')];
    const maxAddonsTotal = allAddonPrices.reduce((sum, price) => safeAdd(sum, price), 0);

    const maxPrice = safeAdd(minPrice, maxAddonsTotal);

    return {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
    };
}
