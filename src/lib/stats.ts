import type { CharacterStats, RawDonation } from "./model";

export function toCharacterStats(donations: RawDonation[]): CharacterStats[] {
    const totalAmountsByCharacter: {[name: string]: number} = {};

    for (const donation of donations) {
        if (!totalAmountsByCharacter[donation.character]) {
            totalAmountsByCharacter[donation.character] = 0;
        }
        totalAmountsByCharacter[donation.character] += donation.amount;
    }

    const characterStats: CharacterStats[] = [];
    for (const character in totalAmountsByCharacter) {
        characterStats.push({
            name: character,
            totalAmount: totalAmountsByCharacter[character],
        })
    }

    return characterStats;
}
