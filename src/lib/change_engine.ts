import { getCharacterDisplayName, getCharacterOutfitDisplayName } from "./metadata";
import { isOutgrown, type GameState, type OutfitState, type CharacterState } from "./state";
import { formatWeight } from "./weight_utils";

const insignificantChangeThresholdInLbs = 1;

export type CharacterChange = {
	slug: string;
	unlocked: boolean;
	brokenUnlockSlug?: string;
	brokenWeightGainInLbs: number;
	outfitChanges: OutfitChange[];
	newState: CharacterState;
}

type OutfitChange = {
	slug: string;
	unlocked: boolean;
	weightGainedInLbs: number;
	outgrown: boolean;
	newState: OutfitState;
}

export function serializeChanges(states: GameState[][]) : string[] {
	if (states.length <= 1) {
		return []
	}

	const changes = toGamesChanges(states[0], states[states.length-1])
	return changes.flatMap(serializeCharacterChanges);
}

function toGamesChanges(before: GameState[], after: GameState[]): CharacterChange[] {
	const changes : CharacterChange[] = [];
	for (let i = 0; i < before.length; i++) {
		changes.push(...toGameChanges(before[i], after[i]))
	}
	return changes.sort(compareSignificanceOfCharacterChange).reverse();
}

function toGameChanges(before: GameState, after: GameState): CharacterChange[] {
	const changes = [];
	for (let i = 0; i < before.characters.length; i++) {
		const change = toCharacterChange(before.characters[i], after.characters[i])
		if (change) {
			changes.push(change)
		}
	}
	return changes;
}

export function toCharacterChange(before: CharacterState, after: CharacterState): CharacterChange | null {
	const outfitChanges = [];
	for (let i = 0; i < before.outfits.length; i++) {
		const outfitChange = toOutfitChange(before.outfits[i], after.outfits[i]);
		if (!!outfitChange) {
			outfitChanges.push(outfitChange)
		}
	}

	const brokenWeightGain = after.brokenOutfit.weightInLbs - before.brokenOutfit.weightInLbs;
	if (outfitChanges.length === 0 && brokenWeightGain < insignificantChangeThresholdInLbs) {
		return null;
	}

	return {
		slug: before.slug,
		unlocked: outfitChanges.length > 0 ? outfitChanges[0].unlocked : false,
		brokenUnlockSlug: !before.brokenOutfit.slug ? after.brokenOutfit.slug : undefined,
		brokenWeightGainInLbs: brokenWeightGain,
		outfitChanges: outfitChanges.sort(compareSignificanceOfOutfitChanges).reverse(),
		newState: after,
	}
}

export function toOutfitChange(before: OutfitState, after: OutfitState): OutfitChange | null {
	const isOutgrownBefore = isOutgrown(before);
	const isOutgrownAfter = isOutgrown(after);

	if (!after.unlocked) {
		return null;
	}

	if (before.unlocked === after.unlocked && (after.weightInLbs - before.weightInLbs < insignificantChangeThresholdInLbs) && isOutgrownBefore === isOutgrownAfter) {
		return null;
	}
	return {
		slug: before.slug,
		unlocked: before.unlocked !== after.unlocked,
		weightGainedInLbs: after.weightInLbs - before.weightInLbs,
		outgrown: isOutgrownBefore != isOutgrownAfter,
		newState: after,
	}
}

function compareSignificanceOfCharacterChange(changeA: CharacterChange, changeB: CharacterChange): number {
	const weightDiff = characterWeightGainedInLbs(changeA) -  characterWeightGainedInLbs(changeB)
	if (!weightDiff) {
		return changeA.slug.localeCompare(changeB.slug)
	}
	return weightDiff;
}

export function characterWeightGainedInLbs(characterChange: CharacterChange): number {
	return characterChange.outfitChanges.map(change => change.weightGainedInLbs).reduce((a, b) => a + b, 0) + characterChange.brokenWeightGainInLbs;
}

function compareSignificanceOfOutfitChanges(changeA: OutfitChange, changeB: OutfitChange): number {
	const weightDiff = changeA.weightGainedInLbs - changeB.weightGainedInLbs;
	if (!weightDiff) {
		return (changeA.slug).localeCompare(changeB.slug)
	}
	return weightDiff;
}

function serializeCharacterChanges(change: CharacterChange): string[] {
	const sentences: string[] = [];
	const characterDisplayName = getCharacterDisplayName(change.slug);

	if (change.unlocked && change.brokenUnlockSlug) {
		sentences.push(
			`${characterDisplayName} has just been unlocked and has already outgrown all her outfits.`,
			`Her broken outfit is '${getCharacterOutfitDisplayName(change.slug, change.brokenUnlockSlug)}.'`
		)
	} else if (change.unlocked) {
		sentences.push(`${characterDisplayName} has just been unlocked and is ready to outgrow her outfits.`)
	} else if (change.brokenUnlockSlug) {
		sentences.push(
			`${characterDisplayName} has outgrown all her outfits.`,
			`Her broken outfit is '${getCharacterOutfitDisplayName(change.slug, change.brokenUnlockSlug)}'.`
		)
	} else if (change.newState.brokenOutfit.slug && change.brokenWeightGainInLbs >= insignificantChangeThresholdInLbs) {
		sentences.push(`${characterDisplayName} has gained ${formatWeight(change.brokenWeightGainInLbs)}lbs in her broken outfit.`)
	}

	sentences.push(...change.outfitChanges.map(outfitChange => serializeOutfitChanges(characterDisplayName, change.slug, outfitChange)))

	return sentences;
}

function serializeOutfitChanges(characterDisplayName: string, characterSlug: string, change: OutfitChange): string {
	const outfitName = getCharacterOutfitDisplayName(characterSlug, change.slug).toLowerCase();

	if (change.unlocked && change.outgrown) {
		return `${characterDisplayName}'s ${outfitName} outfit has been unlocked and already outgrown (weight: ${formatWeight(change.newState.weightInLbs)}lbs).`
	}
	if (change.unlocked) {
		return `${characterDisplayName}'s ${outfitName} outfit has been unlocked (weight: ${formatWeight(change.newState.weightInLbs)}lbs).`
	}
	if (change.outgrown) {
		return `${characterDisplayName} has outgrown her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`
	}
	return `${characterDisplayName} is stretching her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`
}
