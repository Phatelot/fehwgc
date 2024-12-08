import { describe, expect, it } from 'vitest'
import { createSampleState } from './utils_test'
import { initState, totalDonationsForCharacter, type GameState, getCharacterState, type CharacterState, getCurrentOutfitForCharacter, type OutfitState, type BrokenOutfitState } from './state'

describe('totalDonationsForCharacter', () => {
	it("should compute total donations with several outfits", () => {
		expect(totalDonationsForCharacter(createSampleState(), "edelgard")).toBe(140)
	})

	it("should compute total donations including broken outfit", () => {
		expect(totalDonationsForCharacter(createSampleState(), "kronya")).toBe(1300)
	})
})

describe('initState', () => {
	it('should correctly initialize state', () => {
		const initialState : GameState[] = initState();

		const tharja = getCharacterState(initialState, "tharja")
		expect(tharja.brokenOutfit.weightInLbs).toBe(0)
		expect(tharja.outfits[0].donationReceived).toBe(0)
		expect(tharja.outfits[0].unlocked).toBe(true)
		expect(tharja.outfits[0].weightInLbs).toBe(120)
		expect(tharja.outfits[0].trait).toBe('Sedentary')
		expect(tharja.outfits[1].donationReceived).toBe(0)
		expect(tharja.outfits[1].unlocked).toBe(false)
		expect(tharja.outfits[1].weightInLbs).toBe(120)

		const linde = getCharacterState(initialState, "linde")
		expect(linde.outfits[0].weightInLbs).toBe(100)

		const elincia = getCharacterState(initialState, "elincia")
		expect(elincia.brokenOutfit.weightInLbs).toBe(0)
		expect(elincia.outfits[0].donationReceived).toBe(0)
		expect(elincia.outfits[0].unlocked).toBe(false)
		expect(elincia.outfits[0].weightInLbs).toBe(120)
	})
})

describe('getCurrentOutfitForCharacter', () => {
	const state = createSampleState();

	it('should return the first outfit if character is not unlocked yet', () => {
		expect((getCurrentOutfitForCharacter(getCharacterState(state, "chloe") as CharacterState) as OutfitState).slug).toBe('spring');
	})

	it('should return the last unlocked regular outfit if broken is not unlocked yet', () => {
		expect((getCurrentOutfitForCharacter(getCharacterState(state, "edelgard") as CharacterState) as OutfitState).slug).toBe('base');
	})

	it('should return broken outfit if all regular ones have been outgrown', () => {
		expect((getCurrentOutfitForCharacter(getCharacterState(state, "kronya") as CharacterState) as BrokenOutfitState))
			.toBe((getCharacterState(state, "kronya") as CharacterState).brokenOutfit);
	})

	it('should not return not fattenable outfits', () => {
		// 2nd outfit of Edelgard is "Self-Feeder"
		const state = createSampleState();
		state[0].characters[0].outfits[0].weightInLbs = 500;
		state[0].characters[0].outfits[1].unlocked = true;
		state[0].characters[0].outfits[1].trait = "Self_Feeder";
		state[0].characters[0].brokenOutfit.slug = "base";
		state[0].characters[0].brokenOutfit.trait = "Fat_Face";

		expect((getCurrentOutfitForCharacter(getCharacterState(state, "edelgard") as CharacterState) as BrokenOutfitState))
			.toBe((getCharacterState(state, "edelgard") as CharacterState).brokenOutfit);
	})
})
