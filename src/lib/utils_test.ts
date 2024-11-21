import type { GameState } from "./state";

export function createSampleState() : GameState[] {
  return [
    {
      slug: "three_houses",
      characters: [
        {
          slug: "edelgard",
          donationReceived: 150,
          groupSlug: 'students',
          outfits: [
            {
              slug: "base",
			  unlocked: true,
              donationReceived: 20,
              thresholdInLbs: 500,
              weightInLbs: 400,
              trait: 'Active',
            },
			{
              slug: "summer",
			  unlocked: false,
              donationReceived: 20,
              thresholdInLbs: 500,
              weightInLbs: 170,
              trait: undefined,
			},
          ],
		  brokenOutfit: {
			donationReceived: 0,
			weightInLbs: 450,
			slug: undefined,
			trait: undefined,
		  }
        },
		{
			slug: "kronya",
			donationReceived: 150,
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
			donationReceived: 0,
			groupSlug: 'students',
			outfits: [
			  {
				slug: "christmas",
				unlocked: true,
				donationReceived: 120,
				thresholdInLbs: 200,
				weightInLbs: 120,
				trait: 'Active',
			  }
			],
			brokenOutfit: {
				slug: undefined,
				donationReceived: 300,
				weightInLbs: 2000,
				trait: undefined,
			}
		  },
      ],
    },
	{
		slug: 'engage',
		characters: [
			{
				slug: "chloe",
				donationReceived: 50,
				groupSlug: 'no_group',
				outfits: [
					{
						slug: "spring",
						unlocked: false,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 600,
						trait: undefined,
					}
				],
				brokenOutfit: {
					donationReceived: 0,
					weightInLbs: 200,
					slug: undefined,
					trait: undefined,
				}
			},
			{
				slug: "timerra",
				donationReceived: 50,
				groupSlug: 'no_group',
				outfits: [
					{
						slug: "base",
						unlocked: false,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 210,
						trait: undefined,
					},
					{
						slug: "harvest",
						unlocked: false,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 600,
						trait: undefined
					}
				],
				brokenOutfit: {
					donationReceived: 0,
					weightInLbs: 200,
					slug: undefined,
					trait: undefined,
				}
			},
		],
	},
  ];
}
