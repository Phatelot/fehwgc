import { getCharacterMetadata, getCharacters, getParty, getPartySize } from "./character_metadata";
import type { CharacterStats, Party, PartyStats, RawDonation } from "./model";
import { getParties } from "./party_metadata";
import { BMI, weightInLbsForBMI } from "./weight_utils";

export function toCharacterStats(donations: RawDonation[]): CharacterStats[] {
    const totalAmountsByCharacter: {[name: string]: number} = {};
    const totalAmountByParty: {[name in Party]: number} = {
        DUNGEON: 0,
        OTHERS: 0,
        FLAMELAS: 0,
        KABRUS: 0,
        LAIOS: 0,
        MITHRUNS: 0,
        SHUROS: 0,
        ADVENTURERS: 0,
    };
    let totalAmount: number = 0;

    for (const donation of donations) {
        if (!totalAmountsByCharacter[donation.character]) {
            totalAmountsByCharacter[donation.character] = 0;
        }
        totalAmountsByCharacter[donation.character] += donation.amount;
        totalAmountByParty[getParty(donation.character)] += donation.amount;
        totalAmount += donation.amount;
    }

    return getCharacters().map(name => {
        const totalDonatedAmount = totalAmountsByCharacter[name] || 0;

        const metadata = getCharacterMetadata(name);

        let groupWeight: number = metadata.baseWeight + totalDonatedAmount + totalAmountByParty[metadata.party] / getPartySize(metadata.party);
        if (name === 'Monster_Falin') {
            groupWeight += totalAmount;
        }

        const weightDivisor = metadata.numbers || 1;
        const weight = groupWeight / weightDivisor;

        const bmi = BMI(metadata.heightInMeters, weight) / (name === 'Monster_Falin' ? 40 : 1);

        return {
            name,
            totalDonatedAmount,
            groupWeight,
            weight,
            BMI: bmi,
            immobilityThreshold: weightInLbsForBMI(metadata.heightInMeters, metadata.immobilityBMI),
        };
    });
}

export function toPartyStats(characterStats: CharacterStats[]) : PartyStats[] {
    const partyStatsByName : {[key: string]: PartyStats} = {};
    for (const party of getParties()) {
        partyStatsByName[party] = {
            name: party as Party,
            totalDonatedAmount: 0,
            weight: 0,
        }
    }

    for (const characterStat of characterStats) {
        partyStatsByName[getParty(characterStat.name)].totalDonatedAmount += characterStat.totalDonatedAmount;
        partyStatsByName[getParty(characterStat.name)].weight += characterStat.groupWeight;
    }

    return Object.values(partyStatsByName);
}
