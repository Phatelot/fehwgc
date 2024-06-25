<script lang="ts">
    import { getCharacterMetadata } from "./character_metadata";
	import type { DonationLogEntry } from "./model";
    import { type ChartViewModel } from "./view_model";
    import { formatBMI, formatWeight } from "./weight_utils";
	import { createEventDispatcher } from 'svelte';

	export let viewModel: ChartViewModel;

	const dispatch = createEventDispatcher<{
		selectcharacter: {characterName: string}
	}>();

	function selectCharacter(characterName: string) {
		dispatch('selectcharacter', {characterName})
	}

	function getYOffsetForIndex(i: number) : number {
		let offset = 18;
		let acc = 0;

		while (acc < i) {
			acc++;
			offset += 12 + Math.ceil(viewModel.donationLog[acc].gains.length / 3) * 3
		}

		return offset;
	}
</script>

<text x="6%" y="18%">
	{#each viewModel.donationLog as donationLogEntry, i}
		<tspan x="6%" y="{getYOffsetForIndex(i)}%" class="not-so-small"> ${donationLogEntry.amount} for {getCharacterMetadata(donationLogEntry.character).displayName || donationLogEntry.character}</tspan>
		{#each donationLogEntry.gains as gain, j}
			<tspan x="{6 + (j % 3) * 30}%" y="{getYOffsetForIndex(i) + 4 + Math.floor(j/3) * 3}%" class="not-so-small-but-still">
				{getCharacterMetadata(gain.characterName).displayName || gain.characterName}: <tspan class="grey">{formatWeight(gain.before)} {'<-'} </tspan>{formatWeight(gain.after)}<tspan class="grey">lbs</tspan>
			</tspan>
		{/each}
	{/each}
</text>

<text  text-anchor="middle" x="50%" y="95%" class="not-so-small grey">
	donations at the top are the most recent ones
</text>

<style>
  .not-so-small {
    font-size: 4px;
    fill: black;
  }

  .not-so-small-but-still {
    font-size: 2.5px;
    fill: black;
  }

  .small {
    font-size: 1.8px;
    fill: black;
  }

  .very-small {
    font-size: 1.4px;
    fill: black;
  }

  .grey {
	opacity: 50%;
  }
</style>
