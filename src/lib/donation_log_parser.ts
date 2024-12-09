import type { Donation } from "./state";

export function parseCsvData(fileContent: string): Donation[] {
    const tsvData: Donation[] = [];

    const lines = fileContent.split("\n");
    for (const line of lines) {
        const parsedLine = parseCsvLine(line);
        if (!!parsedLine) {
            tsvData.push(parsedLine);
        }
    }

    return tsvData;
}

export function parseCsvLine(line: string): Donation | null {
    const [character, outfit, amount] = line.split(",");

    if (!character || !outfit || !amount) {
        return null;
    }
    return {character, outfit, amount: parseInt(amount) * 1.42};
}
