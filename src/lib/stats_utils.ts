export function biggerThanTheXSmallestCombined(sortedValues: number[], value: number) : number {
	let sum = 0;
	let i = 0
	while (sum < value) {
		sum += sortedValues[i++]
	}
	return i-1;
}

export function median(values: number[]): number {
	const number = values.length;
	if (number === 0) {
		return 0;
	}
	const sortedValues = structuredClone(values).sort((a, b) => a - b)
	if ((number % 2) === 1) {
		return sortedValues[number/2]
	}
	return (sortedValues[number/2-1] + sortedValues[number/2])/2.
}

export function average(values: number[]): number {
	const number = values.length;
	if (number === 0) {
		return 0;
	}
	return sum(values) / number;
}

export function gini(sortedValues: number[]): number {
	const total = sum(sortedValues);
	const number = sortedValues.length;
	let diff = 0;
	let acc = 0;
	for (let i = 0; i < number; i++) {
		const value = sortedValues[i];
		acc += value;
		const accIfPerfect = total / number * (i+1);
		diff += accIfPerfect - acc;
	}

	return diff * 2 / number / total;
}

export function sum(v: number[]): number {
	return v.reduce((a, b) => a + b, 0);
}
