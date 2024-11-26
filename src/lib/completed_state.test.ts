import { describe, expect, it } from 'vitest'
import { createSampleState } from './utils_test'
import { applyDonations } from './donation_engine'
import { toCompletedState } from './completed_state'

describe('toCompletedState', () => {
	const states = applyDonations(createSampleState(), [
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
	]);
	const state = states[states.length-1]
	const completedState = toCompletedState(state);

	it("should complete a state using metadata and stats", () => {
		expect(completedState).toBeDefined();
	})
})