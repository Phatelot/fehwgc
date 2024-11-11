import { type CharacterState, type GameState, type Donation, type OutfitState, type BrokenOutfitState, getCharacterState, getGameState, getOutfitState, isOutgrown, totalDonationsForCharacterState, outfitWithMostDonation, isUnlocked } from "./state";
import { selectTraitFor, selectTraitForBroken } from "./trait";

const UNLOCK_CHARACTER_THRESHOLD_IN_CAD = 125;

export function applyDonations(state: GameState[], donations: Donation[]): GameState[][] {
	const states : GameState[][] = [state];
	for (const donation of donations) {
	  states.push(applyDonation(states[states.length-1], donation));
	}
	return states;
}

export function applyDonation(state: GameState[], donation: Donation) : GameState[] {
	state = structuredClone(state);
	const characterState = getCharacterState(state, donation.character);
	if (donation.outfit === 'undeclared') {
		characterState.donationReceived += donation.amount;
		addWeightTo(characterState, donation.amount)
	} else {
		const outfitState = getOutfitState(characterState, donation.outfit);
		outfitState.donationReceived += donation.amount;
		addWeightToOutfit(outfitState, donation.amount)
	}
	addWeightToOutfit(characterState.brokenOutfit, donation.amount)
	getGameState(state, donation.character)?.characters.forEach(characterState => {
		addWeightTo(characterState, donation.amount * 0.2)
		addWeightToOutfit(characterState.brokenOutfit, donation.amount * 0.2)
		updateCharacterStateUnlock(characterState);
	})
	return state;
}

function addWeightToOutfit(outfitState: OutfitState | BrokenOutfitState, weightInLbs: number) {
	outfitState.weightInLbs += weightInLbs;
}

function addWeightTo(characterState: CharacterState, weightInLbs: number) {
	let remainingWeightToAddInLbs = weightInLbs;
	let i = 0;
	while (remainingWeightToAddInLbs > 0 && i < characterState.outfits.length) {
		const outfit = characterState.outfits[i]
		const weightUntilOutgrown = Math.max(0, outfit.thresholdInLbs - outfit.weightInLbs);
		const weightToOutfit = Math.min(remainingWeightToAddInLbs, weightUntilOutgrown)
		remainingWeightToAddInLbs -= weightToOutfit
		outfit.weightInLbs += weightToOutfit
		i++
	}
	characterState.brokenOutfit.weightInLbs += remainingWeightToAddInLbs
}

export function updateCharacterStateUnlock(characterState: CharacterState) {
	const characterIsUnlocked = (totalDonationsForCharacterState(characterState) >= UNLOCK_CHARACTER_THRESHOLD_IN_CAD) || isUnlocked(characterState);
	if (!characterIsUnlocked || characterState.brokenOutfit.slug) {
		return;
	}
	const firstOutfit = characterState.outfits[0]
	firstOutfit.unlocked = true
	firstOutfit.trait = selectTraitFor(characterState, firstOutfit)

	for (let i = 0; i < characterState.outfits.length - 1; i++) {
		if (isOutgrown(characterState.outfits[i])) {
			const nextOutfit = characterState.outfits[i+1];
			nextOutfit.unlocked = true
			nextOutfit.trait = selectTraitFor(characterState, nextOutfit)
		} else {
			break;
		}
	}
	const lastOutfit = characterState.outfits[characterState.outfits.length - 1];
	if (lastOutfit.unlocked && lastOutfit.weightInLbs >= lastOutfit.thresholdInLbs) {
		characterState.brokenOutfit.slug = outfitWithMostDonation(characterState)
		characterState.brokenOutfit.trait = selectTraitForBroken(characterState)
	}
}
