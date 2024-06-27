import { getCharacterMetadata, getFemaleCharactersNumber} from "./character_metadata";
import type { CharacterMetadata, CharacterStats, DonationLogEntry, Party, PartyMetadata, PartyStats, RawDonation } from "./model";
import { getPartyMetadata } from "./party_metadata";
import { extractLastDonationLogEntries } from "./stats";

type BarViewModel = {
    x: number;
    y: number;
    width: number;
    height: number;

    picHeight: number;

    barGradient: string;
};

export type CharacterViewModel = CharacterStats & CharacterMetadata & BarViewModel & {
    immobilityThresholdY: number;
};

export type PartyViewModel = PartyStats & PartyMetadata & BarViewModel;

type FemaleCharacterViewModel = CharacterViewModel & {gender: 'WOMAN'};

export type ChartViewModel = {
    characters: CharacterViewModel[];
    femaleCharacters: FemaleCharacterViewModel[];
    femaleGroupCharacters: FemaleCharacterViewModel[];
    femaleCharactersBMI: FemaleCharacterViewModel[];
    parties: PartyViewModel[];
    viewPortHeight: number;
    viewPortWidth: number;
    totalWeight: number;
    donationLog: DonationLogEntry[];
    rawDonations: RawDonation[];
};

export function getMonsterFalinViewModel(viewModel: ChartViewModel): CharacterViewModel & {gender: 'YES'} {
    return viewModel.characters.find(c => c.name === 'Monster_Falin') as CharacterViewModel & {gender: 'YES'};
}

export const viewPortHeight = 100;
export const viewPortWidth = 220;

export function toViewModel(stats: CharacterStats[], partyStats: PartyStats[], rawDonations: RawDonation[]): ChartViewModel {
    const characters = toCharactersViewModel(stats);
    const totalWeight = characters.map(c => c.groupWeight).reduce((a, b) => a + b, 0);

    const femaleCharacters = toFemaleCharactersViewModel(characters);
    const femaleGroupCharacters = toCharacterGroupsViewModel(stats);

    const femaleCharactersBMI = toFemaleCharactersBMIViewModel(stats);

    const parties = toPartyViewModel(partyStats);

    return {
        characters,
        femaleCharacters,
        femaleGroupCharacters,
        femaleCharactersBMI,
        parties,
        viewPortHeight,
        viewPortWidth,
        totalWeight,
        donationLog: extractLastDonationLogEntries(rawDonations, stats),
        rawDonations,
    }
}

function toCharactersViewModel(stats: CharacterStats[]) : CharacterViewModel[] {
    const highestWeight = Math.max(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.weight));
    const lowestWeight = Math.min(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.weight));
    const maxDisplayableWeight = 40 * lowestWeight;

    const margin = 95 / (5 * getFemaleCharactersNumber() + 1);

    return stats.sort((a, b) => a.weight - b.weight).map((stat, index) => {
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
}

function toCharacterGroupsViewModel(stats: CharacterStats[]) : FemaleCharacterViewModel[] {
    const highestWeight = Math.max(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.groupWeight));
    const lowestWeight = Math.min(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.groupWeight));
    const maxDisplayableWeight = 40 * lowestWeight;

    const margin = 95 / (5 * getFemaleCharactersNumber() + 1);

    return stats.sort((a, b) => a.groupWeight - b.groupWeight).map((stat, index) => {
        const metadata = getCharacterMetadata(stat.name);
        const width = 4 * margin;
        const height = stat.groupWeight / Math.min(maxDisplayableWeight, highestWeight) * 75;
        const immobilityThresholdY = 83 - (stat.immobilityThreshold * (metadata.numbers || 1) / Math.min(maxDisplayableWeight, highestWeight) * 75);

        const y = 83 - height;


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
    }).filter(c => c.gender === "WOMAN")
    .map((c, index) => ({...c, x: 2.5 + margin + 5 * margin * index,})) as FemaleCharacterViewModel[];
}

function toFemaleCharactersBMIViewModel(stats: CharacterStats[]) : FemaleCharacterViewModel[] {
    const highestBMI = Math.max(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.BMI));
    const lowestBMI = Math.min(...stats.filter(s => getCharacterMetadata(s.name).gender === "WOMAN").map(stat => stat.BMI));
    const maxDisplayableBMI = 40 * lowestBMI;

    const margin = 95 / (5 * getFemaleCharactersNumber() + 1);

    return stats.sort((a, b) => a.BMI - b.BMI).map((stat, index) => {
        const metadata = getCharacterMetadata(stat.name);
        const width = 4 * margin;
        const height = stat.BMI / Math.min(maxDisplayableBMI, highestBMI) * 75;

        const y = 83 - height;

        return {
            ...stat,
            ...metadata,
            height,
            width,
            x: 2.5 + margin + 5 * margin * index,
            y,
            immobilityThresholdY: 0, // does not make sense, will maybe handle later
            picHeight: width * viewPortWidth / viewPortHeight,
            barGradient: toBarGradient(metadata.party),
        }
    }).filter(c => c.gender === "WOMAN")
    .map((c, index) => ({...c, x: 2.5 + margin + 5 * margin * index,})) as FemaleCharacterViewModel[];
}

function toFemaleCharactersViewModel(charactersViewModel : CharacterViewModel[]) : FemaleCharacterViewModel[] {
    const margin = 95 / (5 * getFemaleCharactersNumber() + 1);

    return charactersViewModel.filter(c => c.gender === "WOMAN").map((c, index) => ({...c, x: 2.5 + margin + 5 * margin * index,})) as FemaleCharacterViewModel[];
}

function toPartyViewModel(stats : PartyStats[]) : PartyViewModel[] {
    const margin = 95 / (5 * stats.length + 1);

    const highestWeight = Math.max(...stats.map(stat => stat.weight));
    const lowestWeight = Math.min(...stats.map(stat => stat.weight));
    const maxDisplayableWeight = 40 * lowestWeight;

    const width = 4 * margin;

    return stats.sort((a, b) => a.weight - b.weight).map((stat, index) => {
        const height = stat.weight / Math.min(maxDisplayableWeight, highestWeight) * 65;

        const y = 70 - height;

        const metadata = getPartyMetadata(stat.name);

        return {
            ...stat,
            ...metadata,
            height,
            width,
            x: 2.5 + margin + 5 * margin * index,
            y,
            picHeight: width * viewPortWidth / viewPortHeight,
            barGradient: toBarGradient(stat.name),
        }
    });
}

function toBarGradient(party: Party): string {
    return getPartyMetadata(party).color + 'Gradient';
}
