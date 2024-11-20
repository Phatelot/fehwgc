import { baseMetadata, initialWeightForBuild, type CharacterBaseMetadata, type GameBaseMetadata } from "./metadata";
import { selectTraitFor, selectTraitForInitial } from "./trait";

export type Donation = {
    character: string;
    outfit: string;
    amount: number;
};

export type GameState = {
    slug: string;
    characters: CharacterState[];
}

export type CharacterState = {
    slug: string;
    donationReceived: number;
    outfits: OutfitState[];
    brokenOutfit: BrokenOutfitState;
}

export type OutfitState = {
    slug: string;
    unlocked: boolean;
    donationReceived: number;
    weightInLbs: number;
    thresholdInLbs: number;
} & ({
	unlocked: true;
	trait: string;
} | {
	unlocked: false;
	trait: undefined;
})

export type BrokenOutfitState = {
    donationReceived: number;
    weightInLbs: number;
} & ({
	slug: string;
	trait: string;
} | {
	slug: undefined;
	trait: undefined;
})

export function initState(): GameState[] {
	return baseMetadata.map(initGameState)
}

function initGameState(baseMetadata: GameBaseMetadata): GameState {
	return {
		slug: baseMetadata.nameSlug,
		characters: baseMetadata.characters.map(initCharacterState),
	}
}

function initCharacterState(baseMetadata: CharacterBaseMetadata): CharacterState {
	return {
		slug: baseMetadata.nameSlug,
		donationReceived: 0,
		outfits: baseMetadata.outfits.map((outfitBaseMetadata, i) => {
			const unlocked = (i == 0 && baseMetadata.initialRoaster) || false

			const outfitState = {
				slug: outfitBaseMetadata.outfitSlug,
				weightInLbs: initialWeightForBuild(baseMetadata.build),
				donationReceived: 0,
				thresholdInLbs: outfitBaseMetadata.outfitWeightThresholdInLb,
				unlocked: unlocked,
				trait: unlocked ? selectTraitForInitial(baseMetadata) : undefined,
			} as OutfitState

			return outfitState
		}),
		brokenOutfit: {
			slug: undefined,
			donationReceived: 0,
			weightInLbs: 0,
			trait: undefined,
		}
	}
}

export function isOutgrown(outfit: OutfitState): boolean {
    return outfit.weightInLbs >= outfit.thresholdInLbs
}

export function outfitWithMostDonation(characterState: CharacterState): string | undefined {
	let outfitSlug = undefined;
	let donation = -1;
	for (let i = 0; i < characterState.outfits.length; i++) {
		const outfit = characterState.outfits[i]
		if (outfit.donationReceived > donation) {
			outfitSlug = outfit.slug;
			donation = outfit.donationReceived;
		}
	}
	return outfitSlug;
}

export function totalDonationsForCharacter(state: GameState[], nameSlug: string) : number {
	const characterState = getCharacterState(state, nameSlug);
	if (!characterState) {
		return 0;
	}
	return totalDonationsForCharacterState(characterState);
}

export function totalDonationsForCharacterState(characterState: CharacterState): number {
	return characterState.donationReceived +
		characterState.outfits.map(o => o.donationReceived).reduce((a, b) => a + b) +
		characterState.brokenOutfit.donationReceived;
}

export function getOutfitState(characterState: CharacterState, outfitSlug: string): OutfitState | BrokenOutfitState {
	if (outfitSlug === 'broken') {
		return characterState.brokenOutfit
	}
	for (const outfitState of characterState.outfits) {
		if (outfitState.slug === outfitSlug) {
			return outfitState
		}
	}
	throw `unknown outfit ${outfitSlug} for character ${characterState.slug}`
}

export function getCharacterState(state: GameState[], nameSlug: string) : CharacterState {
	for (const gameState of state) {
		for (const characterState of gameState.characters) {
			if (characterState.slug === nameSlug) {
				return characterState;
			}
		}
	}
	throw `unknown character ${nameSlug}`
}

export function isUnlocked(character: CharacterState) : boolean {
	return character.outfits[0].unlocked;
}

export function getGameState(state: GameState[], characterNameSlug: string) : GameState | null {
	for (const gameState of state) {
		for (const characterState of gameState.characters) {
			if (characterState.slug === characterNameSlug) {
				return gameState;
			}
		}
	}

	return null;
}
