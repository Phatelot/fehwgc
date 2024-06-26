import { getCharacterMetadata, getCharacters, getParty, getPartyMembersNames, getPartySize } from "./character_metadata";
import type { CharacterStats, DonationLogEntry, Party, PartyStats, RawDonation } from "./model";
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

export function extractLastDonationLogEntries(donations: RawDonation[], characterStats: CharacterStats[]): DonationLogEntry[] {
    const donationLogEntries : DonationLogEntry[] = [];
    const previousWeights : {[key: string]: number} = {};

    const getWeight = function(characterName: string) : number {
        return previousWeights[characterName] || (characterStats.find(c => c.name === characterName)?.weight) as number;
    }

    const limit = Math.min(4, donations.length);
    for (let i = 0; i < limit; i++) {
        const donation = donations[donations.length - 1 -i]

        const entry : DonationLogEntry = {
            amount: donation.amount,
            character: donation.character,
            gains: [],
        };
        donationLogEntries.push(entry);

        const gains : {[key: string]: number} = {};
        const partyMembers = getPartyMembersNames(donation.character);
        const partySize = getPartySize(getParty(donation.character));
        const groupNumber = getCharacterMetadata(donation.character).numbers || 1;

        gains[donation.character] = donation.amount / groupNumber;
        for (let partyMember of partyMembers) {
            const groupNumber = getCharacterMetadata(partyMember).numbers || 1;
            gains[partyMember] = gains[partyMember] || 0;
            gains[partyMember] += donation.amount / partySize / groupNumber;
        }
        gains['Monster_Falin'] = gains['Monster_Falin'] || 0;
        gains['Monster_Falin'] += donation.amount;

        for (let character of Object.keys(gains)) {
            const currentWeight = getWeight(character);
            const previousWeight = currentWeight - gains[character];
            entry.gains.push({
                characterName: character,
                after: currentWeight,
                before: previousWeight,
            });
            previousWeights[character] = previousWeight;
        }

    }
    return donationLogEntries;
}
