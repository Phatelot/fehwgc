import { addSpilloverWeightToCharacter, attributeTraitToOutfit } from "./donation_engine";
import { baseMetadata, initialWeightForBuild, type CharacterBaseMetadata, type GameBaseMetadata, getGameMetadata, getCharacterMetadata, type Build } from "./metadata";
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
    groupSlug: string;
    outfits: OutfitState[];
    brokenOutfit: BrokenOutfitState;
	spillover: number;
}

export type OutfitKey = {
	characterSlug: string,
	outfitSlug: string,
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
	boundTo?: OutfitKey;
} | {
	unlocked: false;
	trait?: undefined;
	boundTo?: undefined;
})

export type BrokenOutfitState = {
    donationReceived: number;
    weightInLbs: number;
} & ({
	slug: string;
	trait: string;
} | {
	slug?: undefined;
	trait?: undefined;
})

export function initState(): GameState[] {
	return baseMetadata.map(initGameState)
}

function initGameState(baseMetadata: GameBaseMetadata): GameState {
	return {
		slug: baseMetadata.nameSlug,
		characters: baseMetadata.characters.flatMap(initCharacterState),
	}
}

function initCharacterState(baseMetadata: CharacterBaseMetadata): [CharacterState] | [] {
	const initialWeightInLbs = initialWeightForBuild(baseMetadata.build);

	const allOutfitsAreAddedLater = baseMetadata.outfits
		.map(o => o.introducedAfterDonation)
		.every(i => !!i);
	if (allOutfitsAreAddedLater) {
		return [];
	}

	return [{
		slug: baseMetadata.nameSlug,
		groupSlug: baseMetadata.group?.slug || 'no_group',
		outfits: baseMetadata.outfits.flatMap((outfitBaseMetadata, i) => {
			const unlocked = (i == 0 && baseMetadata.initialRoaster) || false

			if (!!outfitBaseMetadata.introducedAfterDonation) {
				return []
			}

			const outfitState = {
				slug: outfitBaseMetadata.outfitSlug,
				weightInLbs: initialWeightInLbs,
				donationReceived: 0,
				thresholdInLbs: outfitBaseMetadata.outfitWeightThresholdInLb,
				unlocked: unlocked,
				trait: unlocked ? selectTraitForInitial(baseMetadata) : undefined,
			} as OutfitState

			return [outfitState]
		}),
		brokenOutfit: {
			donationReceived: 0,
			weightInLbs: initialWeightInLbs,
		},
		spillover: 0,
	}]
}

export function isOutgrown(outfit: OutfitState): boolean {
    return outfit.weightInLbs >= outfit.thresholdInLbs
}

export function isFattenable(outfit: OutfitState): boolean {
	return ![
		'Bound_Feeder',
		'Chaos_Feeder',
		'Self_Feeder',
	].includes(outfit.trait || '');
}

export function heaviestOutfit(characterState: CharacterState): string | undefined {
	let outfitSlug = undefined;
	let weightInLbs = -1;
	for (let i = 0; i < characterState.outfits.length; i++) {
		const outfit = characterState.outfits[i]
		if (outfit.weightInLbs > weightInLbs) {
			outfitSlug = outfit.slug;
			weightInLbs = outfit.weightInLbs;
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
	return characterState.outfits.map(o => o.donationReceived).reduce((a, b) => a + b) +
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

export function getCurrentOutfitForCharacter(characterState: CharacterState) : OutfitState | BrokenOutfitState {
	if (!isUnlocked(characterState)) {
		return characterState.outfits[0];
	}
	for (let i = 0; i < characterState.outfits.length; i++) {
		const outfitState = characterState.outfits[i];
		if (!isOutgrown(outfitState) && isFattenable(outfitState)) {
			return outfitState
		}
	}
	return characterState.brokenOutfit;
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

export function addAdditionalCharactersAndOutfits(state: GameState[], donationNumber: number) {
	state.forEach(gameState => {
		const addedCharacters : CharacterState[] = [];

		getGameMetadata(gameState.slug)?.characters
			.filter(c => c.outfits[0].introducedAfterDonation === donationNumber)
			.forEach(characterBaseMetadata => {
				const characterToAdd = {
					slug: characterBaseMetadata.nameSlug,
					groupSlug: characterBaseMetadata.group?.slug || 'no_group',
					outfits: [],
					brokenOutfit: {
						donationReceived: 0,
						weightInLbs: initialWeightForBuild(characterBaseMetadata.build),
					},
					spillover: 0,
				};
				addedCharacters.push(characterToAdd);
				gameState.characters.push(characterToAdd);
			});

		gameState.characters.forEach(characterState => {
			const characterBaseMetadata = getCharacterMetadata(characterState.slug) as CharacterBaseMetadata;

			characterBaseMetadata.outfits
				.filter(o => o.introducedAfterDonation === donationNumber)
				.forEach(outfitBaseMetadata => {
					const lastOutfitIsOutgrown = characterState.outfits.length !== 0 && characterState.outfits.every(o => (isOutgrown(o) || !isFattenable(o)));

					const unlocked = lastOutfitIsOutgrown;

					const outfitState = {
						slug: outfitBaseMetadata.outfitSlug,
						weightInLbs: initialWeightForBuild(characterBaseMetadata.build),
						donationReceived: 0,
						thresholdInLbs: outfitBaseMetadata.outfitWeightThresholdInLb,
						unlocked: unlocked,
						trait: undefined,
					} as OutfitState;

					if (outfitState.unlocked) {
						attributeTraitToOutfit(state, characterState, outfitState, donationNumber);
					}

					characterState.outfits.push(outfitState);
				});
		});

		addedCharacters.forEach(addedCharacter => {
			addSpilloverWeightToCharacter(addedCharacter, getSpilloverForGroup(gameState, addedCharacter.groupSlug))
		})
	})
}

export function getSpilloverForGroup(gameState: GameState, groupSlug: string): number {
	return gameState.characters
		.filter(c => c.groupSlug === groupSlug)
		.map(c => c.spillover)
		.reduce((a, b) => a + b, 0);
}
