import { stringToRandomNumber } from "./rng";
import { type CharacterState, type GameState, type Donation, type OutfitState, type BrokenOutfitState, getCharacterState, getGameState, getOutfitState, isOutgrown, totalDonationsForCharacterState, outfitWithMostDonation, isUnlocked, type OutfitKey, isFattenable, getCurrentOutfitForCharacter } from "./state";
import { isSelfFed, selectTraitFor, selectTraitForBroken } from "./trait";

const UNLOCK_CHARACTER_THRESHOLD_IN_CAD = 120;

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
		applyDonationToCharacter(state, characterState, donation, true);
	} else {
		const outfitState = getOutfitState(characterState, donation.outfit);
		applyDonationToOutfit(state, characterState, outfitState, donation.amount, true);
	}

	return state;
}

function applyDonationToCharacter(state: GameState[], characterState: CharacterState, donation: Donation, updateDonationReceived: boolean) {
	let remainingDonationAmount = donation.amount;

	while (remainingDonationAmount > 0) {
		const chunk = Math.min(remainingDonationAmount, 10);
		const currentOutfit = getCurrentOutfitForCharacter(characterState);
		applyDonationToOutfit(state, characterState, currentOutfit, chunk, updateDonationReceived);
		remainingDonationAmount -= chunk;
	}
}

function applyDonationToOutfit(state: GameState[], characterState: CharacterState, outfitState: OutfitState | BrokenOutfitState, amount: number, updateDonationReceived: boolean) {
	const effectiveDonationAfterUnlockThreshold = Math.max(0, amount - requiredRemainingAmountToUnlock(characterState));
	if (updateDonationReceived) {
		outfitState.donationReceived += amount;
	}
	updateCharacterStateUnlock(state, characterState);

	if (isSelfFed(characterState)) {
		if (outfitState.trait === "Self_Feeder") {
			// How convoluted do you want your code to be? - Yes.
			applyDonationToCharacter(state, characterState, {
				amount: effectiveDonationAfterUnlockThreshold,
				character: characterState.slug,
				outfit: 'undeclared',
			}, false)
		} else {
			addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold * 2)
			addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold * 2)
			applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2)
		}
	} else {
		switch (outfitState.trait) {
		case "Greedy_Guts":
			addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold * 2)
			addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold * 2)
			break;
		case "Blob_Bound":
			addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold * 1.5)
			addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold * 1.5)
			applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2)
			break;
		case "Generous":
			addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold * 0.5)
			addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold * 0.5)
			applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.4)
			break;
		case "Mutual_Gainer":
			{
				addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold);
				addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold);
				applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2);
				const targetOutfitKey = (outfitState as OutfitState)?.boundTo as OutfitKey;
				const targetCharacterState = getCharacterState(state, targetOutfitKey.characterSlug);
				const targetOutfitState = getOutfitState(targetCharacterState, targetOutfitKey.outfitSlug) as OutfitState;
				feed(state, targetCharacterState, targetOutfitState, effectiveDonationAfterUnlockThreshold);
			}
			break;
		case "Bound_Feeder":
			{
				addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold);
				applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2);
				const targetOutfitKey = (outfitState as OutfitState)?.boundTo as OutfitKey;
				const targetCharacterState = getCharacterState(state, targetOutfitKey.characterSlug);
				const targetOutfitState = getOutfitState(targetCharacterState, targetOutfitKey.outfitSlug) as OutfitState;
				feed(state, targetCharacterState, targetOutfitState, effectiveDonationAfterUnlockThreshold * 2);
			}
			break;
		case "Chaos_Feeder":
			{
				addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold);
				applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2);
				const possibleTargets = getPossibleBoundTargets(state, false);
				const targetOutfitKey = possibleTargets[stringToRandomNumber(`${outfitState.slug}${totalDonationsForCharacterState(characterState)}`, possibleTargets.length)]
				const targetCharacterState = getCharacterState(state, targetOutfitKey.characterSlug);
				const targetOutfitState = getOutfitState(targetCharacterState, targetOutfitKey.outfitSlug) as OutfitState;
				feed(state, targetCharacterState, targetOutfitState, effectiveDonationAfterUnlockThreshold * 3);

				const secondaryTargetOutfitKey = (targetOutfitState as OutfitState)?.boundTo;
				if (secondaryTargetOutfitKey) {
					const secondaryTargetCharacterState = getCharacterState(state, secondaryTargetOutfitKey.characterSlug);
					const secondaryTargetOutfitState = getOutfitState(secondaryTargetCharacterState, secondaryTargetOutfitKey.outfitSlug) as OutfitState;
					if (secondaryTargetOutfitState.trait === 'Mutual_Gainer' || targetOutfitState.trait === 'Mutual_Gainer') {
						feed(state, secondaryTargetCharacterState, secondaryTargetOutfitState, effectiveDonationAfterUnlockThreshold * 3);
					}
				}
			}
			break;
		default:
			addWeightToOutfit(outfitState, effectiveDonationAfterUnlockThreshold)
			addWeightToOutfit(characterState.brokenOutfit, effectiveDonationAfterUnlockThreshold)
			applySpilloverOnGroup(state, characterState.slug, characterState.groupSlug, amount * 0.2);
			break;
		}
	}

	const targetOutfitKey = (outfitState as OutfitState)?.boundTo;
	if (targetOutfitKey) {
		const targetCharacterState = getCharacterState(state, targetOutfitKey.characterSlug);
		const targetOutfitState = getOutfitState(targetCharacterState, targetOutfitKey.outfitSlug) as OutfitState;
		if (targetOutfitState.trait === 'Mutual_Gainer') {
			feed(state, targetCharacterState, targetOutfitState, effectiveDonationAfterUnlockThreshold);
		}
	}
	updateCharacterStateUnlock(state, characterState);
}

function feed(state: GameState[], characterState: CharacterState, outfitState: OutfitState, amount: number) {
	if (isSelfFed(characterState)) {
		if (outfitState.trait === "Self_Feeder") { // that case can only happen because of Chaos Feeders
			// How convoluted do you want your code to be? - Yes.
			applyDonationToCharacter(state, characterState, {
				amount: amount,
				character: characterState.slug,
				outfit: 'undeclared',
			}, false)
		} else {
			addWeightToOutfit(outfitState, amount * 2);
			addWeightToOutfit(characterState.brokenOutfit, amount * 2);
		}
	} else {
		switch(outfitState.trait) {
		case 'Bound_Feeder':
			addWeightToOutfit(characterState.brokenOutfit, amount);
			const secondaryTargetOutfitKey = (outfitState as OutfitState)?.boundTo;
			if (secondaryTargetOutfitKey) {
				const secondaryTargetCharacterState = getCharacterState(state, secondaryTargetOutfitKey.characterSlug);
				const secondaryTargetOutfitState = getOutfitState(secondaryTargetCharacterState, secondaryTargetOutfitKey.outfitSlug) as OutfitState;
				feed(state, secondaryTargetCharacterState, secondaryTargetOutfitState, amount * 2);
			}
			break;
		case 'Greedy_Guts':
			addWeightToOutfit(outfitState, amount * 2);
			addWeightToOutfit(characterState.brokenOutfit, amount * 2);
			break;
		case 'Blob_Bound':
			addWeightToOutfit(outfitState, amount * 1.5);
			addWeightToOutfit(characterState.brokenOutfit, amount * 1.5);
			break;
		default:
			addWeightToOutfit(outfitState, amount);
			addWeightToOutfit(characterState.brokenOutfit, amount);
			break;
		}
	}
	updateCharacterStateUnlock(state, characterState);
}

function applySpilloverOnGroup(state: GameState[], characterNameSlug: string, groupSlug: string, spillover: number) {
	getGameState(state, characterNameSlug)?.characters
		.filter(characterStateForSpillOver => characterStateForSpillOver.groupSlug === groupSlug)
		.forEach(characterStateForSpillOver => {
			addSpilloverWeightToCharacter(characterStateForSpillOver, spillover)
			updateCharacterStateUnlock(state, characterStateForSpillOver);
	})
}

function addWeightToOutfit(outfitState: OutfitState | BrokenOutfitState, weightInLbs: number) {
	outfitState.weightInLbs += weightInLbs;
}

function addSpilloverWeightToCharacter(characterState: CharacterState, weightInLbs: number) {
	let remainingWeightToAddInLbs = weightInLbs;
	let i = 0;
	while (remainingWeightToAddInLbs > 0 && i < characterState.outfits.length) {
		const outfit = characterState.outfits[i]
		const weightUntilOutgrown = Math.max(0, outfit.thresholdInLbs - outfit.weightInLbs);
		if (isFattenable(outfit)) {
			const weightToOutfit = Math.min(remainingWeightToAddInLbs, weightUntilOutgrown)
			remainingWeightToAddInLbs -= weightToOutfit
			outfit.weightInLbs += weightToOutfit
			characterState.brokenOutfit.weightInLbs += weightToOutfit
		}
		i++
	}
	characterState.brokenOutfit.weightInLbs += remainingWeightToAddInLbs * 2
}

export function updateCharacterStateUnlock(state: GameState[], characterState: CharacterState) {
	const characterIsUnlocked = (totalDonationsForCharacterState(characterState) >= UNLOCK_CHARACTER_THRESHOLD_IN_CAD) || isUnlocked(characterState);
	if (!characterIsUnlocked || characterState.brokenOutfit.slug) {
		return;
	}
	const firstOutfit = characterState.outfits[0]
	firstOutfit.unlocked = true
	if (!firstOutfit.trait) {
		attributeTraitToOutfit(state, characterState, firstOutfit);
	}

	for (let i = 0; i < characterState.outfits.length - 1; i++) {
		if (isFattenable(characterState.outfits[i]) && !isOutgrown(characterState.outfits[i])) {
			break;
		}
		const nextOutfit = characterState.outfits[i+1];
		nextOutfit.unlocked = true
		if (nextOutfit.trait) {
			continue;
		}
		attributeTraitToOutfit(state, characterState, nextOutfit);
	}
	const lastOutfit = characterState.outfits[characterState.outfits.length - 1];
	if (lastOutfit.unlocked && (!isFattenable(lastOutfit) || isOutgrown(lastOutfit))) {
		if (!characterState.brokenOutfit.slug) {
			characterState.brokenOutfit.slug = outfitWithMostDonation(characterState)
			characterState.brokenOutfit.trait = selectTraitForBroken(characterState)
		}
	}
}

function attributeTraitToOutfit(state: GameState[], characterState: CharacterState, outfitState: OutfitState) {
	outfitState.trait = selectTraitFor(characterState, outfitState)
	const possibleBoundTargets = getPossibleBoundTargets(state, true)
		.filter(o => o.characterSlug !== characterState.slug || o.outfitSlug !== outfitState.slug); // prevent self-targeting
	const boundOutfitKey = possibleBoundTargets[stringToRandomNumber(`${outfitState.slug}${totalDonationsForCharacterState(characterState)}`, possibleBoundTargets.length)]

	if (outfitState.trait === 'Bound_Feeder') {
		outfitState.boundTo = boundOutfitKey;
	} else if (outfitState.trait === 'Mutual_Gainer') {
		outfitState.boundTo = boundOutfitKey;
		const boundOutfitState = getOutfitState(getCharacterState(state, boundOutfitKey.characterSlug), boundOutfitKey.outfitSlug) as OutfitState
		boundOutfitState.boundTo = {
			characterSlug: characterState.slug,
			outfitSlug: outfitState.slug,
		}
	}
}

export function getPossibleBoundTargets(state: GameState[], excludeBound: boolean): OutfitKey[] {
	return state
		.flatMap(gameState => gameState.characters)
		.flatMap(characterState => characterState.outfits
			.map(outfitState => ({
				characterSlug: characterState.slug,
				outfitState,
			}))
		)
		.filter(o => o.outfitState.unlocked) // only unlocked outfits...
		.filter(o => !excludeBound || !o.outfitState.boundTo) // ... that aren't themselves targeting another outfit, or targets of another outfit
		.filter(o => o.outfitState.trait !== "Chaos_Feeder") // Chaos feeders are always excluded...
		.filter(o => o.outfitState.trait !== "Self_Feeder") // ... as are self-feeders
		.map(o => ({
			characterSlug: o.characterSlug,
			outfitSlug: o.outfitState.slug,
		}));
}

export function requiredRemainingAmountToUnlock(character: CharacterState): number {
	return Math.max(0, UNLOCK_CHARACTER_THRESHOLD_IN_CAD - totalDonationsForCharacterState(character));
}
