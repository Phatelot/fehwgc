import { getCharacterMetadata, getCharacters, getParty, getPartySize } from "./character_metadata";
import type { CharacterStats, Party, RawDonation } from "./model";
import { weightInLbsForBMI } from "./weight_utils";

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

        let weight: number = metadata.baseWeight + totalDonatedAmount + totalAmountByParty[metadata.party] / getPartySize(metadata.party);
        if (name === 'Monster_Falin') {
            weight += totalAmount;
        }
        if (metadata.numbers && metadata.numbers > 1) {
            weight /= metadata.numbers
        }

        return {
            name,
            totalDonatedAmount,
            weight,
            immobilityThreshold: weightInLbsForBMI(metadata.heightInMeters, 70),
        };
    });
}
