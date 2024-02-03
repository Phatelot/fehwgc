import type { RawDonation } from "./model";

export function parseTsvData(fileContent: string): RawDonation[] {
    const tsvData: RawDonation[] = [];

    const lines = fileContent.split("\n");

    for (const line of lines) {
        const parsedLine = parseTsvLine(line);
        if (!!parsedLine) {
            tsvData.push(parsedLine);
        }
    }

    return tsvData;
}

export function parseTsvLine(line: string): RawDonation | null {
    const [character, amount] = line.split("\t");

    if (!character || !amount) {
        return null;
    }

    return {character, amount: parseInt(amount)};
}
