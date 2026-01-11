export interface MaterialData {
  name: string;
  priceMultiplier: number;
  allowedColors: readonly string[];
  maxWidthCm: number;
  description: string;
  daysInStock: number;
  stockLevel: 'high' | 'medium' | 'low';
}

export const MATERIALS: Record<string, MaterialData> = {
  leather: {
    name: 'leather',
    priceMultiplier: 1.4,
    allowedColors: ['black', 'brown', 'beige'],
    maxWidthCm: 260,
    description: 'Premium genuine leather with rich texture',
    daysInStock: 120,
    stockLevel: 'high',
  },
  fabric: {
    name: 'fabric',
    priceMultiplier: 1.1,
    allowedColors: ['gray', 'blue', 'orange'],
    maxWidthCm: 300,
    description: 'Durable woven fabric, soft and breathable',
    daysInStock: 45,
    stockLevel: 'medium',
  },
} as const;

export type MaterialType = keyof typeof MATERIALS;

export function getMaterial(materialName: string): MaterialData | undefined {
    return MATERIALS[materialName];
}

export function getAllMaterials(): MaterialData[] {
    return Object.values(MATERIALS);
}

export function isColorAllowedForMaterial(materialName: string, color: string): boolean {
    const material = getMaterial(materialName);
    return material ? material.allowedColors.includes(color) : false;
}
