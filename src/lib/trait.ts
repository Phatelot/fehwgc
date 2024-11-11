import { getCharacterMetadata, getCharacterOutfitDisplayName, getOutfitMetadata, type CharacterBaseMetadata, type OutfitBaseMetadata, type Shape } from "./metadata";
import type { CharacterState, OutfitState } from "./state";

const baseTraits = [
	'Active',
	'Cellulite',
	'Extra_Plush',
	'Fat_Face',
	'Fat_Forearms',
	'Fat_Hands',
	'Rolly',
	'Sedentary',
	'Slob',
	'Stretch_Marks',
	'Strongfat',
	'Thick_FUpa',
	'Thin_Face',
	'Thin_Forearms',
]

const pearTraits = [
	'All_Ass',
	'All_Hips',
	'All_Thighs',
	'Huge_Calves',
]

const appleTraits = [
	'Beer_Gut',
	'Front_Butt',
	'Mega_Muffin',
	'Quad_Boobs',
	'Triple_Belly',
]

const hourglassOrTopHeavyTraits = [
	'Dangling_Melons',
	'Huge_Arms',
	'Perky_Melons',
]

const notRoundOrTopHeavyOrAppleTraits = [
	'Small_Belly',
]

const notHourglassOrTopHeavyTraits = [
	'No_Boobs',
	'Small_Boobs',
]

const notHourglassOrPearTraits = [
	'Thinnish_Legs',
]

const noSecondaryShapeTraits = [
	'Extreme',
]

const rareTraits = [
	'Blob_Bound',
	'Bound_Feeder',
	'Chaos_Feeder',
	'Generous',
	'Greedy_Guts',
	'Mutual_Gainer',
	'Self_Feeder',
].sort()

export const traitNames : {[key: string]: string} = {
	'Blob_Bound': 'Blob bound',
	'Bound_Feeder': 'Bound geeder',
	'Chaos_Feeder': 'Chaos feeder',
	'Generous': 'Generous',
	'Greedy_Guts': 'Greedy guts',
	'Mutual_Gainer': 'Mutual gainer',
	'Self_Feeder': 'Self feeder',
	'Extreme': 'Extreme',
	'Thinnish_Legs': 'Thinnish legs',
	'No_Boobs': 'No boobs',
	'Small_Boobs': 'Small boobs',
	'Small_Belly': 'Small belly',
	'Dangling_Melons': 'Dangling melons',
	'Huge_Arms': 'Huge arms',
	'Perky_Melons': 'Perky melons',
	'Beer_Gut': 'Beer gut',
	'Front_Butt': 'Front butt',
	'Mega_Muffin': 'Mega muffin',
	'Quad_Boobs': 'Quad boobs',
	'Triple_Belly': 'Triple belly',
	'All_Ass': 'All ass',
	'All_Hips': 'All hips',
	'All_Thighs': 'All thighs',
	'Huge_Calves': 'Huge calves',
	'Active': 'Active',
	'Cellulite': 'Cellulite',
	'Extra_Plush': 'Extra plush',
	'Fat_Face': 'Fat face',
	'Fat_Forearms': 'Fat forearms',
	'Fat_Hands': 'Fat hands',
	'Rolly': 'Rolly',
	'Sedentary': 'Sedentary',
	'Slob': 'Slob',
	'Stretch_Marks': 'Stretch marks',
	'Strongfat': 'Strongfat',
	'Thick_FUpa': 'Thick fupa',
	'Thin_Face': 'Thin face',
	'Thin_Forearms': 'Thin forearms',
}

export function selectTraitFor(character: CharacterState, outfit: OutfitState): string {
	const seed = `${character.slug}-${outfit.slug}`
	const characterMetadata = getCharacterMetadata(character.slug);
	const outfitMetadata = getOutfitMetadata(character.slug, outfit.slug) as OutfitBaseMetadata
	const possibleTraits = removeAlreadySelectedTraits(possibleCommonTraitsFor(outfitMetadata.mainShape, outfitMetadata.secondaryShape), character)

	const rareSelected = !(characterMetadata?.initialRoaster && outfitMetadata.outfitSlug === characterMetadata?.outfits[0].outfitSlug) && // no rare traits if first outfit of initial roaster
		(characterMetadata?.outfits || []).length > 1 && // no rare traits if only one outfit
		!containsARareTrait(character) && // at most one rare trait per character
		stringToRandomNumber(seed + '-rare', 10) === 0; // 10% chance

	if (rareSelected) {
		return rareTraits[stringToRandomNumber(seed, rareTraits.length)];
	}

	return possibleTraits.sort()[stringToRandomNumber(seed, possibleTraits.length)]
}

export function selectTraitForInitial(character: CharacterBaseMetadata): string {
	const outfit = character.outfits[0]
	const seed = `${character.nameSlug}-${outfit.outfitSlug}`
	const possibleTraits = possibleCommonTraitsFor(outfit.mainShape, outfit.secondaryShape);

	return possibleTraits.sort()[stringToRandomNumber(seed, possibleTraits.length)]
}

export function selectTraitForBroken(character: CharacterState): string {
	const baseOutfitMetadata = getOutfitMetadata(character.slug, character.brokenOutfit.slug as string) as OutfitBaseMetadata
	const possibleTraits = removeAlreadySelectedTraits(possibleCommonTraitsFor(baseOutfitMetadata.mainShape, baseOutfitMetadata.secondaryShape), character)

	const seed = `${character.slug}`
	return possibleTraits.sort()[stringToRandomNumber(seed, possibleTraits.length)]
}

function possibleCommonTraitsFor(shape: Shape, secondaryShape?: Shape): string[] {
	const results = [...baseTraits];
	if (shape === "🍐") {
		results.push(...pearTraits)
	} else if (shape === "🍎") {
		results.push(...appleTraits)
	} else if (shape === "⌛" || shape === "💎") {
		results.push(...hourglassOrTopHeavyTraits)
	}
	if (shape !== "🟣" && shape !== "💎" && shape !== "🍎") {
		results.push(...notRoundOrTopHeavyOrAppleTraits)
	}
	if (shape !== "⌛" && shape !== "🍐") {
		results.push(...notHourglassOrPearTraits)
	}
	if (shape !== "⌛" && shape !== "💎") {
		results.push(...notHourglassOrTopHeavyTraits)
	}
	if (!secondaryShape) {
		results.push(...noSecondaryShapeTraits)
	}
	return results;
}

function removeAlreadySelectedTraits(possibleTraits: string[], characterState: CharacterState): string[] {
	return possibleTraits.filter(trait => !alreadySelectedTraits(characterState).includes(trait));
}

function containsARareTrait(characterState: CharacterState): boolean {
	return !!alreadySelectedTraits(characterState).find(trait => rareTraits.includes(trait))
}

function alreadySelectedTraits(characterState: CharacterState): string[] {
	return characterState.outfits
		.map(outfitState => outfitState.trait)
		.filter(trait => !!trait) as string[];
}

export function stringToRandomNumber(str: string, excludedUpperBound: number): number {
    let hash = 0;

    // Simple hashing loop
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }

    return Math.abs(hash % excludedUpperBound);
}
