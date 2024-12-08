import { getCharacterDisplayName, getCharacterOutfitDisplayName } from "./metadata";
import { isOutgrown, type GameState, type OutfitState, type CharacterState } from "./state";
import { traitNames } from "./trait";
import { formatMoney } from "./utils";
import { formatWeight } from "./weight_utils";

const insignificantChangeThresholdInLbs = 1;

export type CharacterChange = {
	slug: string;
	unlocked: boolean;
	brokenUnlockSlug?: string;
	brokenUnlockTrait?: string;
	brokenWeightGainInLbs: number;
	outfitChanges: OutfitChange[];
	newState: CharacterState;
}

type OutfitChange = {
	slug: string;
	unlocked: boolean;
	donationReceived: number;
	trait?: string;
	weightGainedInLbs: number;
	outgrown: boolean;
	newState: OutfitState;
}

export function serializeChanges(states: GameState[][]) : string[] {
	if (states.length <= 1) {
		return []
	}

	const changes = toGamesChanges(states[0], states[states.length-1])
	return changes.map(serializeCharacterChanges)
		.filter(scc => scc && scc.length > 0)
		.flatMap((scc, i) => {
			if (i === 0) {
				return scc;
			}
			return ['\n', ...scc]
		});
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
		brokenUnlockTrait: !before.brokenOutfit.trait ? after.brokenOutfit.trait : undefined,
		brokenWeightGainInLbs: brokenWeightGain,
		outfitChanges: outfitChanges.sort(compareSignificanceOfOutfitChanges).reverse(),
		newState: after,
	}
}

export function toOutfitChange(before: OutfitState, after: OutfitState): OutfitChange | null {
	const isOutgrownBefore = isOutgrown(before);
	const isOutgrownAfter = isOutgrown(after);

	const donationReceived = after.donationReceived - before.donationReceived;

	if (!after.unlocked && !donationReceived) {
		return null;
	}

	if (!donationReceived && before.unlocked === after.unlocked && (after.weightInLbs - before.weightInLbs < insignificantChangeThresholdInLbs) && isOutgrownBefore === isOutgrownAfter) {
		return null;
	}
	return {
		slug: before.slug,
		unlocked: before.unlocked !== after.unlocked,
		donationReceived,
		trait: !before.unlocked ? after.trait : undefined,
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

function traitName(traitSlug?: string): string {
	return traitNames[traitSlug || ''].toLowerCase();
}


function serializeCharacterChanges(change: CharacterChange): string[] {
	return characterChangesToTemplates(change).map((t, i) => i != 0 && t.valueIfNotFirst ? t.valueIfNotFirst : t.value);
}

type ChangeSentenceTemplate = {
	value: string;
	valueIfNotFirst?: string;
}

function characterChangesToTemplates(change: CharacterChange): ChangeSentenceTemplate[] {
	const sentences: ChangeSentenceTemplate[] = [];
	const characterDisplayName = getCharacterDisplayName(change.slug);

	const donationReceived = change.outfitChanges
		.map(c => c.donationReceived)
		.reduce((a, b) => a + b, 0);

	const outfitIfDonationToOnlyOne: OutfitChange | undefined = change.outfitChanges
		.filter(c => c.donationReceived === donationReceived)
		.at(0);

	const outfitNameIfDonationToOnlyOne: string | undefined = (outfitIfDonationToOnlyOne ? [outfitIfDonationToOnlyOne] : [])
		.map(c => getCharacterOutfitDisplayName(change.slug, c.slug))
		.map(outfitName => `${characterDisplayName} (${outfitName})`)
		.at(0);

	if (donationReceived > 0) {
		sentences.push({value: `${outfitNameIfDonationToOnlyOne || characterDisplayName} receives $${formatMoney(donationReceived)}!`})
	}

	if (change.unlocked && change.brokenUnlockSlug) {
		sentences.push(
			{
				value: `${characterDisplayName} has just been unlocked and has already outgrown all her outfits.`,
				valueIfNotFirst: `She has just been unlocked and has already outgrown all her outfits.`,
			},
			{
				value: `Her broken outfit is '${getCharacterOutfitDisplayName(change.slug, change.brokenUnlockSlug)}' (trait: ${traitName(change.brokenUnlockTrait)}).`,
			},
		)
	} else if (change.unlocked) {
		sentences.push({
			value: `${characterDisplayName} has just been unlocked and is ready to outgrow her outfits.`,
			valueIfNotFirst: `She has just been unlocked and is ready to outgrow her outfits.`,
		})
	} else if (change.brokenUnlockSlug) {
		sentences.push(
			{
				value: `${characterDisplayName} has outgrown all her outfits.`,
				valueIfNotFirst: `She has outgrown all her outfits.`,
			},
			{
				value: `Her broken outfit is '${getCharacterOutfitDisplayName(change.slug, change.brokenUnlockSlug)}' (trait: ${traitName(change.brokenUnlockTrait)}).`
			},
		)
	} else if (change.newState.brokenOutfit.slug && change.brokenWeightGainInLbs >= insignificantChangeThresholdInLbs) {
		sentences.push({value: `${characterDisplayName} has gained ${formatWeight(change.brokenWeightGainInLbs)}lbs in her broken outfit.`})
	}

	sentences.push(...change.outfitChanges.flatMap(outfitChange => serializeOutfitChanges(characterDisplayName, change.slug, outfitChange)))

	return sentences;
}

function serializeOutfitChanges(characterDisplayName: string, characterSlug: string, change: OutfitChange): ChangeSentenceTemplate[] {
	const sentences : ChangeSentenceTemplate[] = [];
	const outfitName = getCharacterOutfitDisplayName(characterSlug, change.slug).toLowerCase();

	if (!change.newState.unlocked) {
		return [{
			value: `When unlocked, her ${outfitName} outfit will have to withstand ${formatWeight(change.newState.weightInLbs)}lbs of her.`,
		}]
	}

	if (change.unlocked && change.outgrown) {
		sentences.push({
			value: `${characterDisplayName}'s ${outfitName} outfit has been unlocked and already outgrown (weight: ${formatWeight(change.newState.weightInLbs)}lbs, trait: ${traitName(change.trait)}).`,
			valueIfNotFirst: `Her ${outfitName} outfit has been unlocked and already outgrown (weight: ${formatWeight(change.newState.weightInLbs)}lbs, trait: ${traitName(change.trait)}).`
		})
	} else if (change.unlocked) {
		sentences.push({
			value: `${characterDisplayName}'s ${outfitName} outfit has been unlocked (weight: ${formatWeight(change.newState.weightInLbs)}lbs, trait: ${traitName(change.trait)}).`,
			valueIfNotFirst: `Her ${outfitName} outfit has been unlocked (weight: ${formatWeight(change.newState.weightInLbs)}lbs, trait: ${traitName(change.trait)}).`,
		})
	} else if (change.outgrown) {
		sentences.push({
			value: `${characterDisplayName} has outgrown her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`,
			valueIfNotFirst: `She has outgrown her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`,
		})
	} else {
		sentences.push({
			value: `${characterDisplayName} is stretching her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`,
			valueIfNotFirst: `She is stretching her ${outfitName} outfit (+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`,
		})
	}

	return sentences
}
