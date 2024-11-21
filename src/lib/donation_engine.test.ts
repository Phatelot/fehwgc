import { describe, expect, it } from 'vitest'
import { applyDonation, } from './donation_engine'
import { getCharacterState, type GameState } from './state'
import { createSampleState } from './utils_test'

describe('applyDonation', () => {
	it('should work on a copy of the input state', () => {
		const inputState = createSampleState();
		const outputState = applyDonation(inputState, {
			character: "edelgard",
			outfit: "undeclared",
			amount: 100,
		})
		expect(outputState).not.toEqual(inputState);
		expect(inputState).toEqual(createSampleState());
	})

	it("should throw an error if target character doesn't exist", () => {
		expect(() => applyDonation(createSampleState(), {
			character: 'marcille',
			outfit: "undeclared",
			amount: 100,
		})).toThrowError('unknown character marcille')
	})

	it("should throw an error if target outfit doesn't exist", () => {
		expect(() => applyDonation(createSampleState(), {
			character: 'edelgard',
			outfit: "winter",
			amount: 100,
		})).toThrowError('unknown outfit winter for character edelgard')
	})
})

describe('donation unlocking a character using undeclared donation', () => {
	const outputState = applyDonation(createSampleState(), {
		character: "chloe",
		outfit: "undeclared",
		amount: 200
	})

	it('should unlock that character', () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].unlocked).toBe(true)
	})

	it('should update the character donationReceived field', () => {
		expect(getCharacterState(outputState, "chloe")?.donationReceived).toBe(250)
	})

	it('should update the weight of the first outfit, counting spillover', () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(440)
	})

	it('should update the weights of other characters from the same game, with spillover', () => {
		const timeraState = getCharacterState(outputState, "timerra")
		expect(timeraState?.outfits[0].weightInLbs).toBe(210)
		expect(timeraState?.outfits[1].weightInLbs).toBe(230)
	})

	it('should update the weight of the broken outfit', () => {
		expect(getCharacterState(outputState, "chloe")?.brokenOutfit.weightInLbs).toBe(440)
	})
})

describe('big donation to a specified outfit', () => {
	const outputState = applyDonation(createSampleState(), {
		character: "edelgard",
		outfit: "base",
		amount: 2_000,
	})

	it("should unlock that character's nexts outfits", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].unlocked).toBe(true)
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.slug).toBeDefined()
	})

	it('should update the outfit donationReceived field', () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].donationReceived).toBe(2_020)
	})

	it('should update the weight of the targeted outfit', () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(2400)
	})

	it('should update the weights of other characters from the same game & group, with spillover', () => {
		const annetteState = getCharacterState(outputState, "annette")
		expect(annetteState?.outfits[0].weightInLbs).toBe(200)
		expect(annetteState?.brokenOutfit.weightInLbs).toBe(2720)
	})

	it('should not change the weights of other characters from the same game but different group', () => {
		const kronyaState = getCharacterState(outputState, "kronya")
		expect(kronyaState?.outfits[0].weightInLbs).toBe(1500)
		expect(kronyaState?.brokenOutfit.weightInLbs).toBe(2000)
	})

	it('should update the weight of the broken outfit', () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(2920)
	})
})


describe('donating to an unlocked broken outfit', () => {
	const outputState = applyDonation(createSampleState(), {
		character: "kronya",
		outfit: "undeclared",
		amount: 1_000,
	})

	it("should correctly update the broken outfit weight", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(4400)
	})
})
