import { getPartyMetadata } from "./party_metadata";
import type { CharacterViewModel, ChartViewModel } from "./view_model";
import { formatWeight, formatBMI, toImperialHeight, toBMICategory } from "./weight_utils";

export function generateSentencesFor(characterName: string, viewModel: ChartViewModel) : string[] {
	const charViewModel = viewModel.characters.find(c => c.name === characterName) as CharacterViewModel;

	const sentences : string[] = [];

	if (charViewModel.weight === charViewModel.baseWeight) {
		sentences.push(`${charViewModel.displayName || charViewModel.name} still hasn't gained any weight, and weighs ${formatWeight(charViewModel.weight)}lbs.`)
	} else {
		sentences.push(
			`${charViewModel.displayName || charViewModel.name} has gained ${formatWeight(charViewModel.weight - charViewModel.baseWeight)}lbs, and now weighs ${formatWeight(charViewModel.weight)}lbs.`,
		)
	}
	sentences.push(
		`She's ${toImperialHeight(charViewModel.heightInMeters)} tall.`,
		`That gives her a BMI of ${formatBMI(charViewModel.BMI)}, so she is ${toBMICategory(charViewModel.BMI)}.`,
	);

	if (isFattestCharacter(charViewModel, viewModel)) {
		sentences.push("Except for monster Falin, she's the fattest character.")
	} else if (isFattestCharacterOfParty(charViewModel, viewModel)) {
		const partyMetadata = getPartyMetadata(charViewModel.party);
		if (charViewModel.party === 'DUNGEON') {
			sentences.push(`Except for monster Falin, she's the fattest among the Dungeon.`)
		} else {
			sentences.push(`She's the fattest among ${partyMetadata.displayName}.`)
		}
	}

	if (isImmobile(charViewModel)) {
		sentences.push("She's immobile.")
	}

	return sentences;
}

function isFattestCharacter(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : boolean {
	const maxWeight = Math.max(...viewModel.femaleCharacters.map(c => c.weight));
	return charViewModel.weight >= maxWeight;
}

function isFattestCharacterOfParty(charViewModel : CharacterViewModel, viewModel : ChartViewModel) : boolean {
	const maxWeight = Math.max(...viewModel.femaleCharacters.filter(c => c.party === charViewModel.party).map(c => c.weight));
	return charViewModel.weight >= maxWeight;
}

function isImmobile(charViewModel : CharacterViewModel) : boolean {
	return charViewModel.BMI >= charViewModel.immobilityBMI;
}
