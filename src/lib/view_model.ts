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


    const characters = stats.sort((a, b) => a.totalAmount - b.totalAmount).map((stat, index) => {

        const width = 10;
        const y = 90 - (30 + stat.totalAmount);

        const metadata = getCharacterMetadata(stat.name);

        return {
            ...stat,
            ...metadata,
            height: 30 + stat.totalAmount,
            width,
            x: 10 + 20 * index,
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
