export interface AddonData {
    name: string;
    price: number;
    description: string;
}

export const ADDONS: Record<string, AddonData> = {
    recliner: {
        name: 'recliner',
        price: 200,
        description: 'Electric reclining mechanism for ultimate comfort',
    },
    storage: {
        name: 'storage',
        price: 120,
        description: 'Hidden storage compartment under the seat',
    },
    headrest: {
        name: 'headrest',
        price: 80,
        description: 'Adjustable headrest for neck support',
    },
} as const;

export type AddonType = keyof typeof ADDONS;

export function getAddon(addonName: string): AddonData | undefined {
    return ADDONS[addonName];
}

export function getAllAddons(): AddonData[] {
    return Object.values(ADDONS);
}

export function calculateAddonsTotal(addonNames: string[]): number {
    return addonNames.reduce((total, addonName) => {
        const addon = getAddon(addonName);
        return total + (addon?.price || 0);
    }, 0);
}

export function areAddonsValid(addonNames: string[]): boolean {
    return addonNames.every((name) => getAddon(name) !== undefined);
}
