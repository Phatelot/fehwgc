import { describe, expect, it } from 'vitest'
import { baseMetadata, getCharacterDisplayName, getCharacterOutfitDisplayName } from './metadata'

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

describe('characters', () => {
	const charactersByGroupByGame = baseMetadata.map(gameMetadata => {
		const charactersByGroup: {[key: string]: string[]} = {};
		gameMetadata.characters.forEach(character => {
			const characterGroupSlug = character.group?.slug || 'no_group';
			charactersByGroup[characterGroupSlug] ||= [];
			charactersByGroup[characterGroupSlug].push(character.nameSlug);
		});
		return charactersByGroup
	});

	it("should not lack a group if others characters in the same game have one", () => {
		for (const game of charactersByGroupByGame) {
			const groupsOfGame = Object.keys(game);
			if (groupsOfGame.includes('no_group')) {
				expect(groupsOfGame.length).toBe(1)
			}
		}
	});

	it("should not be alone in a group", () => {
		for (const game of charactersByGroupByGame) {
			for (const group in game) {
				expect(game[group].length).toBeGreaterThan(1)
			}
		}
	});

	it("should not share the same slug", () => {
		const characterNameSlugs = baseMetadata
			.flatMap(g => g.characters)
			.map(c => c.nameSlug);

		const dedupedCharacterNameSlugs = new Set(characterNameSlugs);

		expect(characterNameSlugs.length).toBe(dedupedCharacterNameSlugs.size)
	})
})
