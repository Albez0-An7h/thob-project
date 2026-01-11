export interface SizeData {
    name: string;
    seats: number;
    widthCm: number;
    priceMultiplier: number;
    description: string;
}

export const SIZES: Record<string, SizeData> = {
    two_seater: {
        name: 'two_seater',
        seats: 2,
        widthCm: 180,
        priceMultiplier: 1.0,
        description: 'Compact 2-seater perfect for small spaces',
    },
    three_seater: {
        name: 'three_seater',
        seats: 3,
        widthCm: 220,
        priceMultiplier: 1.25,
        description: 'Classic 3-seater for comfortable seating',
    },
    l_shape: {
        name: 'l_shape',
        seats: 5,
        widthCm: 280,
        priceMultiplier: 1.6,
        description: 'Spacious L-shaped sectional for large rooms',
    },
} as const;

export type SizeType = keyof typeof SIZES;

export function getSize(sizeName: string): SizeData | undefined {
    return SIZES[sizeName];
}

export function getAllSizes(): SizeData[] {
    return Object.values(SIZES);
}

export function isSizeCompatibleWithMaterial(sizeName: string, maxMaterialWidth: number): boolean {
    const size = getSize(sizeName);
    return size ? size.widthCm <= maxMaterialWidth : false;
}
