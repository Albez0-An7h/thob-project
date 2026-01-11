export function safeMultiply(a: number, b: number): number {
    return Math.round(a * b * 100) / 100;
}

export function safeAdd(a: number, b: number): number {
    return Math.round((a + b) * 100) / 100;
}

export function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
}

export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 10000) / 100;
}
