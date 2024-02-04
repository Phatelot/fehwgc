import { getCharacterMetadata } from "./character_metadata";
import type { CharacterMetadata, CharacterStats } from "./model";

type CharacterViewModel = CharacterStats & CharacterMetadata & {
    x: number;
    y: number;
    width: number;
    height: number;

    picHeight: number;

    barGradient: string;
};

export type ViewModel = {
    characters: CharacterViewModel[];
    viewPortHeight: number;
    viewPortWidth: number;
};

export function toViewModel(stats: CharacterStats[]): ViewModel {
    const viewPortHeight = 100;
    const viewPortWidth = 220;

    const highestWeight = Math.max(...stats.map(stat => stat.weight));

    const maxDisplayableWeight = 3_200;

    const margin = 100 / (5 * stats.length + 1);

    const characters = stats.sort((a, b) => a.totalDonatedAmount - b.totalDonatedAmount).map((stat, index) => {
        
        const width = 4 * margin;
        const height = stat.weight / maxDisplayableWeight * 80;
        const y = 90 - height;

        const metadata = getCharacterMetadata(stat.name);

        return {
            ...stat,
            ...metadata,
            height,
            width,
            x: margin + 5 * margin * index,
            y,
            picHeight: width * viewPortWidth / viewPortHeight * 0.8,
            barGradient: metadata.color.toLowerCase() + "Gradient",
        }
    });

    return {
        characters,
        viewPortHeight,
        viewPortWidth,
    }
}
