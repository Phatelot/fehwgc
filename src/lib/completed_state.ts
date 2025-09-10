import { applyDonations } from "./donation_engine";
import { toFrameType } from "./frames";
import { baseMetadata, getCharacterMetadata, type Build, type CharacterBaseMetadata, type GameBaseMetadata, type OutfitBaseMetadata, type Shape, getOutfitMetadata } from "./metadata";
import { isOutgrown, type GameState, type OutfitState, type CharacterState, isUnlocked, getOutfitState, totalDonationsForCharacterState, type OutfitKey, getCharacterState, type Donation, initState } from "./state";
import { biggerThanTheXSmallestCombined } from "./stats_utils";
import { isSelfFed } from "./trait";
import { createWeightDonationTree, getChildGroupStats, toGroupStats, type GroupStats } from "./weight_donation_tree";
import { BMI } from "./weight_utils";

export type OutfitCompletedState = {
	gameName: string;
	gameSlug: string;
	groupName?: string;
	groupSlug?: string;
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
	mainShape?: Shape;
	secondaryShape?: Shape;
	trait: string;
	build: Build;
	isSelfFeeding: boolean;
	selfFedBy?: string;
	boundFeeding?: string;
	boundFedBy?: string;
	mutualGainingWith?: string;
	isChaosFeeder: boolean;
	isGreedyGuts: boolean;
	isBlobBound: boolean;
	isGenerous: boolean;
}

export type CharacterCompletedState = {
	gameName: string;
	gameSlug: string
	groupName?: string,
	groupSlug?: string,
	name: string;
	nameSlug: string;
	unlocked: boolean;
	donationReceived: number;
	bgFrame: string;
	darkColor: string;
	lightColor: string;
	heightInMeters: number;
	outfits: OutfitCompletedState[];
	numberOfUnlockedOutfits: number;
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

export function applyFilter(completedState: CompletedState, gameSlug: string, shape: string, trait: string): CompletedState {
	if (gameSlug === 'all' && shape == 'All' && trait == 'All') {
		return completedState;
	}

	let games = structuredClone(completedState.games.filter(g => (g.nameSlug === gameSlug) || gameSlug === 'all'));
	games.forEach(g => g.characters.forEach(c => {
			removeOtherShapes(c, shape);
			removeOtherTraits(c, trait);
		}
	))

	return {
		...completedState,
		games,
	};
}

function removeOtherShapes(character: CharacterCompletedState, shape: string) {
	if (shape == 'All') {
		return;
	}

	character.outfits = character.outfits.filter(o => ((o.mainShape || '') + (o.secondaryShape || '')) === shape)
}

function removeOtherTraits(character: CharacterCompletedState, trait: string) {
	if (trait == 'All') {
		return;
	}

	character.outfits = character.outfits.filter(o => (o.trait === trait))
}

export function toCompletedState(state: GameState[]): CompletedState {
	const groupStats = toGroupStats(createWeightDonationTree(state));

	return {
		games: state.map(gameState => toGameCompletedState(state, gameState, baseMetadata, groupStats)),
		stats: groupStats,
	}
}

export function toGameCompletedState(state: GameState[], gameState: GameState, baseMetadata: GameBaseMetadata[], rootGroupStats: GroupStats): GameCompletedState {
	const gameMetadata = baseMetadata.find(gameMetadata => gameMetadata.nameSlug === gameState.slug) as GameBaseMetadata;
	const stats = getChildGroupStats(rootGroupStats, gameState.slug) as GroupStats;

	return {
		name: gameMetadata.name,
		nameSlug: gameState.slug,
		lightColor: gameMetadata.lightColor,
		darkColor: gameMetadata.darkColor,
		characters: gameState.characters.map(characterState => toCharacterCompletedState(state, characterState, gameMetadata, stats)),
		stats: stats,
	};
}

export function toCharacterCompletedState(state: GameState[], characterState: CharacterState, gameMetadata: GameBaseMetadata, gameGroupStats: GroupStats): CharacterCompletedState {
	const characterMetadata = gameMetadata.characters.find(characterMetadata => characterMetadata.nameSlug === characterState.slug) as CharacterBaseMetadata;

	const outfits = characterState.outfits.map(outfitState => toOutfitCompletedState(state, characterState, outfitState, characterMetadata, gameMetadata));
	outfits.push(toBrokenOutfitState(characterState, characterMetadata, gameMetadata))

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		groupName: characterMetadata.group?.name,
		groupSlug: characterMetadata.group?.slug,
		name: characterMetadata.name,
		nameSlug: characterState.slug,
		unlocked: isUnlocked(characterState),
		donationReceived: totalDonationsForCharacterState(characterState),
		bgFrame: gameMetadata.nameSlug,
		darkColor: gameMetadata.darkColor,
		lightColor: gameMetadata.lightColor,
		heightInMeters: characterMetadata.heightInCm / 100.,
		outfits: outfits,
		numberOfUnlockedOutfits: outfits.filter(outfit => outfit.unlocked).length,
		stats: getChildGroupStats(gameGroupStats, characterState.slug),
		build: characterMetadata.build,
	}
}

export function toBrokenOutfitState(characterState: CharacterState, characterMetadata: CharacterBaseMetadata, gameMetadata: GameBaseMetadata): OutfitCompletedState {
	const unlocked = !!characterState.brokenOutfit.trait;
	const selectedOutfit = characterMetadata.outfits.find(outfit => outfit.outfitSlug === characterState.brokenOutfit.slug)

	const characterHeight = (() => {
		if (characterState.slug === 'edelgard' && characterState.brokenOutfit.slug === 'fallen') {
			return 2.54;
		} else if (characterState.slug === 'ena') {
			return 4.89;
		} else if (characterState.slug === 'heiorun') {
			return 3.90;
		} else if (characterState.slug === 'hraesvelgr') {
			return 3.16;
		} else if (characterState.slug === 'niohoggr') {
			return 4.50;
		}
		return characterMetadata.heightInCm / 100.;
	})();

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		groupName: characterMetadata.group?.name,
		groupSlug: characterMetadata.group?.slug,
		characterName: characterMetadata.name,
		characterSlug: characterMetadata.nameSlug,
		name: "Broken",
		nameSlug: characterState.brokenOutfit.slug,
		unlocked: unlocked,
		outgrown: false,
		broken: true,
		weightInLbs: characterState.brokenOutfit.weightInLbs,
		heightInMeters: characterHeight,
		BMI: BMI(characterHeight, characterState.brokenOutfit.weightInLbs),
		mainShape: selectedOutfit?.mainShape,
		secondaryShape: selectedOutfit?.secondaryShape,
		donationReceived: characterState.brokenOutfit.donationReceived,
		frame: toFrameType(characterState.slug),
		bgFrame: gameMetadata.nameSlug,
		trait: characterState.brokenOutfit.trait || '',
		build: (['ena', 'heiorun', 'hraesvelgr', 'niohoggr'].indexOf(characterState.slug) >= 0) ? 'Giant' : characterMetadata.build,
		isSelfFeeding: false,
		selfFedBy: isSelfFed(characterState) ? getSelfFeedingOutfitDisplayName(characterState) : undefined,
		isBlobBound: false,
		isChaosFeeder: false,
		isGreedyGuts: false,
		isGenerous: false,
	}
}

export function toOutfitCompletedState(state: GameState[], characterState: CharacterState, outfitState: OutfitState, characterMetadata: CharacterBaseMetadata, gameMetadata: GameBaseMetadata): OutfitCompletedState {
	const outfitMetadata = characterMetadata.outfits.find(outfitMetadata => outfitMetadata.outfitSlug === outfitState.slug) as OutfitBaseMetadata;

	const boundOutfitState = getBoundOutfitState(state, outfitState.boundTo);
	const boundOutfitDisplayName = getDisplayNameFromOutfitKey(outfitState.boundTo);

	return {
		gameName: gameMetadata.name,
		gameSlug: gameMetadata.nameSlug,
		groupName: characterMetadata.group?.name,
		groupSlug: characterMetadata.group?.slug,
		characterName: characterMetadata.name,
		characterSlug: characterMetadata.nameSlug,
		name: outfitMetadata?.outfit,
		nameSlug: outfitState.slug,
		unlocked: outfitState.unlocked,
		outgrown: isOutgrown(outfitState),
		outgrownThresholdInLbs: outfitState.thresholdInLbs,
		broken: false,
		weightInLbs: outfitState.weightInLbs,
		heightInMeters: characterMetadata.heightInCm / 100.,
		BMI: BMI(characterMetadata.heightInCm / 100., outfitState.weightInLbs),
		mainShape: outfitMetadata.mainShape,
		secondaryShape: outfitMetadata.secondaryShape,
		donationReceived: outfitState.donationReceived,
		frame: toFrameType(outfitState.slug),
		bgFrame: gameMetadata.nameSlug,
		trait: outfitState.trait || '',
		build: characterMetadata.build,
		isSelfFeeding: outfitState.trait === 'Self_Feeder',
		selfFedBy: (isSelfFed(characterState) && outfitState.trait !== 'Self_Feeder') ? getSelfFeedingOutfitDisplayName(characterState) : undefined,
		boundFeeding: outfitState.trait === "Bound_Feeder" ? getDisplayNameFromOutfitKey(outfitState.boundTo) : undefined,
		boundFedBy: boundOutfitState?.trait === "Bound_Feeder" ? boundOutfitDisplayName : undefined,
		mutualGainingWith: (outfitState.trait === "Mutual_Gainer" || boundOutfitState?.trait === "Mutual_Gainer") ? boundOutfitDisplayName : undefined,
		isBlobBound: outfitState.trait === 'Blob_Bound',
		isChaosFeeder: outfitState.trait === 'Chaos_Feeder',
		isGreedyGuts: outfitState.trait === 'Greedy_Guts',
		isGenerous: outfitState.trait === 'Generous',
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

function getBoundOutfitState(state: GameState[], outfitKey: OutfitKey | undefined): OutfitState | undefined {
	if (!outfitKey) {
		return undefined;
	}
	return getOutfitState(getCharacterState(state, outfitKey.characterSlug), outfitKey.outfitSlug) as OutfitState;
}


function getSelfFeedingOutfitDisplayName(character: CharacterState): string {
	const selfFeederOutfits = character.outfits.filter(o => o.trait === 'Self_Feeder');
	if (selfFeederOutfits.length === 0) {
		return ""
	}
	return getDisplayNameFromOutfitKey({
		characterSlug: character.slug,
		outfitSlug: selfFeederOutfits[0].slug,
	})
}

function getDisplayNameFromOutfitKey(key: OutfitKey | undefined): string {
	if (!key) {
		return '';
	}
	const characterMetadata = getCharacterMetadata(key.characterSlug) as CharacterBaseMetadata;
	const outfitMetadata = getOutfitMetadata(key.characterSlug, key.outfitSlug) as OutfitBaseMetadata;
	return `${characterMetadata.name} (${outfitMetadata.outfit})`;
}

export type Omnistate = {
	states: GameState[][];
	completedState: CompletedState;
	donations: Donation[];
};

export function donationsToOmnistate(donations: Donation[]): Omnistate {
	const states = applyDonations(initState(), donations)
	const lastState = states[states.length - 1];

	return {
		states,
		completedState: toCompletedState(lastState),
		donations,
	};
}

export function getHeaviestOutfitSlug(state: CharacterCompletedState): string {
	if (!state.outfits || !state.outfits.length) {
		return 'base';
	}

	if (!state.outfits.filter(o => o.unlocked).length) {
		return state.outfits[0].nameSlug as string
	}

	return state.outfits
		.filter(o => o.unlocked)
		.sort((a, b) => b.weightInLbs - a.weightInLbs)[0].nameSlug || 'base';
}

export function weighAsMuchAsTheXSmallest(outfitState: OutfitCompletedState, state: CompletedState): number {
	return biggerThanTheXSmallestCombined(state.stats.sortedWeightsInLbs, outfitState.weightInLbs);
}
