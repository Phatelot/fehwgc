import { getBgPictureLink, getFacePicLink, getFramePictureLink } from "./asset_utils";
import type { CharacterCompletedState, CompletedState, OutfitCompletedState } from "./completed_state";
import type { Shape } from "./metadata";

export const viewPortHeight = 100;
export const viewPortWidth = 220;

const maxNumberOfDisplayedCharacters = 14;

export function createOutfitViewModel(state: CompletedState) : OutfitViewModel[] {

	const outfitStates : OutfitCompletedState[] = state.games
		.flatMap(game => game.characters)
		.flatMap(character => character.outfits)
		.filter(outfit => outfit.unlocked)
		.sort((a, b) => a.weightInLbs - b.weightInLbs)
		.slice(-maxNumberOfDisplayedCharacters);

	const lowestWeight = outfitStates[0].weightInLbs;
	const highestWeight = outfitStates[outfitStates.length - 1].weightInLbs;
	const maxDisplayableWeight = 40 * lowestWeight;

	const margin = 95 / (5 * maxNumberOfDisplayedCharacters + 1);
	const width = 4 * margin;

	return outfitStates.map((outfitState, i) => {
		const height = outfitState.weightInLbs / Math.min(maxDisplayableWeight, highestWeight) * 60;
		const magic75 = 75;
		const outgrownY =
			!(outfitState.outgrown || outfitState.nameSlug === 'broken') ?
			magic75 - ((outfitState.outgrownThresholdInLbs as number) / Math.min(maxDisplayableWeight, highestWeight) * 60) :
			undefined;
		const y = magic75 - height;

		return {
			width,
			height,
			x: 2.5 + margin + 5 * margin * (maxNumberOfDisplayedCharacters - outfitStates.length + i),
			y,
			outgrownY,
			barGradient: outfitState.gameSlug + "Gradient",
			characterSlug: outfitState.characterSlug,
			outfitSlug: outfitState.nameSlug,
			bgPictureLink: getBgPictureLink(outfitState.gameSlug),
			framePictureLink: getFramePictureLink(outfitState.broken ? 'broken' : (outfitState.nameSlug as string)),
			pictureLink: getFacePicLink(outfitState.characterSlug, (outfitState.broken && !outfitState.unlocked) ? '' : (outfitState.nameSlug as string)),
			broken: outfitState.broken,
			pictureHeight: width * viewPortWidth / viewPortHeight,
			weightInLbs: outfitState.weightInLbs,
			id: `${outfitState.characterSlug}-${outfitState.nameSlug}${outfitState.broken ? '-broken' : ''}`,
			mainShape: outfitState.mainShape,
			secondaryShape: outfitState.secondaryShape,
			trait: outfitState.trait,
		};
	})
}

export type OutfitViewModel = {
	x: number;
	y: number;
	outgrownY?: number;
	width: number;
	height: number;
	barGradient: string;
	characterSlug: string;
	outfitSlug?: string;
	pictureHeight: number;
	bgPictureLink: string;
	pictureLink: string;
	framePictureLink: string;
	weightInLbs: number;
	id: string;
	trait: string;
	mainShape?: Shape;
	secondaryShape?: Shape;
	broken: boolean;
}

export function createCharacterViewModel(state: CompletedState) : CharacterViewModel[] {

	const characterStates : CharacterCompletedState[] = state.games
		.flatMap(game => game.characters)
		.filter(character => character.unlocked)
		.sort((a, b) => (a.stats?.totalWeightUnlockedInLbs || 0) - (b.stats?.totalWeightUnlockedInLbs || 0))
		.slice(-maxNumberOfDisplayedCharacters);

	const lowestWeight = (characterStates[0].stats?.totalWeightUnlockedInLbs || 150);
	const highestWeight = characterStates[characterStates.length - 1].stats?.totalWeightUnlockedInLbs || 150;
	const maxDisplayableWeight = 40 * lowestWeight;

	const margin = 95 / (5 * maxNumberOfDisplayedCharacters + 1);
	const width = 4 * margin;

	return characterStates.map((characterState, i) => {
		const weightInLbs = characterState.stats?.totalWeightUnlockedInLbs || 150;

		const height = weightInLbs / Math.min(maxDisplayableWeight, highestWeight) * 60;
		const magic75 = 75;
		const y = magic75 - height;

		return {
			width,
			height,
			x: 2.5 + margin + 5 * margin * (maxNumberOfDisplayedCharacters - characterStates.length + i),
			y,
			barGradient: characterState.gameSlug + "Gradient",
			characterSlug: characterState.nameSlug,
			bgPictureLink: getBgPictureLink(characterState.gameSlug),
			framePictureLink: getFramePictureLink('base'),
			pictureLink: getFacePicLink(characterState.nameSlug, 'base'),
			pictureHeight: width * viewPortWidth / viewPortHeight,
			weightInLbs,
			id: `${characterState.nameSlug}`,
		};
	})
}

export type CharacterViewModel = {
	x: number;
	y: number;
	width: number;
	height: number;
	barGradient: string;
	characterSlug: string;
	pictureHeight: number;
	bgPictureLink: string;
	pictureLink: string;
	framePictureLink: string;
	weightInLbs: number;
	id: string;
}
