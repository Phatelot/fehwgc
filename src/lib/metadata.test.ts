import { describe, expect, it } from 'vitest'
import { createSampleState } from './utils_test'
import { totalDonationsForCharacter } from './state'
import { getCharacterDisplayName, getCharacterOutfitDisplayName } from './metadata'

describe('getCharacterDisplayName', () => {
	it("should return the slug if character is not found", () => {
		expect(getCharacterDisplayName("marcille")).toBe("marcille")
	})

	it("should return the character display name if it's found", () => {
		expect(getCharacterDisplayName("edelgard")).toBe("Edelgard")
	})
})

describe('getCharacterOutfitDisplayName', () => {
	it("should return the slug if character is not found", () => {
		expect(getCharacterOutfitDisplayName("marcille", "winter")).toBe("winter")
	})

	it("should work with default/base outfit", () => {
		expect(getCharacterOutfitDisplayName("lumera")).toBe("Base")
	})

	it("should work with broken outfit", () => {
		expect(getCharacterOutfitDisplayName("lumera", "broken")).toBe("Broken")
	})

	it("should return the slug if outfit is not found", () => {
		expect(getCharacterOutfitDisplayName("lumera", "winter")).toBe("winter")
	})

	it("should return the outfit display name if it's found", () => {
		expect(getCharacterOutfitDisplayName("lumera", "fallen")).toBe("Fallen")
	})
})
