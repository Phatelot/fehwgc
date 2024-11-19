import { describe, expect, it } from 'vitest'
import { groupConsecutive } from './utils'

describe('groupConsecutive', () => {
	it('should work on arrays smaller than batch length', () => {
		expect(groupConsecutive([1, 2, 3], 5)).toEqual([[1, 2, 3]])
	})

	it('should work on arrays with more elements than batch length', () => {
		expect(groupConsecutive([1, 2, 3, 4, 5], 2)).toEqual([[4, 5], [2, 3], [1]])
	})
})
