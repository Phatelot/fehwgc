import type { CharacterViewModel, ChartViewModel } from "./view_model";
import { formatWeight, toImperialHeight, toBMICategory } from "./weight_utils";

export function generateSentencesFor(characterName: string, viewModel: ChartViewModel) : string[] {
	const charViewModel = viewModel.characters.find(c => c.name === characterName) as CharacterViewModel;

	const sentences : string[] = [
		`${charViewModel.displayName || charViewModel.name} weighs ${formatWeight(charViewModel.weight)}lbs.`,
		`She's ${toImperialHeight(charViewModel.heightInMeters)} tall.`,
		`That gives her a BMI of ${formatWeight(charViewModel.BMI)}, so she is ${toBMICategory(charViewModel.BMI)}.`,
	];

	return sentences;
}
