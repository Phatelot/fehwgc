<script lang="ts">
	import Box from "./box.svelte";
    import type { CompletedState } from "./completed_state";
    import { formatMoney } from "./utils";
    import { formatWeight } from "./weight_utils";

	export let state: CompletedState;

	const totalNumberOfCharacters = state.games.flatMap(g => g.characters).length;
	const totalNumbefOfUnlockedCharacters = state.games.flatMap(g => g.characters).filter(c => c.unlocked).length;
	const totalNumberOfCharactersHavingUnlockedBroken = state.games.flatMap(g => g.characters).filter(c => c.outfits[c.outfits.length - 1].unlocked).length;

	const totalNumberOfOutfits = state.games.flatMap(g => g.characters).flatMap(c => c.outfits).length;
	const totalNumberOfUnlockedOutfits = state.games.flatMap(g => g.characters).flatMap(c => c.outfits).filter(o => o.unlocked).length;

	$: sentences = (() => {
		const sentences = [
			`Total weight of all unlocked characters: ${formatWeight(state.stats.totalWeightUnlockedInLbs)}lbs.`,
			`Average weight: ${formatWeight(state.stats.averageWeightUnlockedInLbs)}lbs.`,
			`Median weight: ${formatWeight(state.stats.medianWeightUnlockedInLbs)}lbs.`,
			`Total donations: $${formatMoney(state.stats.totalDonationReceived)}.`,
			"",
			`Out of ${totalNumberOfCharacters} characters, ${totalNumbefOfUnlockedCharacters} have been unlocked, and ${totalNumberOfCharactersHavingUnlockedBroken} have unlocked their broken oufit.`,
			`Out of ${totalNumberOfOutfits} outfits, ${totalNumberOfUnlockedOutfits} have been unlocked.`,
		];

		return sentences;
	})()

</script>

<Box x={2} y={5} width={96} height={90}></Box>

<text x="41%" y="14%" class="title">Global Stats</text>

<text class="sentence" y="30%">
	{#each sentences as sentence, i}
        <tspan x="16%" dy="5%">{sentence}</tspan>
	{/each}
</text>

<style>
	.title {
		fill: white;
		font-size: 7px;
	}

    .sentence {
		fill: white;
		font-size: 3px;
	}
</style>
