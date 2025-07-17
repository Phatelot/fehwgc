import { isUnlocked, type CharacterState, type GameState, type OutfitState, isOutgrown } from "./state";
import { average, median, sum } from "./stats_utils";

export type WeightDonationNode = {
	slug: string;
	weightInLbs?: number;
	donationReceived?: number;
	isUnlocked: boolean;
	leafs: WeightDonationNode[];
}

function donationReceivedIfBlob(node: WeightDonationNode): number {
	if (node.weightInLbs && node.weightInLbs > BLOB_WEIGHT_THRESHOLD_LBS) {
		return node.donationReceived || 0;
	}
	return 0;
}

export function createWeightDonationTree(state: GameState[]) : WeightDonationNode {
	return {
		slug: 'root', // unused anyway
		leafs: state.map(fromGameState),
		isUnlocked: true,
	}
}

function fromGameState(state: GameState) : WeightDonationNode {
	return {
		slug: state.slug,
		leafs: state.characters.map(fromCharacterState),
		isUnlocked: true,
	}
}

function fromCharacterState(state: CharacterState) : WeightDonationNode {
	const leafs = state.outfits.filter(outfit => outfit.unlocked || outfit.donationReceived).map(fromOutfitState);
	leafs.push({
		slug: 'broken',
		donationReceived: state.brokenOutfit.donationReceived,
		weightInLbs: state.brokenOutfit.slug ? state.brokenOutfit.weightInLbs : 0,
		isUnlocked: !!state.brokenOutfit.slug,
		leafs: [],
	})

	return {
		slug: state.slug,
		leafs: leafs,
		isUnlocked: state.outfits[0].unlocked,
	}
}

function fromOutfitState(state: OutfitState) : WeightDonationNode {
	return {
		slug: state.slug,
		weightInLbs: state.weightInLbs,
		donationReceived: state.donationReceived,
		isUnlocked: state.unlocked,
		leafs: [],
	}
}

export const BLOB_WEIGHT_THRESHOLD_LBS = 3_000; // yeah that's a lot

export type GroupStats = {
	slug: string;
	totalDonationReceived: number;
	sortedWeightsInLbs: number[];
	leafs: GroupStats[];
	totalWeightUnlockedInLbs: number;
	averageWeightUnlockedInLbs: number;
	medianWeightUnlockedInLbs: number;
	totalDonationReceivedForBlobs: number;
	totalWeightUnlockedInLbsForBlobs: number;
	averageWeightUnlockedInLbsForBlobs: number;
	medianWeightUnlockedInLbsForBlobs: number;
	isUnlocked: boolean;
}

export function toGroupStats(tree: WeightDonationNode) : GroupStats {
	const leafGroupStats = tree.leafs.map(toGroupStats);
	const weightsInLbs: number[] = leafGroupStats
		.filter(lgs => lgs.isUnlocked)
		.flatMap(stats => stats.sortedWeightsInLbs);
	if (tree.weightInLbs) {
		weightsInLbs.push(tree.weightInLbs);
	}
	const sortedWeightsInLbs = weightsInLbs.filter(w => w !== 0).sort((a, b) => a - b);
	const sortedBlobWeightsInLbs = sortedWeightsInLbs.filter(w => w >= BLOB_WEIGHT_THRESHOLD_LBS);

	return {
		slug: tree.slug,
		totalDonationReceived: (tree.donationReceived || 0) + sum(leafGroupStats.map(stats => stats.totalDonationReceived)),
		totalDonationReceivedForBlobs: (donationReceivedIfBlob(tree)) + sum(leafGroupStats.map(stats => stats.totalDonationReceivedForBlobs)),
		sortedWeightsInLbs: sortedWeightsInLbs,
		leafs: leafGroupStats,
		totalWeightUnlockedInLbs: sum(sortedWeightsInLbs),
		averageWeightUnlockedInLbs: average(sortedWeightsInLbs),
		medianWeightUnlockedInLbs: median(sortedWeightsInLbs),
		totalWeightUnlockedInLbsForBlobs: sum(sortedBlobWeightsInLbs),
		averageWeightUnlockedInLbsForBlobs: average(sortedBlobWeightsInLbs),
		medianWeightUnlockedInLbsForBlobs: median(sortedBlobWeightsInLbs),
		isUnlocked: tree.isUnlocked,
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
