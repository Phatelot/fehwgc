import { describe, expect, it } from 'vitest'
import { createSampleState } from './utils_test'
import { initState, totalDonationsForCharacter, type GameState, getCharacterState } from './state'

describe('totalDonationsForCharacter', () => {
	it("should compute total donations with several outfits", () => {
		expect(totalDonationsForCharacter(createSampleState(), "edelgard")).toBe(190)
	})

	it("should compute total donations including broken outfit", () => {
		expect(totalDonationsForCharacter(createSampleState(), "kronya")).toBe(1450)
	})
})

describe('initState', () => {
	it('should correctly initialize state', () => {
		const initialState : GameState[] = initState();

		const tharja = getCharacterState(initialState, "tharja")
		expect(tharja.donationReceived).toBe(0)
		expect(tharja.brokenOutfit.weightInLbs).toBe(0)
		expect(tharja.outfits[0].donationReceived).toBe(0)
		expect(tharja.outfits[0].unlocked).toBe(true)
		expect(tharja.outfits[0].weightInLbs).toBe(120)
		expect(tharja.outfits[0].trait).toBe('Slob')
		expect(tharja.outfits[1].donationReceived).toBe(0)
		expect(tharja.outfits[1].unlocked).toBe(false)
		expect(tharja.outfits[1].weightInLbs).toBe(120)

		const linde = getCharacterState(initialState, "linde")
		expect(linde.outfits[0].weightInLbs).toBe(100)

		const elincia = getCharacterState(initialState, "elincia")
		expect(elincia.donationReceived).toBe(0)
		expect(elincia.brokenOutfit.weightInLbs).toBe(0)
		expect(elincia.outfits[0].donationReceived).toBe(0)
		expect(elincia.outfits[0].unlocked).toBe(false)
		expect(elincia.outfits[0].weightInLbs).toBe(120)
	})
})
