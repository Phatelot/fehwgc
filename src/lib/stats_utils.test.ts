import { describe, expect, it } from 'vitest'
import { median } from './stats_utils'

describe('median', () => {
	it("should return 0 if given no values", () => {
		expect(median([])).toBe(0)
	})

	it("should return the median value of a set with an odd number of elements", () => {
		expect(median([0, 23, 4])).toBe(4)
	})

	it("should return the median value of a set with an even number of elements", () => {
		expect(median([0, 23, 4, 6])).toBe(5)
	})
})
