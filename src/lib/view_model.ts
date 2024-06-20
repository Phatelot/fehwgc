import { getCharacterMetadata, getFemaleCharactersNumber} from "./character_metadata";
import type { CharacterMetadata, CharacterStats, Party } from "./model";

type CharacterViewModel = CharacterStats & CharacterMetadata & {
    x: number;
    y: number;
    width: number;
    height: number;

    picHeight: number;

    barGradient: string;
};

type FemaleCharacterViewModel = CharacterViewModel & {gender: 'WOMAN'};

export type ViewModel = {
    characters: CharacterViewModel[];
    femaleCharacters: FemaleCharacterViewModel[];
    viewPortHeight: number;
    viewPortWidth: number;
};

export function toViewModel(stats: CharacterStats[]): ViewModel {
    const viewPortHeight = 100;
    const viewPortWidth = 220;

    const highestWeight = Math.max(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.weight));

    const maxDisplayableWeight = 3_200;

    const margin = 100 / (5 * getFemaleCharactersNumber() + 1);

    const characters = stats.sort((a, b) => a.weight - b.weight).map((stat, index) => {

        const width = 4 * margin;
        const height = stat.weight / Math.min(maxDisplayableWeight, highestWeight) * 80;
        const y = 90 - height;

        const metadata = getCharacterMetadata(stat.name);

        return {
            ...stat,
            ...metadata,
            height,
            width,
            x: margin + 5 * margin * index,
            y,
            picHeight: width * viewPortWidth / viewPortHeight,
            barGradient: toBarGradient(metadata.party),
        }
    });

    const femaleCharacters = characters.filter(c => c.gender === "WOMAN").map((c, index) => ({...c, x: margin + 5 * margin * index,})) as FemaleCharacterViewModel[];

    return {
        characters,
        femaleCharacters,
        viewPortHeight,
        viewPortWidth,
    }
}

function toBarGradient(party: Party): string {
    return {
        'DUNGEON': 'purple',
        'FLAMELAS': 'green',
        'TANSUS': 'darkTeal',
        'KABRUS': 'blue',
        'LAIOS': 'orange',
        'MITHRUNS': 'darkGreen',
        'SHUROS': 'red',
        'ELVES': 'pink',
    }[party] + 'Gradient';
}
