import { describe, expect, it } from 'vitest'
import { stringToRandomNumber } from './rng'

describe('stringToRandomNumber', () => {
	it("should be deterministic", () => {
		for (const value of ['edelgard', 'kronya', 'female_byleth']) {
			const expected = stringToRandomNumber(value, 1_000)
			let i = 0;
			while (i < 10_000) {
				expect(stringToRandomNumber(value, 1_000)).toEqual(expected)
				i++;
			}
		}
	})
})
