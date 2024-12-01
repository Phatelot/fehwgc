<script lang="ts">
    import Box from "./box.svelte";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		selectpage: {
			page: string,
		}
	}>();

	const pages = [
		['OUTFIT_CHART', 'Outfit Chart'],
		['UNLOCKOMETER', 'Unlock-o-meter'],
		['BMI_CHART', 'BMI Chart'],
		['CHARACTER_CHART', 'Character Chart'],
		['CHANGELOG', 'Changelog'],
		['GLOBAL_STATS', 'Global Stats'],
	]

	function selectPage(page: string) {
		dispatch('selectpage', {page})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>

{#each pages as page, i}
	<rect x="40%" y="{20 + 7 * i}%" height="4.6%" width="15%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => selectPage(page[0])}></rect>
	<text x="42%" y="{23.5 + 7 * i}%" class="button-label" on:click={() => selectPage(page[0])}>{page[1]}</text>
{/each}


<style>
	.button-label {
		fill: white;
		font-size: 3px;
	}
</style>
