<script lang="ts">
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

	let characters = [...viewModel.characters].sort((a, b) => (a.displayName || a.name).localeCompare((b.displayName || b.name)));
</script>

<text x="6%" y="15%">
  	{#each characters as charViewModel, i}
		<tspan x="{6 + Math.floor(i / 10) * 21}%" y="{17 + 8 * (i%10)}%" class="not-so-small" on:click={() => selectCharacter(charViewModel.name)} >{charViewModel.displayName || charViewModel.name}</tspan>
		<tspan x="{6 + Math.floor(i / 10) * 21}%" y="{20 + 8 * (i%10)}%" class="small" on:click={() => selectCharacter(charViewModel.name)} >{formatWeight(charViewModel.weight)}lbs, BMI: {formatBMI(charViewModel.BMI)}{charViewModel.numbers? ' (each)' : ''}</tspan>
	{/each}
</text>

<style>
  .not-so-small {
    font-size: 4px;
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

  .link-tree-link {
    fill: blue;
    text-decoration: underline;
  }
</style>
