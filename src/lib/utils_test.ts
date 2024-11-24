import type { GameState } from "./state";

export function createSampleState() : GameState[] {
  return [
    {
      slug: "three_houses",
      characters: [
        {
          slug: "edelgard",
          groupSlug: 'students',
          outfits: [
            {
              slug: "base",
			  unlocked: true,
              donationReceived: 120,
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
				slug: "christmas",
				unlocked: true,
				donationReceived: 120,
				thresholdInLbs: 200,
				weightInLbs: 120,
				trait: 'Active',
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
						unlocked: false,
						weightInLbs: 200,
						donationReceived: 0,
						thresholdInLbs: 210,
					},
					{
						slug: "harvest",
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
		],
	},
  ];
}
