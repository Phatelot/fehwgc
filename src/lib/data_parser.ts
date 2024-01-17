import type { RawDonation } from "./model";

export function parseTsvData(fileContent: string): RawDonation[] {
    const tsvData: RawDonation[] = [];

    for (const line of fileContent.split("\n")) {
        tsvData.push(parseTsvLine(line));
    }

    return tsvData;
}

export function parseTsvLine(line: string): RawDonation {
    const [character, amount] = line.split("\t");
    return {character, amount: parseInt(amount)};
}
