import { getCharacterMetadata, getCharacters } from "./character_metadata";
import type { CharacterStats, RawDonation } from "./model";

export function toCharacterStats(donations: RawDonation[]): CharacterStats[] {
    const totalAmountsByCharacter: {[name: string]: number} = {};

    for (const donation of donations) {
        if (!totalAmountsByCharacter[donation.character]) {
            totalAmountsByCharacter[donation.character] = 0;
        }
        totalAmountsByCharacter[donation.character] += donation.amount;
    }

    return getCharacters().map(name => {
        const totalDonatedAmount = totalAmountsByCharacter[name] || 0;

        const metadata = getCharacterMetadata(name);

        return {
            name,
            totalDonatedAmount,
            weight: metadata.baseWeight + 2 * totalDonatedAmount,
        };
    });
}
