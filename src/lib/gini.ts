import type { CharacterViewModel } from "./view_model";

export function toSortedNonGroupWeights(viewModel: CharacterViewModel[]): number[] {
	return viewModel.flatMap(c => Array(c.numbers || 1).fill(c.weight)).sort((a, b) => a - b);
}

export function toSortedNonGroupBMIs(viewModel: CharacterViewModel[]): number[] {
	return viewModel.flatMap(c => Array(c.numbers || 1).fill(c.BMI)).sort((a, b) => a - b);
}

export function biggerThanTheXSmallestCombined(sortedValues: number[], value: number) : number {
	let sum = 0;
	let i = 0
	while (sum < value) {
		sum += sortedValues[i++]
	}
	return i-1;
}

export function gini(sortedValues: number[]): number {
	const total = sortedValues.reduce((a, b) => a + b, 0);
	const number = sortedValues.length;
	let diff = 0;
	let sum = 0;
	for (let i = 0; i < number; i++) {
		const value = sortedValues[i];
		sum += value;
		const sumIfPerfect = total / number * (i+1);
		diff += sumIfPerfect - sum;
	}

	return diff * 2 / number / total;
}
