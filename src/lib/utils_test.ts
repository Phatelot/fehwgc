import type { GameState } from "./state";

export function createSampleState() : GameState[] {
  return [
    {
      slug: "three_houses",
      characters: [
        {
          slug: "edelgard",
          donationReceived: 150,
          outfits: [
            {
              slug: "base",
			  unlocked: true,
              donationReceived: 20,
              thresholdInLbs: 500,
              weightInLbs: 400,
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
			donationReceived: 150,
			outfits: [
			  {
				slug: "base",
				unlocked: true,
				donationReceived: 1000,
				thresholdInLbs: 500,
				weightInLbs: 1500,
			  }
			],
			brokenOutfit: {
				slug: "base",
				donationReceived: 300,
				weightInLbs: 2000
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
				donationReceived: 50,
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
