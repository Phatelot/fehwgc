import { describe, expect, it } from 'vitest'
import { createSampleState } from './utils_test'
import { initState, totalDonationsForCharacter, type GameState, getCharacterState, type CharacterState, getCurrentOutfitForCharacter, type OutfitState, type BrokenOutfitState, addAdditionalCharactersAndOutfits } from './state'

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
		expect(tharja.brokenOutfit.weightInLbs).toBe(120)
		expect(tharja.outfits[0].donationReceived).toBe(0)
		expect(tharja.outfits[0].unlocked).toBe(true)
		expect(tharja.outfits[0].weightInLbs).toBe(120)
		expect(tharja.outfits[0].trait).toBe('Sedentary')
		expect(tharja.outfits[1].donationReceived).toBe(0)
		expect(tharja.outfits[1].unlocked).toBe(false)
		expect(tharja.outfits[1].weightInLbs).toBe(120)

		expect(tharja.outfits.length).toBe(7); // outfits added later shouldn't be in initial state

		const vaidaIsPresent: boolean = function() {
			for (const gameState of initialState) {
				for (const characterState of gameState.characters) {
					if (characterState.slug === 'vaida') {
						return true;
					}
				}
			}
			return false;
		}()
		expect(vaidaIsPresent).toBe(false); // characters added later shouldn't be in initial state

		const linde = getCharacterState(initialState, "linde")
		expect(linde.outfits[0].weightInLbs).toBe(100)

		const elincia = getCharacterState(initialState, "elincia")
		expect(elincia.brokenOutfit.weightInLbs).toBe(120)
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

describe('addAdditionalCharactersAndOutfits', () => {
	it('should not do anything if no characters or outfits are added at the moment', () => {
		const initialState : GameState[] = initState();

		const initialStateControl : GameState[] = initState();

		addAdditionalCharactersAndOutfits(initialState, 20);
		expect(initialState).toEqual(initialStateControl);
	})

	it('should add the new characters and outfits when adequate', () => {
		const initialState : GameState[] = initState();

		addAdditionalCharactersAndOutfits(initialState, 269);

		const vaida = getCharacterState(initialState, "vaida")
		expect(vaida).toBeDefined();
	})
})
