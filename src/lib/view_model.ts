import { getCharacterMetadata, getFemaleCharactersNumber} from "./character_metadata";
import type { CharacterMetadata, CharacterStats, Party } from "./model";

export type CharacterViewModel = CharacterStats & CharacterMetadata & {
    x: number;
    y: number;
    width: number;
    height: number;
    immobilityThresholdY: number;

    picHeight: number;

    barGradient: string;
};

type FemaleCharacterViewModel = CharacterViewModel & {gender: 'WOMAN'};

export type ChartViewModel = {
    characters: CharacterViewModel[];
    femaleCharacters: FemaleCharacterViewModel[];
    viewPortHeight: number;
    viewPortWidth: number;
};

export function getMonsterFalinViewModel(viewModel: ChartViewModel): CharacterViewModel & {gender: 'YES'} {
    return viewModel.characters.find(c => c.name === 'Monster_Falin') as CharacterViewModel & {gender: 'YES'};
}

export function toViewModel(stats: CharacterStats[]): ChartViewModel {
    const viewPortHeight = 100;
    const viewPortWidth = 220;

    const highestWeight = Math.max(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.weight));

    const maxDisplayableWeight = 3_200;

    const margin = 95 / (5 * getFemaleCharactersNumber() + 1);

    const characters = stats.sort((a, b) => a.weight - b.weight).map((stat, index) => {

        const width = 4 * margin;
        const height = stat.weight / Math.min(maxDisplayableWeight, highestWeight) * 75;
        const immobilityThresholdY = 83 - (stat.immobilityThreshold / Math.min(maxDisplayableWeight, highestWeight) * 75);

        const y = 83 - height;

        const metadata = getCharacterMetadata(stat.name);

        return {
            ...stat,
            ...metadata,
            height,
            width,
            x: 2.5 + margin + 5 * margin * index,
            y,
            immobilityThresholdY,
            picHeight: width * viewPortWidth / viewPortHeight,
            barGradient: toBarGradient(metadata.party),
        }
    });

    const femaleCharacters = characters.filter(c => c.gender === "WOMAN").map((c, index) => ({...c, x: 2.5 + margin + 5 * margin * index,})) as FemaleCharacterViewModel[];

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
        'ADVENTURERS': 'darkTeal',
        'KABRUS': 'blue',
        'LAIOS': 'orange',
        'MITHRUNS': 'darkGreen',
        'SHUROS': 'red',
        'OTHERS': 'pink',
    }[party] + 'Gradient';
}
