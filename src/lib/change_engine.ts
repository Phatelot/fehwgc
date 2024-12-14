import { getCharacterDisplayName, getCharacterOutfitDisplayName } from "./metadata";
import { stringToRandomNumber } from "./rng";
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
	if (!traitSlug) {
		return '';
	}
	return traitNames[traitSlug].toLowerCase();
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
		sentences.push(getGainingSentenceForBroken(characterDisplayName, `(+${formatWeight(change.brokenWeightGainInLbs)}lbs, new weight ${formatWeight(change.newState.brokenOutfit.weightInLbs)}lbs).`, change.newState.brokenOutfit.weightInLbs))
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

	const suffixIfAbsolute = `(weight: ${formatWeight(change.newState.weightInLbs)}lbs, trait: ${traitName(change.trait)}).`;
	const suffixIfRelative = `(+${formatWeight(change.weightGainedInLbs)}lbs, new weight ${formatWeight(change.newState.weightInLbs)}lbs).`;

	if (change.unlocked && change.outgrown) {
		sentences.push({
			value: `${characterDisplayName}'s ${outfitName} outfit has been unlocked and already outgrown ${suffixIfAbsolute}`,
			valueIfNotFirst: `Her ${outfitName} outfit has been unlocked and already outgrown ${suffixIfAbsolute}`
		})
	} else if (change.unlocked) {
		sentences.push({
			value: `${characterDisplayName}'s ${outfitName} outfit has been unlocked ${suffixIfAbsolute}`,
			valueIfNotFirst: `Her ${outfitName} outfit has been unlocked ${suffixIfAbsolute}`,
		})
	} else if (change.outgrown) {
		sentences.push({
			value: `${characterDisplayName} has outgrown her ${outfitName} outfit ${suffixIfRelative}`,
			valueIfNotFirst: `She has outgrown her ${outfitName} outfit ${suffixIfRelative}`,
		})
	} else if (change.weightGainedInLbs >= 1) {
		sentences.push(getStretchingSentence(characterDisplayName, outfitName, suffixIfRelative, change))
	}

	return sentences
}

function getStretchingSentence(characterDisplayName: string, outfitName: string, suffixIfRelative: string, change: OutfitChange): ChangeSentenceTemplate {
	const outfitState = change.newState;
	const isAlmostOutgrown = outfitState.unlocked && (outfitState.thresholdInLbs - outfitState.weightInLbs <= 30);

	const sentences = isAlmostOutgrown ? [
		{
			value: `${characterDisplayName}'s ${outfitName} outfit seems like it's close to bursting ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit seems like it's close to bursting ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit seems to be struggling to stay together ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit seems to be struggling to stay together ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit appears ready to split any second ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit appears ready to split any second ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit is holding on for dear life ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit is holding on for dear life ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit creaks under the pressure of her new figure ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit creaks under the pressure of her new figure ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit looks like it might tear with one wrong move ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit looks like it might tear with one wrong move ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit seems to be testing the limits of fabric engineering ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit seems to be testing the limits of fabric engineering ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s belt buckle is clinging to the last hole for dear life ${suffixIfRelative}`,
			valueIfNotFirst: `Her belt buckle is clinging to the last hole for dear life ${suffixIfRelative}`,
		},
	] : [
		{
			value: `${characterDisplayName} is stretching her ${outfitName} outfit ${suffixIfRelative}`,
			valueIfNotFirst: `She is stretching her ${outfitName} outfit ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit looks tighter than before ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit looks tighter than before ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s just popped a button from her ${outfitName} outfit ${suffixIfRelative}`,
			valueIfNotFirst: `She's just popped a button from her ${outfitName} outfit ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit now has a ripped seam ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit now has a ripped seam ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit has to accommodate her new size ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit has to accommodate her new size ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit feels noticeably snug after her recent indulgences ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit feels noticeably snug after her recent indulgences ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s waistband is starting to pinch in her ${outfitName} outfit ${suffixIfRelative}`,
			valueIfNotFirst: `Her waistband is starting to pinch in her ${outfitName} outfit ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit now leaves faint marks on her skin when she takes it off ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit leaves marks on her skin when she takes it off ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName} finds herself adjusting her ${outfitName} outfit more often these days ${suffixIfRelative}`,
			valueIfNotFirst: `She finds herself adjusting her ${outfitName} outfit more often these days ${suffixIfRelative}`,
		},
		{
			value: `${characterDisplayName}'s ${outfitName} outfit buttons now close with a slight protest ${suffixIfRelative}`,
			valueIfNotFirst: `Her ${outfitName} outfit buttons now close with a slight protest ${suffixIfRelative}`,
		},
	];

	return sentences[stringToRandomNumber(characterDisplayName + outfitName + change.donationReceived, sentences.length)]
}

function getGainingSentenceForBroken(characterDisplayName: string, suffix: string, weight: number): ChangeSentenceTemplate {
	const sentences = [
		{
			value: `${characterDisplayName}’s still expanding in her broken outfit ${suffix}`,
			valueIfNotFirst: `She’s still expanding in her broken outfit ${suffix}`,
		},
		{
			value: `${characterDisplayName}’s growth in her broken outfit hasn’t slowed ${suffix}`,
			valueIfNotFirst: `Her growth in her broken outfit hasn’t slowed ${suffix}`,
		},
		{
			value: `The scraps of ${characterDisplayName}'s broken outfit can’t hide her growing figure ${suffix}`,
			valueIfNotFirst: `The scraps of her broken outfit can’t hide her growing figure ${suffix}`,
		},
		{
			value: `Her broken outfit gave up, but ${characterDisplayName}’s size keeps increasing ${suffix}`,
			valueIfNotFirst: `Her broken outfit gave up, but her size keeps increasing ${suffix}`,
		},
		{
			value: `${characterDisplayName}’s still filling out her broken outfit ${suffix}`,
			valueIfNotFirst: `She's still filling out her broken outfit ${suffix}`,
		},
		{
			value: `No outfit could survive the way ${characterDisplayName} keeps growing in her broken one ${suffix}`,
			valueIfNotFirst: `No outfit could survive the way she keeps growing in her broken one ${suffix}`,
		},
	];

	return sentences[stringToRandomNumber(characterDisplayName + weight, sentences.length)]
}
