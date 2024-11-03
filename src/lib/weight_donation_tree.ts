import { isUnlocked, type CharacterState, type GameState, type OutfitState } from "./state";
import { average, median, sum } from "./stats_utils";

export type WeightDonationNode = {
	slug: string;
	weightInLbs?: number;
	donationReceived?: number;
	leafs: WeightDonationNode[];
}

export function createWeightDonationTree(state: GameState[]) : WeightDonationNode {
	return {
		slug: 'root', // unused anyway
		leafs: state.map(fromGameState),
	}
}

function fromGameState(state: GameState) : WeightDonationNode {
	return {
		slug: state.slug,
		leafs: state.characters.filter(isUnlocked).map(fromCharacterState),
	}
}

function fromCharacterState(state: CharacterState) : WeightDonationNode {
	return {
		slug: state.slug,
		donationReceived: state.donationReceived,
		leafs: state.outfits.filter(outfit => outfit.unlocked).map(fromOutfitState),
	}
}

function fromOutfitState(state: OutfitState) : WeightDonationNode {
	return {
		slug: state.slug,
		weightInLbs: state.weightInLbs,
		donationReceived: state.donationReceived,
		leafs: [],
	}
}

export type GroupStats = {
	slug: string;
	totalDonationReceived: number;
	sortedWeightsInLbs: number[];
	leafs: GroupStats[];
	totalWeightUnlockedInLbs: number;
	averageWeightUnlockedInLbs: number;
	medianWeightUnlockedInLbs: number;
}

export function toGroupStats(tree: WeightDonationNode) : GroupStats {
	const leafGroupStats = tree.leafs.map(toGroupStats);
	const weightsInLbs: number[] = leafGroupStats.flatMap(stats => stats.sortedWeightsInLbs);
	if (tree.weightInLbs) {
		weightsInLbs.push(tree.weightInLbs);
	}
	const sortedWeightsInLbs = weightsInLbs.sort();

	return {
		slug: tree.slug,
		totalDonationReceived: (tree.donationReceived || 0) + sum(leafGroupStats.map(stats => stats.totalDonationReceived)),
		sortedWeightsInLbs: sortedWeightsInLbs,
		leafs: leafGroupStats,
		totalWeightUnlockedInLbs: sum(sortedWeightsInLbs),
		averageWeightUnlockedInLbs: average(sortedWeightsInLbs),
		medianWeightUnlockedInLbs: median(sortedWeightsInLbs),
	}
}

export function getChildGroupStats(stats: GroupStats, slug: string) : GroupStats | null {
	for (const leaf of stats.leafs) {
		if (leaf.slug === slug) {
			return leaf;
		}
	}
	return null;
}
