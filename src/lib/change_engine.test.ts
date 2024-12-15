import { describe, expect, it } from 'vitest'
import type { CharacterState, OutfitState } from './state'
import { createSampleState } from './utils_test'
import { serializeChanges, toCharacterChange, toOutfitChange, type CharacterChange, characterWeightGainedInLbs } from './change_engine'
import { applyDonations } from './donation_engine'

describe('serializeChanges', () => {
	it("should describe no donations", () => {
		expect(serializeChanges([createSampleState()])).toEqual([])
	})

	it("should give a summary of what changes with a list of donations", () => {
		const sentences = serializeChanges(applyDonations(createSampleState(), [
			{
				character: 'edelgard',
				outfit: 'base',
				amount: 400,
			},
			{
				character: 'edelgard',
				outfit: 'undeclared',
				amount: 120,
			},
		]))
		expect(sentences.length).not.toBe(0)
	})
})

describe('toCharacterChange', () => {
	it("should return null if no changes", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: false,
					weightInLbs: 200,
					thresholdInLbs: 320,
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = structuredClone(before)

		expect(toCharacterChange(before, after)).toBeNull()
	})

	it("should return null if insignificant changes", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: false,
					weightInLbs: 200,
					thresholdInLbs: 320,
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: false,
					weightInLbs: 200,
					thresholdInLbs: 320,
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240.4,
			}
		}

		expect(toCharacterChange(before, after)).toBeNull()
	})

	it("should detect if character is unlocked", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: false,
					weightInLbs: 200,
					thresholdInLbs: 320,
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 200,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}

		expect(toCharacterChange(before, after)?.unlocked).toBe(true)
	})

	it("should detect if character has reached broken outfit", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 320,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				},
				{
					slug: 'winter',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 200,
					thresholdInLbs: 320,
					trait: 'Fat_Hands',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 320,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				},
				{
					slug: 'winter',
					donationReceived: 130,
					unlocked: true,
					weightInLbs: 340,
					thresholdInLbs: 320,
					trait: 'Fat_Hands',
				}
			],
			brokenOutfit: {
				slug: 'winter',
				donationReceived: 20,
				weightInLbs: 700,
				trait: 'Sedentary'
			}
		}

		const change = toCharacterChange(before, after)
		expect(change?.brokenUnlockSlug).toBe("winter")
		expect(change?.brokenUnlockTrait).toBe("Sedentary")
		expect(change?.brokenWeightGainInLbs).toBe(460)
	})

	it("should detect if character has gained a significant amount of weight in broken", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 320,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 320,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				}
			],
			brokenOutfit: {
				slug: 'winter',
				donationReceived: 320,
				weightInLbs: 700,
				trait: 'Fat_Hands',
			}
		}

		const change = toCharacterChange(before, after)
		expect(change?.brokenWeightGainInLbs).toBe(460)
	})

	it("should sort outfit changes by decreasing significance", () => {
		const before : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 320,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				},
				{
					slug: 'winter',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 200,
					thresholdInLbs: 320,
					trait: 'Fat_Hands',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 240,
			}
		}
		const after : CharacterState = {
			slug: "edelgard",
			groupSlug: 'no_group',
			outfits: [
				{
					slug: 'base',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 340,
					thresholdInLbs: 320,
					trait: 'Sedentary',
				},
				{
					slug: 'winter',
					donationReceived: 130,
					unlocked: true,
					weightInLbs: 250,
					thresholdInLbs: 320,
					trait: 'Fat_Hands',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 400,
			}
		}

		const change = toCharacterChange(before, after)
		expect(change?.outfitChanges[0].slug).toBe("winter")
		expect(change?.outfitChanges[1].slug).toBe("base")
	})
})

describe('toOutfitChange', () => {
	it("should return null if no changes", () => {
		const before : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 230,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}
		const after : OutfitState = structuredClone(before)

		expect(toOutfitChange(before, after)).toBeNull()
	})

	it("should return null if insignificant changes", () => {
		const before : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 230,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}
		const after : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 230.5,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}

		expect(toOutfitChange(before, after)).toBeNull()
	})

	it("should detect a change of weight", () => {
		const before : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 230,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}
		const after : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 300,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}

		expect(toOutfitChange(before, after)).toEqual({
			slug: "base",
			donationReceived: 0,
			trait: undefined,
			unlocked: false,
			weightGainedInLbs: 70,
			outgrown: false,
			newState: after,
		})
	})

	it("should detect a newly outgrown outfit", () => {
		const before : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 230,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}
		const after : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 450,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}

		expect(toOutfitChange(before, after)).toEqual({
			donationReceived: 0,
			slug: "base",
			unlocked: false,
			weightGainedInLbs: 220,
			outgrown: true,
			newState: after,
			trait: undefined,
		})
	})

	it("should detect a newly unlocked outfit", () => {
		const before : OutfitState = {
			slug: "base",
			unlocked: false,
			donationReceived: 0,
			weightInLbs: 180,
			thresholdInLbs: 340,
		}
		const after : OutfitState = {
			slug: "base",
			unlocked: true,
			donationReceived: 150,
			weightInLbs: 300,
			thresholdInLbs: 340,
			trait: 'Sedentary',
		}

		expect(toOutfitChange(before, after)).toEqual({
			slug: "base",
			donationReceived: 150,
			unlocked: true,
			weightGainedInLbs: 120,
			trait: "Sedentary",
			outgrown: false,
			newState: after,
		})
	})
})

describe("characterWeightGainedInLbs", () => {
	it("should tally up all the weight gained across outfits, including broken", () => {
		const characterChange : CharacterChange = {
			slug: "petra",
			unlocked: false,
			outfitChanges: [
				{
					slug: "base",
					outgrown: false,
					donationReceived: 100,
					unlocked: false,
					weightGainedInLbs: 230,
					newState: {} as OutfitState, // we just don't need it here
				},
				{
					slug: "winter",
					outgrown: false,
					donationReceived: 50,
					unlocked: false,
					weightGainedInLbs: 30,
					newState: {} as OutfitState, // we just don't need it here
				},
			],
			brokenWeightGainInLbs: 300,
			brokenUnlockSlug: "base",
			brokenDonationReceived: 100,
			newState: {} as CharacterState, // we just don't need it here
		};

		expect(characterWeightGainedInLbs(characterChange)).toBe(560)
	})
})
