import { toFrameType } from "./frames";
import { baseMetadata, type Build, type CharacterBaseMetadata, type GameBaseMetadata, type OutfitBaseMetadata, type Shape } from "./metadata";
import { isOutgrown, type GameState, type OutfitState, type CharacterState, isUnlocked, getOutfitState } from "./state";
import { createWeightDonationTree, getChildGroupStats, toGroupStats, type GroupStats } from "./weight_donation_tree";
import { BMI } from "./weight_utils";

export type OutfitCompletedState = {
	gameName: string;
	gameSlug: string;
	characterName: string;
	characterSlug: string;
	name: string;
	nameSlug?: string;
	unlocked: boolean;
	outgrown: boolean;
	outgrownThresholdInLbs?: number;
	broken: boolean;
	weightInLbs: number;
	heightInMeters: number;
	BMI: number;
	frame: string;
	bgFrame: string;
	donationReceived: number;
	// weighsAsMuchAsTheXSmallestCharactersCombined: number;
	mainShape?: Shape;
	secondaryShape?: Shape;
	trait: string;
	build: Build;
}

export type CharacterCompletedState = {
	gameName: string;
	gameSlug: string
	name: string;
	nameSlug: string;
	unlocked: boolean;
	donationReceived: number;
	bgFrame: string;
	darkColor: string;
	lightColor: string;
	heightInMeters: number;
	outfits: OutfitCompletedState[];
	stats: GroupStats | null;
	build: Build;
}

export type GameCompletedState = {
	name: string;
	nameSlug: string;
	darkColor: string;
	lightColor: string;
	characters: CharacterCompletedState[];
	stats: GroupStats;
}

export type CompletedState = {
	games: GameCompletedState[];
	stats: GroupStats;
}

export function toCompletedState(state: GameState[]): CompletedState {
	const groupStats = toGroupStats(createWeightDonationTree(state));

	return {
		games: state.map(gameState => toGameCompletedState(gameState, baseMetadata, groupStats)),
		stats: groupStats,
	}
}

export function toGameCompletedState(state: GameState, baseMetadata: GameBaseMetadata[], rootGroupStats : GroupStats) : GameCompletedState {
	const gameMetadata = baseMetadata.find(gameMetadata => gameMetadata.nameSlug === state.slug) as GameBaseMetadata;
	const stats = getChildGroupStats(rootGroupStats, state.slug) as GroupStats;

	return {
		name: gameMetadata.name,
		nameSlug: state.slug,
		lightColor: gameMetadata.lightColor,
		darkColor: gameMetadata.darkColor,
		characters: state.characters.map(characterState => toCharacterCompletedState(characterState, gameMetadata, stats)),
		stats: stats,
	};
}

export function toCharacterCompletedState(state: CharacterState, gameMetadata: GameBaseMetadata, gameGroupStats: GroupStats): CharacterCompletedState {
	const characterMetadata = gameMetadata.characters.find(characterMetadata => characterMetadata.nameSlug === state.slug) as CharacterBaseMetadata;

	const outfits = state.outfits.map(outfitState => toOutfitCompletedState(outfitState, characterMetadata, gameMetadata));
	outfits.push(toBrokenOutfitState(state, characterMetadata, gameMetadata))

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		name: characterMetadata.name,
		nameSlug: state.slug,
		unlocked: isUnlocked(state),
		donationReceived: state.donationReceived,
		bgFrame: gameMetadata.nameSlug,
		darkColor: gameMetadata.darkColor,
		lightColor: gameMetadata.lightColor,
		heightInMeters: characterMetadata.heightInCm / 100.,
		outfits: outfits,
		stats: getChildGroupStats(gameGroupStats, state.slug),
		build: characterMetadata.build,
	}
}

export function toBrokenOutfitState(state: CharacterState, characterMetadata: CharacterBaseMetadata, gameMetadata: GameBaseMetadata): OutfitCompletedState {
	const unlocked = isUnlocked(state) && isOutgrown(state.outfits[state.outfits.length - 1]);
	const selectedOutfit = characterMetadata.outfits.find(outfit => outfit.outfitSlug === state.brokenOutfit.slug)

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		characterName: characterMetadata.name,
		characterSlug: characterMetadata.nameSlug,
		name: "Broken",
		nameSlug: state.brokenOutfit.slug,
		unlocked: unlocked,
		outgrown: false,
		broken: true,
		weightInLbs: state.brokenOutfit.weightInLbs,
		heightInMeters: characterMetadata.heightInCm / 100.,
		BMI: BMI(characterMetadata.heightInCm / 100., state.brokenOutfit.weightInLbs),
		mainShape: selectedOutfit?.mainShape,
		secondaryShape: selectedOutfit?.secondaryShape,
		donationReceived: state.donationReceived,
		frame: toFrameType(state.slug),
		bgFrame: gameMetadata.nameSlug,
		trait: state.brokenOutfit.trait || '',
		build: characterMetadata.build,
	}
}

export function toOutfitCompletedState(state: OutfitState, characterMetadata: CharacterBaseMetadata, gameMetadata: GameBaseMetadata): OutfitCompletedState {
	const outfitMetadata = characterMetadata.outfits.find(outfitMetadata => outfitMetadata.outfitSlug === state.slug) as OutfitBaseMetadata;

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		characterName: characterMetadata.name,
		characterSlug: characterMetadata.nameSlug,
		name: outfitMetadata?.outfit,
		nameSlug: state.slug,
		unlocked: state.unlocked,
		outgrown: isOutgrown(state),
		outgrownThresholdInLbs: state.thresholdInLbs,
		broken: false,
		weightInLbs: state.weightInLbs,
		heightInMeters: characterMetadata.heightInCm / 100.,
		BMI: BMI(characterMetadata.heightInCm / 100., state.weightInLbs),
		mainShape: outfitMetadata.mainShape,
		secondaryShape: outfitMetadata.secondaryShape,
		donationReceived: state.donationReceived,
		frame: toFrameType(state.slug),
		bgFrame: gameMetadata.nameSlug,
		trait: state.trait || '',
		build: characterMetadata.build,
	}
}

export function getCharacterCompletedState(state: CompletedState, characterSlug: string): CharacterCompletedState | undefined {
	for (const game of state.games) {
		for (const character of game.characters) {
			if (character.nameSlug === characterSlug) {
				return character;
			}
		}
	}
}

export function getOutfitCompletedState(state: CompletedState, characterSlug: string, outfitSlug: string): OutfitCompletedState | undefined {
	const character = getCharacterCompletedState(state, characterSlug)
	if (!character) {
		return undefined;
	}
	for (const outfit of character.outfits) {
		if (outfit.broken && outfitSlug === 'broken' || outfit.nameSlug === outfitSlug) {
			return outfit;
		}
	}
}
