import { describe, expect, it } from 'vitest'
import { applyDonation, getPossibleBoundTargets, requiredRemainingAmountToUnlock } from './donation_engine'
import { getCharacterState, type GameState, totalDonationsForCharacterState, initState } from './state'
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
		expect(totalDonationsForCharacterState(getCharacterState(outputState, "chloe"))).toBe(200)
	})

	it('should update the weight of the first outfit, counting spillover', () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(320)
	})

	it('should update the weights of other characters from the same game, with spillover', () => {
		const timeraState = getCharacterState(outputState, "timerra")
		expect(timeraState?.outfits[0].weightInLbs).toBe(210)
		expect(timeraState?.outfits[1].weightInLbs).toBe(230)
	})

	it('should update the weight of the broken outfit', () => {
		expect(getCharacterState(outputState, "chloe")?.brokenOutfit.weightInLbs).toBe(320)
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
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].donationReceived).toBe(2120)
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


describe('donation to an outfit still locked of an already unlocked character', () => {
	const outputState = applyDonation(initState(), {
		character: "lumera",
		outfit: "fallen",
		amount: 30
	})

	it('should update the outfit donationReceived field', () => {
		expect(getCharacterState(outputState, "lumera")?.outfits[2].donationReceived).toBe(30)
	})

	it('should update the weight of the targeted outfit', () => {
		expect(getCharacterState(outputState, "lumera")?.outfits[2].weightInLbs).toBe(150)
	})
})

describe('donating to an outfit with trait "Greedy Guts"', () => {
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Greedy_Guts";

	const outputState = applyDonation(inputState, {
		character: "annette",
		outfit: "christmas",
		amount: 200,
	});

	it("should make the target outfit grow twice as fast", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(520)
	})

	it("should make the broken outfit grow twice as fast", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2400)
	})

	it("should not provide any spillover", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(400)
	})
})

describe('donating to a character with an outfit "Greedy Guts"', () => {
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Greedy_Guts";

	const outputState = applyDonation(inputState, {
		character: "annette",
		outfit: "undeclared",
		amount: 200,
	});

	it("should make the greedy gut outfit grow twice as fast", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(200)
	})

	it("should fan out the donation received correctly", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].donationReceived).toBe(160)
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.donationReceived).toBe(460)
	})

	it("should not affect the rest of the gain", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2464)
	})

	it("should not provide any spillover for the part who goes to the greedy gut outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(432)
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(482)
	})
})

describe('donating to an outfit with trait "Blob bound"', () => {
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Blob_Bound";

	const outputState = applyDonation(inputState, {
		character: "annette",
		outfit: "christmas",
		amount: 200,
	});

	it("should make the target outfit grow 50% faster", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(420)
	})

	it("should make the broken outfit grow 50% faster", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2380)
	})

	it("should provide spillover", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(440)
	})
})

describe('donating to an outfit with trait "Generous"', () => {
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Generous";

	const outputState = applyDonation(inputState, {
		character: "annette",
		outfit: "christmas",
		amount: 200,
	});

	it("should make the target outfit grow only 50% as fast", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(220)
	})

	it("should make the broken outfit grow only 50% as fast", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2260)
	})

	it("should provide double the spillover", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(480)
	})
})

describe('donating to an outfit with trait "Mutual_Gainer"', () => {
	// Annette-christmas is mutual gainer with Timerra-base
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Mutual_Gainer";
	inputState[0].characters[2].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].trait = 'Fat_Face';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'annette',
		outfitSlug: 'christmas',
	};

	const outputState = applyDonation(inputState, {
		character: "annette",
		outfit: "christmas",
		amount: 200,
	});

	it("should make the target outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(320)
	})

	it("should make the broken outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2280)
	})

	it("should make the bound outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(400)
	})

	it("should make the bound broken outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(400)
	})

	it("should provide spillover to the group donated to", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(440)
	})

	it("should not provide spillover to the group of the bound outfit", () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(200)
	})
})

describe('donating to an outfit with trait "Bound_Feeder"', () => {
	// Timerra-base feeds Annette-christmas
	const inputState = createSampleState();
	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].trait = 'Bound_Feeder';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'annette',
		outfitSlug: 'christmas',
	};
	inputState[1].characters[1].outfits[1].unlocked = true;
	inputState[1].characters[1].outfits[1].trait = 'Sedentary';

	inputState[0].characters[2].outfits[0].trait = "Fat_Face";
	inputState[0].characters[2].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}

	const outputState = applyDonation(inputState, {
		character: "timerra",
		outfit: "base",
		amount: 200,
	});

	it("should not make the target outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(200)
	})

	it("should make the broken outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(440)
	})

	it("should make the bound outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(520)
	})

	it("should make the bound broken outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2400)
	})

	it("should provide spillover to the group donated to", () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(240)
	})

	it("should not provide spillover to the group of the bound outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(400)
	})
})

describe('donating to an outfit bound to another one with trait "Mutual_Gainer"', () => {
	// Annette-christmas is mutual gainer with Timerra-base
	const inputState = createSampleState();
	inputState[0].characters[2].outfits[0].trait = "Mutual_Gainer";
	inputState[0].characters[2].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].trait = 'Fat_Face';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'annette',
		outfitSlug: 'christmas',
	};

	const outputState = applyDonation(inputState, {
		character: "timerra",
		outfit: "base",
		amount: 200,
	});

	it("should make the target outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(400)
	})

	it("should make the broken outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(440)
	})

	it("should make the bound outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(320)
	})

	it("should make the bound broken outfit grow", () => {
		expect(getCharacterState(outputState, "annette")?.brokenOutfit.weightInLbs).toBe(2200)
	})

	it("should provide spillover to the group donated to", () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(240)
	})

	it("should not provide spillover to the group of the bound outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(400)
	})
})

describe('donating to an outfit with trait "Self_Feeder"', () => {
	// 2nd outfit of Edelgard is "Self-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Self_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received by the self-feeding outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the self-feeding outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should double the amount of weight gained by the character", () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(1330)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a character with an outfit with trait "Self_Feeder"', () => {
	// 2nd outfit of Edelgard is "Self-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Self_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "undeclared",
		amount: 200,
	});

	it("should update the donations received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(20)
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.donationReceived).toBe(200)
	})

	it("should not make the self-feeding outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should double the amount of weight gained by the character", () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(1330)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to an outfit of a character with another outfit with trait "Self_Feeder"', () => {
	// 2nd outfit of Edelgard is "Self-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Self_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "base",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].donationReceived).toBe(320)
	})

	it("should not make the self-feeding outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should double the amount of weight gained by the outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(900)
	})

	it("should double the amount of weight gained by the broken outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(930)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to an outfit that is mutual gainer with a character with another outfit with trait "Self_Feeder"', () => {
	// 2nd outfit of Edelgard is "Self-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Self_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// Timerra-base is mutual gainer with Edelgard first outfit
	inputState[0].characters[0].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].trait = 'Mutual_Gainer';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'edelgard',
		outfitSlug: 'base',
	};

	const outputState = applyDonation(inputState, {
		character: "timerra",
		outfit: "base",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(320)
	})

	it("should make the target outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(400)
	})

	it("should provide spillover for target character", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[1].weightInLbs).toBe(240)
	})

	it("should make the target broken outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(440)
	})

	it("should not make the self-feeding outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should double the amount of weight gained by the self-fed outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(900)
	})

	it("should double the amount of weight gained by the self-fed broken outfit", () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(850)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "chloe")?.outfits[0].weightInLbs).toBe(240)
	})
})

describe('donating to a self-fed outfit that is also mutual gainer with another character', () => {
	// 2nd outfit of Edelgard is "Self-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Self_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// Timerra-base is mutual gainer with Edelgard first outfit
	inputState[0].characters[0].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].trait = 'Mutual_Gainer';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'edelgard',
		outfitSlug: 'base',
	};

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "base",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].donationReceived).toBe(320)
	})

	it("should make the target outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[0].weightInLbs).toBe(900)
	})

	it("should make the target broken outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.brokenOutfit.weightInLbs).toBe(930)
	})

	it("should not make the self-feeding outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should make grow the mutual gainer outfit with the base donation amount", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(400)
	})

	it("should make grow the mutual gainer broken outfit with the base donation amount", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(400)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a chaos-feeder outfit that will target a regular outfit', () => {
	// 2nd outfit of Edelgard is "Chaos-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Chaos_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the chaos feeder outfit outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should make the target outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].weightInLbs).toBe(2100)
	})

	it("should make the target broken outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(2600)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a chaos-feeder outfit that will target a self-feeding outfit', () => {
	// 2nd outfit of Edelgard is "Chaos-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Chaos_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// Kronya is a self-feeder
	inputState[0].characters[1].outfits[0].trait = "Self_Feeder";
	inputState[0].characters[1].outfits.push({
		slug: "harvest",
		unlocked: true,
		donationReceived: 1000,
		thresholdInLbs: 1000,
		weightInLbs: 2400,
		trait: 'Sedentary',
	})

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the chaos feeder outfit outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should make the target outfit grow with 6 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[1].weightInLbs).toBe(3600)
	})

	it("should make the target broken outfit grow with 6 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(3200)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a chaos-feeder outfit that will target a bound feeder outfit', () => {
	// 2nd outfit of Edelgard is "Chaos-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Chaos_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// lots of RNG manipulation here. Yay.

	// Kronya is a bound feedee of Timerra-base
	inputState[0].characters[1].outfits[0].trait = "Sedentary";
	inputState[0].characters[1].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[0].characters[1].outfits.push({
		slug: "harvest",
		unlocked: true,
		donationReceived: 1000,
		thresholdInLbs: 1000,
		weightInLbs: 2400,
		trait: 'Sedentary',
	})

	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].weightInLbs = 300;
	inputState[1].characters[1].outfits[0].trait = 'Bound_Feeder';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'kronya',
		outfitSlug: 'base',
	};
	inputState[1].characters[1].outfits[1].unlocked = true;
	inputState[1].characters[1].outfits[1].donationReceived = 20;
	inputState[1].characters[1].outfits[1].weightInLbs = 150;
	inputState[1].characters[1].outfits[1].trait = 'Sedentary';

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the chaos feeder outfit outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should not make the primary target outfit grow", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(300)
	})

	it("should make the primary target broken outfit grow by 3 times the base amount", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(800)
	})

	it("should not change the primary target's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should not change the primary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should make the secondary target outfit grow with 6 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].weightInLbs).toBe(2700)
	})

	it("should make the secondary target broken outfit grow with 6 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(3200)
	})

	it("should not change the secondary target's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].donationReceived).toBe(1000)
	})

	it("should not change the secondary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.donationReceived).toBe(300)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a chaos-feeder outfit that will target a secondary mutual gainer outfit', () => {
	// 2nd outfit of Edelgard is "Chaos-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Chaos_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// lots of RNG manipulation here. Yay.

	// Kronya is a mutual gainer with of Timerra-base
	inputState[0].characters[1].outfits[0].trait = "Mutual_Gainer";
	inputState[0].characters[1].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[0].characters[1].outfits.push({
		slug: "harvest",
		unlocked: true,
		donationReceived: 1000,
		thresholdInLbs: 1000,
		weightInLbs: 2400,
		trait: 'Sedentary',
	})

	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].weightInLbs = 300;
	inputState[1].characters[1].outfits[0].trait = 'Fat_Face';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'kronya',
		outfitSlug: 'base',
	};
	inputState[1].characters[1].outfits[1].unlocked = true;
	inputState[1].characters[1].outfits[1].donationReceived = 20;
	inputState[1].characters[1].outfits[1].weightInLbs = 150;
	inputState[1].characters[1].outfits[1].trait = 'Sedentary';

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the chaos feeder outfit outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should make the primary target outfit grow by 3 times the base amount", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(900)
	})

	it("should make the primary target broken outfit grow by 3 times the base amount", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(800)
	})

	it("should not change the primary target's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should not change the primary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should make the secondary target outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].weightInLbs).toBe(2100)
	})

	it("should make the secondary target broken outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(2600)
	})

	it("should not change the secondary target's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].donationReceived).toBe(1000)
	})

	it("should not change the secondary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.donationReceived).toBe(300)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('donating to a chaos-feeder outfit that will target a primary mutual gainer outfit', () => {
	// 2nd outfit of Edelgard is "Chaos-Feeder"
	const inputState = createSampleState();
	inputState[0].characters[0].outfits[0].weightInLbs = 500;
	inputState[0].characters[0].outfits[1].unlocked = true;
	inputState[0].characters[0].outfits[1].trait = "Chaos_Feeder";
	inputState[0].characters[0].brokenOutfit.slug = "base";
	inputState[0].characters[0].brokenOutfit.trait = "Fat_Face";

	// lots of RNG manipulation here. Yay.

	// Kronya is a mutual gainer with of Timerra-base
	inputState[0].characters[1].outfits[0].trait = "Fat_Face";
	inputState[0].characters[1].outfits[0].boundTo = {
		characterSlug: 'timerra',
		outfitSlug: 'base',
	}
	inputState[0].characters[1].outfits.push({
		slug: "harvest",
		unlocked: true,
		donationReceived: 1000,
		thresholdInLbs: 1000,
		weightInLbs: 2400,
		trait: 'Sedentary',
	})

	inputState[1].characters[1].outfits[0].unlocked = true;
	inputState[1].characters[1].outfits[0].donationReceived = 120;
	inputState[1].characters[1].outfits[0].weightInLbs = 300;
	inputState[1].characters[1].outfits[0].trait = 'Mutual_Gainer';
	inputState[1].characters[1].outfits[0].boundTo = {
		characterSlug: 'kronya',
		outfitSlug: 'base',
	};
	inputState[1].characters[1].outfits[1].unlocked = true;
	inputState[1].characters[1].outfits[1].donationReceived = 20;
	inputState[1].characters[1].outfits[1].weightInLbs = 150;
	inputState[1].characters[1].outfits[1].trait = 'Sedentary';

	const outputState = applyDonation(inputState, {
		character: "edelgard",
		outfit: "summer",
		amount: 200,
	});

	it("should update the donation received", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].donationReceived).toBe(220)
	})

	it("should not make the chaos feeder outfit outfit grow", () => {
		expect(getCharacterState(outputState, "edelgard")?.outfits[1].weightInLbs).toBe(170)
	})

	it("should make the primary target outfit grow by 3 times the base amount", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].weightInLbs).toBe(900)
	})

	it("should make the primary target broken outfit grow by 3 times the base amount", () => {
		expect(getCharacterState(outputState, "timerra")?.brokenOutfit.weightInLbs).toBe(800)
	})

	it("should not change the primary target's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should not change the primary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "timerra")?.outfits[0].donationReceived).toBe(120)
	})

	it("should make the secondary target outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].weightInLbs).toBe(2100)
	})

	it("should make the secondary target broken outfit grow with 3 times the amount", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.weightInLbs).toBe(2600)
	})

	it("should not change the secondary target's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.outfits[0].donationReceived).toBe(1000)
	})

	it("should not change the secondary target's broken outfit's received donations", () => {
		expect(getCharacterState(outputState, "kronya")?.brokenOutfit.donationReceived).toBe(300)
	})

	it("should provide regular spillover", () => {
		expect(getCharacterState(outputState, "annette")?.outfits[0].weightInLbs).toBe(160)
	})
})

describe('requiredRemainingAmountToUnlock', () => {
	it('should return 0 if character is already unlocked', () => {
		expect(requiredRemainingAmountToUnlock({
			slug: 'edelgard',
			groupSlug: 'students',
			outfits: [
				{
					slug: 'base',
					donationReceived: 100,
					unlocked: true,
					weightInLbs: 230,
					thresholdInLbs: 400,
					trait: 'Fat_Face',
				},
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 120,
			},
		})).toBe(0);
	})

	it('should return a positive number if character is not unlocked yet', () => {
		expect(requiredRemainingAmountToUnlock({
			slug: 'edelgard',
			groupSlug: 'students',
			outfits: [
				{
					slug: 'base',
					donationReceived: 20,
					unlocked: false,
					weightInLbs: 230,
					thresholdInLbs: 400,
				},
				{
					slug: 'harvest',
					donationReceived: 30,
					unlocked: true,
					weightInLbs: 230,
					thresholdInLbs: 400,
					trait: 'Fat_Face',
				}
			],
			brokenOutfit: {
				donationReceived: 20,
				weightInLbs: 120,
			},
		})).toBe(50);
	})
})


describe('getPossibleBoundTargets', () => {
	it("should return unlocked outfits, that aren't themselves bound to another character or chaos/self feeder", () => {
		expect(getPossibleBoundTargets(createSampleStateForPossibleBoundTargets(), true)).toEqual([
			{
				characterSlug: 'kronya',
				outfitSlug: 'base',
			},
			{
				characterSlug: 'timerra',
				outfitSlug: 'harvest',
			},
		])
	})

	it("should include bound outfits if asked to", () => {
		expect(getPossibleBoundTargets(createSampleStateForPossibleBoundTargets(), false)).toEqual([
			{
				characterSlug: 'edelgard',
				outfitSlug: 'base',
			},
			{
				characterSlug: 'kronya',
				outfitSlug: 'base',
			},
			{
				characterSlug: 'timerra',
				outfitSlug: 'harvest',
			},
		])
	})
})

function createSampleStateForPossibleBoundTargets(): GameState[] {
  return [
    {
      slug: "three_houses",
      characters: [
        {
          slug: "edelgard",
          groupSlug: 'students',
          outfits: [
            {
              // that outfit is bound to another one
              slug: "base",
              unlocked: true,
              donationReceived: 20,
              thresholdInLbs: 500,
              weightInLbs: 400,
              trait: 'Active',
              boundTo: {
                characterSlug: 'kronya',
                outfitSlug: 'base',
              }
            },
            {
              // that outfit hasn't been unlocked yet
              slug: "summer",
              unlocked: false,
              donationReceived: 20,
              thresholdInLbs: 500,
              weightInLbs: 170,
            },
          ],
          brokenOutfit: {
            donationReceived: 0,
            weightInLbs: 450,
          }
        },
        {
          slug: "kronya",
          groupSlug: 'professionals',
          outfits: [
            {
              slug: "base",
              unlocked: true,
              donationReceived: 1000,
              thresholdInLbs: 500,
              weightInLbs: 1500,
              trait: 'Sedentary',
            }
          ],
          brokenOutfit: {
            slug: "base",
            donationReceived: 300,
            weightInLbs: 2000,
            trait: 'Fat_face',
          }
        },
        {
          slug: "annette",
          groupSlug: 'students',
          outfits: [
            {
              // That outfit is a chaos feeder
              slug: "christmas",
              unlocked: true,
              donationReceived: 120,
              thresholdInLbs: 200,
              weightInLbs: 120,
              trait: 'Chaos_Feeder',
            }
          ],
          brokenOutfit: {
            donationReceived: 300,
            weightInLbs: 2000,
          }
        },
      ],
    },
	{
		slug: 'engage',
		characters: [
			{
				slug: "chloe",
				groupSlug: 'no_group',
				outfits: [
					{
						slug: "spring",
						unlocked: false,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 600,
					}
				],
				brokenOutfit: {
					donationReceived: 0,
					weightInLbs: 200,
				}
			},
			{
				slug: "timerra",
				groupSlug: 'no_group',
				outfits: [
					{
						slug: "base",
						unlocked: true,
						weightInLbs: 200,
						donationReceived: 120,
						thresholdInLbs: 210,
						trait: 'Self_Feeder',
					},
					{
						slug: "harvest",
						unlocked: true,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 600,
						trait: 'Fat_Face',
					}
				],
				brokenOutfit: {
					donationReceived: 0,
					weightInLbs: 200,
				}
			},
		],
	},
  ];
}
