
export function groupConsecutive<T>(array: T[], groupSize: number): T[][] {
    const numberOfGroups = Math.ceil(array.length / groupSize)

	const acc: T[][] = [];
	for (let i = numberOfGroups; i > 0; i--) {
		const endIndex = -(i - 1) * groupSize;
		const r = array.slice(-i * groupSize, endIndex ? endIndex : undefined)
		acc.push(r)
	}

	return acc.reverse();
}
