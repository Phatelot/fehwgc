<script lang="ts">
    import { getMonsterFalinViewModel, type ChartViewModel } from "./view_model";
    import { formatBMI } from "./weight_utils";
	import { createEventDispatcher } from 'svelte';

	export let viewModel: ChartViewModel;

	const dispatch = createEventDispatcher<{
		selectcharacter: {characterName: string}
	}>();

	function selectCharacter(characterName: string) {
		dispatch('selectcharacter', {characterName})
	}
</script>
  <image
	  xlink:href="{getMonsterFalinViewModel(viewModel).pictureLink}"
	  x="4%"
	  y="{5 / viewModel.viewPortHeight * viewModel.viewPortWidth}%"
	  height="{getMonsterFalinViewModel(viewModel).picHeight * 1.4}%"
	  preserveAspectRatio="true"
	  on:click={() => selectCharacter('Monster_Falin')}
  />
  <text x="4.8%" y="{5 / viewModel.viewPortHeight * viewModel.viewPortWidth}%" transform="translate(10, 4)" on:click={() => selectCharacter('Monster_Falin')}>
	<tspan class="small">BMI: {formatBMI(getMonsterFalinViewModel(viewModel).BMI)}</tspan>
  </text>

  {#each viewModel.femaleCharactersBMI as charViewModel}

	<rect x="{charViewModel.x}%" y="{charViewModel.y}%" width="{charViewModel.width}%" height="{charViewModel.height}%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="url(#{charViewModel.barGradient})" on:click={() => selectCharacter(charViewModel.name)} />
	<image
	  xlink:href="{charViewModel.pictureLink}"
	  x="{charViewModel.x}%"
	  y="{charViewModel.y + charViewModel.height + 1}%"
	  height="{charViewModel.picHeight}%"
	  preserveAspectRatio="true"
	  on:click={() => selectCharacter(charViewModel.name)}
	/>
	<text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" transform="translate(0, 10)" on:click={() => selectCharacter(charViewModel.name)}>
		<tspan class="small">{formatBMI(charViewModel.BMI)}</tspan>
	</text>
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
