<script lang="ts">

	import { createEventDispatcher } from 'svelte';
    import type { CharacterViewModel, ChartViewModel } from './view_model';
    import { formatWeight, toBMICategory, toImperialHeight } from './weight_utils';
	const dispatch = createEventDispatcher();

	export let characterName: string;

	export let viewModel: ChartViewModel;

	let charViewModel = viewModel.femaleCharacters.find(c => c.name === characterName) as CharacterViewModel & {pictureLink: string};

	function close() {
		dispatch('close', {})
	}

</script>

<rect x="8%" y="10%" width="84%" height="80%" rx="3px" ry="3px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" />

<image
	  xlink:href="{charViewModel.pictureLink}"
	  x="10%"
	  y="14.5%"
	  height="25%"
	  preserveAspectRatio="true"
	/>

<text class="big">
	<tspan x="23%" y="18%">{charViewModel.displayName || charViewModel.name} weighs {formatWeight(charViewModel.weight)}lbs.</tspan>
	<tspan x="23%" dy="5%">She's {toImperialHeight(charViewModel.heightInMeters)} tall.</tspan>
	<tspan x="23%" dy="5%">That gives her a BMI of {formatWeight(charViewModel.BMI)}, so she is {toBMICategory(charViewModel.BMI)}.</tspan>
</text>
<text x="84%" y="87%" class="close" on:click={() => close()}>close</text>

<style>
  .big {
    font-size: 4px;
    fill: black;
  }


  .close {
    fill: blue;
    font-size: 4px;
  }
</style>
