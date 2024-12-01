import { getBgPictureLink, getFacePicLink, getFramePictureLink } from "./asset_utils";
import { getHeaviestOutfitSlug, type CharacterCompletedState, type CompletedState, type OutfitCompletedState } from "./completed_state";
import type { Build, Shape } from "./metadata";
import { groupConsecutive } from "./utils";

export const viewPortHeight = 100;
export const viewPortWidth = 220;

const maxNumberOfDisplayedCharactersPerLine = 14;
const maxNumberOfDisplayedLines = 6;

export function createOutfitViewModel(state: CompletedState) : OutfitViewModel[][] {

	const outfitStates : OutfitCompletedState[] = state.games
		.flatMap(game => game.characters)
		.flatMap(character => character.outfits)
		.filter(outfit => outfit.unlocked)
		.sort((a, b) => a.weightInLbs - b.weightInLbs);

	const paginatedOutfitStates = groupConsecutive(outfitStates, maxNumberOfDisplayedCharactersPerLine);

	const lowestWeight = outfitStates[0].weightInLbs;
	const highestWeight = outfitStates[outfitStates.length - 1].weightInLbs;
	const maxDisplayableWeight = 40 * lowestWeight;

	const margin = 95 / (5 * maxNumberOfDisplayedCharactersPerLine + 1);
	const width = 4 * margin;

	return paginatedOutfitStates.map(outfitStatesPage => {
		return outfitStatesPage.map((outfitState, i) => {
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
				x: 2.5 + margin + 5 * margin * (maxNumberOfDisplayedCharactersPerLine - outfitStatesPage.length + i),
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
				build: outfitState.build,
				isSelfFeeding: outfitState.isSelfFeeding,
				selfFedBy: outfitState.selfFedBy,
				boundFeeding: outfitState.boundFeeding,
				boundFedBy: outfitState.boundFedBy,
				mutualGainingWith: outfitState.mutualGainingWith,
			};
		})
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
	build: Build,
	mainShape?: Shape;
	secondaryShape?: Shape;
	broken: boolean;
	isSelfFeeding: boolean;
	selfFedBy?: string;
	boundFeeding?: string;
	boundFedBy?: string;
	mutualGainingWith?: string;
}

export function createBMIOutfitViewModel(state: CompletedState) : BMIOutfitViewModel[][] {

	const outfitStates : OutfitCompletedState[] = state.games
		.flatMap(game => game.characters)
		.flatMap(character => character.outfits)
		.filter(outfit => outfit.unlocked)
		.sort((a, b) => a.BMI - b.BMI);

	const paginatedOutfitStates = groupConsecutive(outfitStates, maxNumberOfDisplayedCharactersPerLine);

	const lowestBMI = outfitStates[0].BMI;
	const highestBMI = outfitStates[outfitStates.length - 1].BMI;
	const maxDisplayableBMI = 40 * lowestBMI;

	const margin = 95 / (5 * maxNumberOfDisplayedCharactersPerLine + 1);
	const width = 4 * margin;

	return paginatedOutfitStates.map(outfitStatesPage => {
		return outfitStatesPage.map((outfitState, i) => {
			const height = outfitState.BMI / Math.min(maxDisplayableBMI, highestBMI) * 60;
			const magic75 = 75;
			const y = magic75 - height;

			return {
				width,
				height,
				x: 2.5 + margin + 5 * margin * (maxNumberOfDisplayedCharactersPerLine - outfitStatesPage.length + i),
				y,
				barGradient: outfitState.gameSlug + "Gradient",
				characterSlug: outfitState.characterSlug,
				outfitSlug: outfitState.nameSlug,
				bgPictureLink: getBgPictureLink(outfitState.gameSlug),
				framePictureLink: getFramePictureLink(outfitState.broken ? 'broken' : (outfitState.nameSlug as string)),
				pictureLink: getFacePicLink(outfitState.characterSlug, (outfitState.broken && !outfitState.unlocked) ? '' : (outfitState.nameSlug as string)),
				broken: outfitState.broken,
				pictureHeight: width * viewPortWidth / viewPortHeight,
				BMI: outfitState.BMI,
				id: `${outfitState.characterSlug}-${outfitState.nameSlug}${outfitState.broken ? '-broken' : ''}`,
				mainShape: outfitState.mainShape,
				secondaryShape: outfitState.secondaryShape,
				trait: outfitState.trait,
				build: outfitState.build,
				isSelfFeeding: outfitState.isSelfFeeding,
				selfFedBy: outfitState.selfFedBy,
				boundFeeding: outfitState.boundFeeding,
				boundFedBy: outfitState.boundFedBy,
				mutualGainingWith: outfitState.mutualGainingWith,
			};
		})
	})
}

export type BMIOutfitViewModel = {
	x: number;
	y: number;
	width: number;
	height: number;
	barGradient: string;
	characterSlug: string;
	outfitSlug?: string;
	pictureHeight: number;
	bgPictureLink: string;
	pictureLink: string;
	framePictureLink: string;
	BMI: number;
	id: string;
	trait: string;
	build: Build,
	mainShape?: Shape;
	secondaryShape?: Shape;
	broken: boolean;
	isSelfFeeding: boolean;
	selfFedBy?: string;
	boundFeeding?: string;
	boundFedBy?: string;
	mutualGainingWith?: string;
}

export function createCharacterViewModel(state: CompletedState) : CharacterViewModel[][] {

	const characterStates : CharacterCompletedState[] = state.games
		.flatMap(game => game.characters)
		.filter(character => character.unlocked)
		.sort((a, b) => (a.stats?.totalWeightUnlockedInLbs || 0) - (b.stats?.totalWeightUnlockedInLbs || 0));

	const paginatedCharacterStates = groupConsecutive(characterStates, maxNumberOfDisplayedCharactersPerLine);

	const lowestWeight = (characterStates[0].stats?.totalWeightUnlockedInLbs || 150);
	const highestWeight = characterStates[characterStates.length - 1].stats?.totalWeightUnlockedInLbs || 150;
	const maxDisplayableWeight = 40 * lowestWeight;

	const margin = 95 / (5 * maxNumberOfDisplayedCharactersPerLine + 1);
	const width = 4 * margin;

	return paginatedCharacterStates.map(characterStatesPage => {
		return characterStatesPage.map((characterState, i) => {
			const weightInLbs = characterState.stats?.totalWeightUnlockedInLbs || 150;

			const height = weightInLbs / Math.min(maxDisplayableWeight, highestWeight) * 60;
			const magic75 = 75;
			const y = magic75 - height;

			return {
				width,
				height,
				x: 2.5 + margin + 5 * margin * (maxNumberOfDisplayedCharactersPerLine - characterStatesPage.length + i),
				y,
				barGradient: characterState.gameSlug + "Gradient",
				characterSlug: characterState.nameSlug,
				bgPictureLink: getBgPictureLink(characterState.gameSlug),
				framePictureLink: getFramePictureLink('base'),
				pictureLink: getFacePicLink(characterState.nameSlug, getHeaviestOutfitSlug(characterState)),
				pictureHeight: width * viewPortWidth / viewPortHeight,
				weightInLbs,
				id: `${characterState.nameSlug}`,
				build: characterState.build,
			};
		})
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
	build: Build;
}

export function createUnlockViewModel(state: CompletedState): UnlockViewModel[][] {
	const margin = 95 / (5 * maxNumberOfDisplayedCharactersPerLine + 1);
	const width = 4 * margin;
	const pictureHeight = width * viewPortWidth / viewPortHeight;
	const maxNumberOfCharactersPerPage = (maxNumberOfDisplayedCharactersPerLine - 1) * maxNumberOfDisplayedLines;

	return groupConsecutive(state.games
		.flatMap(g => g.characters.map(c => ({game: g, character: c})))
		.flatMap(c => c.character.outfits.map(o => ({...c, outfit: o})))
		.map((o, i) => {
			i %= maxNumberOfCharactersPerPage;
			return {
				characterSlug: o.character.nameSlug,
				outfitSlug: o.outfit.nameSlug || 'should not happen',
				bgPictureLink: getBgPictureLink(o.game.nameSlug),
				pictureLink: getFacePicLink(o.character.nameSlug, o.outfit.broken ? getHeaviestOutfitSlug(o.character) : o.outfit.nameSlug || 'base'),
				framePictureLink: getFramePictureLink(o.outfit.broken ? 'broken' : (o.outfit.nameSlug as string)),
				x: 2.5 + margin + 5 * margin * (i % (maxNumberOfDisplayedCharactersPerLine - 1)),
				y: 4.5 + Math.floor(i / (maxNumberOfDisplayedCharactersPerLine - 1)) * (pictureHeight + 2.5),
				height: 4,
				pictureHeight,
				width,
				id: `un-${o.character.nameSlug}-${o.outfit.nameSlug}${o.outfit.broken ? '-broken' : ''}`,
				trait: o.outfit.trait,
				grey: !o.outfit.unlocked,
				broken: o.outfit.broken,
			}
		})
		.reverse(), maxNumberOfCharactersPerPage);
}

export type UnlockViewModel = {
	characterSlug: string;
	outfitSlug: string;
	bgPictureLink: string;
	pictureLink: string;
	framePictureLink: string;
	x: number;
	y: number;
	height: number;
	pictureHeight: number;
	width: number;
	id: string;
	trait?: string;
	grey?: boolean;
	broken: boolean;
}
