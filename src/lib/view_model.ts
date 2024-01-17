import type { CharacterStats, CharacterViewModel } from "./model";

export function toViewModel(stats: CharacterStats[]): CharacterViewModel[] {
    return stats.sort((a, b) => a.totalAmount - b.totalAmount).map((stat, index) => {
        return {
            ...stat,
            height: 30 + stat.totalAmount,
            width: 10,
            x: 10 + 20 * index,
            y: 90 - (30 + stat.totalAmount),
        }
    });
}
