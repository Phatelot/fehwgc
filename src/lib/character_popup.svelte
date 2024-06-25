<script lang="ts">

	import { createEventDispatcher } from 'svelte';
    import type { CharacterViewModel, ChartViewModel } from './view_model';
    import { generateSentencesFor } from './sentence_generator';
	const dispatch = createEventDispatcher();

	export let characterName: string;

	export let viewModel: ChartViewModel;

	let charViewModel = viewModel.characters.find(c => c.name === characterName) as CharacterViewModel & {pictureLink?: string};;

	function close() {
		dispatch('close', {})
	}

</script>

<rect x="8%" y="10%" width="84%" height="80%" rx="3px" ry="3px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" />

{#if charViewModel.pictureLink}
<image
	  xlink:href="{charViewModel.pictureLink}"
	  x="10%"
	  y="14.5%"
	  height="25%"
	  preserveAspectRatio="true"
	/>
{/if}


<text class="big" y="13%">
	{#each generateSentencesFor(charViewModel.name, viewModel) as sentence, i}
		<tspan x="{i < 6 && charViewModel.pictureLink ? 23 : 10}%" dy="4.6%">{sentence}</tspan>
	{/each}
</text>

<text x="50%" y="83.5%" text-anchor="middle">
	<a class="big link-tree-link" href="https://linktr.ee/ebcart">Click here to make a dono</a>
	<tspan x="50%" dy="4%" class="smallgrey">(Only comment the character name)</tspan>
</text>

<rect x="83.1%" y="83.5%" height="4.6%" width="8%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" on:click={() => close()}></rect>
<text x="84%" y="87%" class="close" on:click={() => close()}>close</text>

<style>
  .big {
    font-size: 4px;
    fill: black;
  }

  .smallgrey {
    font-size: 2.4px;
    fill: black;
	opacity: 50%;
  }

  .close {
    font-size: 4px;
  }

  .link-tree-link {
    fill: blue;
    text-decoration: underline;
  }
</style>
