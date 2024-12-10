const DEFAULT_SEED = 1;

let seed = DEFAULT_SEED;

export function setSeed(s: number) {
    seed = s;
}

export function resetSeed() {
    seed = DEFAULT_SEED;
}

export function stringToRandomNumber(str: string, excludedUpperBound: number): number {
    let hash = 0;

    // Simple hashing loop
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }

    return Math.abs((hash + seed) % excludedUpperBound);
}
