const formatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0})

export function formatWeight(weight: number) : string {
    return formatter.format(weight).replace(',','')
}

export function BMI(heightInMeters: number, weightInLbs: number) : number {
	return weightInLbs * 0.453 / heightInMeters / heightInMeters;
}

export function weightInLbsForBMI(heightInMeters: number, targetBMI: number): number {
	return targetBMI * heightInMeters * heightInMeters / 0.453;
}
