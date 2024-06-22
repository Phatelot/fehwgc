<script lang="ts">
    import { getMonsterFalinViewModel, type ChartViewModel } from "./view_model";
    import WeightLabel from "./weight_label.svelte";
    import { formatWeight } from "./weight_utils";
	import waterCanPng from '/src/assets/Water_Can_Big_PNG.png';
	import { createEventDispatcher } from 'svelte';

	export let viewModel: ChartViewModel;

	export let displayPromoText : boolean;

	const dispatch = createEventDispatcher<{
		selectcharacter: {characterName: string}
	}>();

	function selectCharacter(characterName: string) {
		dispatch('selectcharacter', {characterName})
	}
</script>

{#if displayPromoText}
<text x="15%" y="25%" class="small">
	<tspan text-anchor="middle">Every 1$* contributed to the collage adds</tspan>
	<tspan dy="3%" x="15%" text-anchor="middle">three pounds to the characters!</tspan>
	<tspan dy="2%" x="15%" text-anchor="middle" class="very-small">*Canadian Dollars, so  US Dollars go further</tspan>
	<tspan dy="4%" x="15%" text-anchor="middle" class="not-so-small">*</tspan>
	<tspan dy="1%" x="15%" text-anchor="middle">1lb goes to the character you choose by commenting</tspan>
	<tspan dy="3%" x="15%" text-anchor="middle">JUST their name with your contribution</tspan>
	<tspan dy="4%" x="15%" text-anchor="middle" class="not-so-small">*</tspan>
	<tspan dy="1%" x="15%" text-anchor="middle">1lb is split between them and their group</tspan>
	<tspan dy="4%" x="15%" text-anchor="middle" class="not-so-small">*</tspan>
	<tspan dy="1%" x="15%" text-anchor="middle">1lb goes to monster Falin</tspan>
	<tspan dy="3%" x="15%" text-anchor="middle"><a class="link-tree-link" href="https://linktr.ee/ebcart">Click here to fatten your favorite</a></tspan>
  </text>
  <image x="16%" y="9%" height="12%" xlink:href="{waterCanPng}" />
{/if}



  <image
	  xlink:href="{getMonsterFalinViewModel(viewModel).pictureLink}"
	  x="4%"
	  y="{5 / viewModel.viewPortHeight * viewModel.viewPortWidth}%"
	  height="{getMonsterFalinViewModel(viewModel).picHeight * 1.4}%"
	  preserveAspectRatio="true"
  />
  <text x="4.8%" y="{5 / viewModel.viewPortHeight * viewModel.viewPortWidth}%" transform="translate(10, 4)">
	<tspan class="small">{formatWeight(getMonsterFalinViewModel(viewModel).weight)}lbs</tspan>
  </text>

  {#each viewModel.femaleCharacters as charViewModel}
  	{#if !displayPromoText}
		<rect x="{charViewModel.x}%" y="{charViewModel.immobilityThresholdY}%" width="{charViewModel.width}%" height="0.8%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="black"/>
	{/if}

	<rect x="{charViewModel.x}%" y="{charViewModel.y}%" width="{charViewModel.width}%" height="{charViewModel.height}%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="url(#{charViewModel.barGradient})" on:click={() => selectCharacter(charViewModel.name)} />
	<image
	  xlink:href="{charViewModel.pictureLink}"
	  x="{charViewModel.x}%"
	  y="{charViewModel.y + charViewModel.height + 1}%"
	  height="{charViewModel.picHeight}%"
	  preserveAspectRatio="true"
	  on:click={() => selectCharacter(charViewModel.name)}
	/>
	<WeightLabel charViewModel="{charViewModel}" on:click={() => selectCharacter(charViewModel.name)} small/>
  {/each}

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
