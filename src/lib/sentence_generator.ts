import { getPartySize } from "./character_metadata";
import { biggerThanTheXSmallestCombined, gini, toSortedNonGroupWeights } from "./gini";
import { getPartyMetadata } from "./party_metadata";
import type { CharacterViewModel, ChartViewModel } from "./view_model";
import { formatWeight, formatBMI, toImperialHeight, toBMICategory, weightInLbsForBMI } from "./weight_utils";

export function generateSentencesFor(characterName: string, viewModel: ChartViewModel) : string[] {
	const charViewModel = viewModel.characters.find(c => c.name === characterName) as CharacterViewModel;

	if (characterName === 'Monster_Falin') {
		return generateSentencesForMonsterFalin(charViewModel, viewModel);
	} else if (charViewModel.numbers && charViewModel.numbers > 1) {
		return generateSentencesForGroupCharacter(charViewModel as CharacterViewModel & {numbers: number}, viewModel);
	}
	return generateSentencesForNonGroupCharacter(charViewModel, viewModel);
}

function generateSentencesForNonGroupCharacter(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : string[] {
	const sentences : string[] = [];
	const pronoun = charViewModel.gender === 'MAN' ? ['He', 'Him', 'His'] : ['She', 'Her', 'Her'];

	if (charViewModel.weight === charViewModel.baseWeight) {
		sentences.push(`${charViewModel.displayName || charViewModel.name} still hasn't gained any weight, and weighs ${formatWeight(charViewModel.weight)}lbs.`)
	} else {
		sentences.push(
			`${charViewModel.displayName || charViewModel.name} weighs ${formatWeight(charViewModel.weight)}lbs, up from ${formatWeight(charViewModel.baseWeight)}lbs.`,
		)
	}
	sentences.push(
		`${pronoun[0]}'s ${toImperialHeight(charViewModel.heightInMeters)} tall.`,
		`That gives ${pronoun[1].toLowerCase()} a BMI of ${formatBMI(charViewModel.BMI)}, so ${pronoun[0].toLowerCase()} is ${toBMICategory(charViewModel.BMI)}.`,
		`If ${pronoun[0].toLowerCase()} was 5'5", with constant BMI, ${pronouns[0].toLowerCase()}'d weigh ${formatWeight(weightInLbsForBMI(1.651, charViewModel.BMI))}lbs.`,
	);

	if (isFattestCharacter(charViewModel, viewModel)) {
		sentences.push(`Except for monster Falin, ${pronoun[0].toLowerCase()}'s the fattest character.`)
	} else if (isFattestCharacterOfParty(charViewModel, viewModel)) {
		const partyMetadata = getPartyMetadata(charViewModel.party);
		if (charViewModel.party === 'DUNGEON') {
			sentences.push(`Except for monster Falin, ${pronoun[0].toLowerCase()}'s the fattest among the Dungeon.`)
		} else {
			sentences.push(`${pronoun[0]}'s the fattest among ${partyMetadata.displayName}.`)
		}
	}

	const sortedNonGroupWeights = toSortedNonGroupWeights(viewModel.characters);
	const biggerThan = biggerThanTheXSmallestCombined(sortedNonGroupWeights, charViewModel.weight);

	if (biggerThan > 1) {
		sentences.push(`${pronoun[0]}'s heavier than the ${biggerThan} smallest characters combined.`);
	}

	if (hasReceivedDonation(charViewModel)) {
		const totalGain = charViewModel.weight - charViewModel.baseWeight;
		const percentage = Math.round(charViewModel.totalDonatedAmount / totalGain * 100);
		sentences.push(`${pronoun[0]} has received $${charViewModel.totalDonatedAmount} of donation (${percentage}% of ${pronoun[2].toLowerCase()} gain).`)
	} else {
		sentences.push(`${pronoun[0]} hasn't received any donation yet.`)
	}

	if (isImmobile(charViewModel)) {
		sentences.push(`${pronoun[0]}'s immobile.`)
	}

	sentences.push(`Donating $1 for ${pronoun[1].toLowerCase()} will make ${pronoun[1].toLowerCase()} put on ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(getLbsPerDollar(charViewModel))}lbs.`)

	if (!isImmobile(charViewModel)) {
		const diffToImmobility = charViewModel.immobilityThreshold - charViewModel.weight;
		const dollarsToImmobility = diffToImmobility / getLbsPerDollar(charViewModel);
		sentences.push(`Donate ${pronoun[1].toLowerCase()} $${new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(Math.ceil(dollarsToImmobility))} to make ${pronoun[1].toLowerCase()} gain ${formatWeight(diffToImmobility)}lbs and get immobile.`)
	}

	return sentences;
}

function generateSentencesForMonsterFalin(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : string[] {
	const sentences : string[] = [];

	if (charViewModel.weight === charViewModel.baseWeight) {
		sentences.push(`Monster Falin still hasn't gained any weight, and weighs ${formatWeight(charViewModel.weight)}lbs.`)
	} else {
		sentences.push(
			`Monster Falin has gained ${formatWeight(charViewModel.weight - charViewModel.baseWeight)}lbs, and now weighs ${formatWeight(charViewModel.weight)}lbs.`,
		)
	}
	sentences.push(
		`She has a normalized BMI of ${formatBMI(charViewModel.BMI)}, and is ${toBMICategory(charViewModel.BMI)}.`,
	);

	const sortedNonGroupWeights = toSortedNonGroupWeights(viewModel.characters);
	const biggerThan = biggerThanTheXSmallestCombined(sortedNonGroupWeights, charViewModel.weight);

	if (charViewModel.weight > viewModel.totalWeight - charViewModel.weight) {
		sentences.push(`She's heavier than all the other characters, combined.`);
	} else if (biggerThan > 1) {
		sentences.push(`She's heavier than the ${biggerThan} smallest characters combined.`);
	}

	if (hasReceivedDonation(charViewModel)) {
		const totalGain = charViewModel.weight - charViewModel.baseWeight;
		const percentage = Math.round(charViewModel.totalDonatedAmount / totalGain * 100);
		sentences.push(`She has received $${charViewModel.totalDonatedAmount} of donation (${percentage}% of her gain).`)
	} else {
		sentences.push("She hasn't received any donation yet.")
	}

	if (isImmobile(charViewModel)) {
		sentences.push(`She's immobile.`)
	}

	sentences.push(`Donating $1 for her will make her put on ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(1 + getLbsPerDollar(charViewModel))}lbs.`)

	return sentences;
}

function generateSentencesForGroupCharacter(charViewModel : CharacterViewModel & {numbers: number}, viewModel : ChartViewModel) : string[] {
	const sentences : string[] = [];

	if (charViewModel.weight === charViewModel.baseWeight) {
		sentences.push(`${charViewModel.displayName || charViewModel.name} still haven't gained any weight, and weigh ${formatWeight(charViewModel.weight)}lbs each.`)
	} else {
		sentences.push(
			`${charViewModel.displayName || charViewModel.name} each weigh ${formatWeight(charViewModel.weight)}lbs, a ${formatWeight(charViewModel.weight - charViewModel.baseWeight/charViewModel.numbers)}lbs gain.`,
		)
	}
	sentences.push(
		`Their total weight is ${formatWeight(charViewModel.groupWeight)}lbs.`,
		`They're on average ${toImperialHeight(charViewModel.heightInMeters)} tall.`,
		`That gives them a BMI of ${formatBMI(charViewModel.BMI)}, so they are ${toBMICategory(charViewModel.BMI)}.`,
	);

	if (isImmobile(charViewModel)) {
		sentences.push("They're immobile.")
	}

	sentences.push(`Donating $1 for them will make each of them put on ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(getLbsPerDollar(charViewModel))}lbs.`)

	return sentences;
}

export function generateSentencesForGlobal(viewModel : ChartViewModel) : string[] {
	const baseTotalWeight = viewModel.characters.map(c => c.baseWeight).reduce((a, b) => a + b, 0);
	const sortedNonGroupWeights = toSortedNonGroupWeights(viewModel.characters);
	const totalDonationAmount = viewModel.rawDonations.map(d => d.amount).reduce((a, b) => a + b, 0);
	const totalBMI = viewModel.characters.map(c => c.BMI * (c.numbers || 1)).reduce((a, b) => a + b, 0);
	const averageBMI = totalBMI / sortedNonGroupWeights.length;
	const averageWeight = viewModel.totalWeight / sortedNonGroupWeights.length;

	const sentences : string[] = [
		`The total group weight is ${formatWeight(viewModel.totalWeight)}lbs, up from ${formatWeight(baseTotalWeight)}lbs.`,
		`The average weight is ${formatWeight(averageWeight)}lbs, and the average BMI is ${formatBMI(averageBMI)} (${toBMICategory(averageBMI)}).`,
		`The gini index for weights is ${Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(gini(sortedNonGroupWeights))} (0 is perfect equality).`,
		`There has been ${viewModel.rawDonations.length} donations, for a total of $${totalDonationAmount}.`,
	];

	return sentences;
}


function isFattestCharacter(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : boolean {
	const maxWeight = Math.max(...viewModel.characters.map(c => c.weight));
	return charViewModel.weight >= maxWeight;
}

function isFattestCharacterOfParty(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : boolean {
	const maxWeight = Math.max(...viewModel.characters.filter(c => c.party === charViewModel.party).map(c => c.weight));
	return charViewModel.weight >= maxWeight;
}

function getLbsPerDollar(charViewModel : CharacterViewModel) : number {
	const partySize = getPartySize(charViewModel.party);
	const base = 1 + 1/partySize;
	return base / (charViewModel.numbers || 1);
}

function isImmobile(charViewModel : CharacterViewModel) : boolean {
	return charViewModel.BMI >= charViewModel.immobilityBMI;
}

function hasReceivedDonation(charViewModel : CharacterViewModel) : boolean {
	return charViewModel.totalDonatedAmount > 0;
}
