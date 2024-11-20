<script lang="ts">
    import { getBodyPicLink } from "./asset_utils";
    import Box from "./box.svelte";
    import { getCharacterCompletedState, type CharacterCompletedState, type CompletedState } from "./completed_state";
    import { formatWeight, toImperialHeight } from "./weight_utils";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let characterSlug: string;
	export let state: CompletedState;

	let character = getCharacterCompletedState(state, characterSlug) as CharacterCompletedState;

	let sentences = [
		`${character.name} weighs ${formatWeight(character.stats?.totalWeightUnlockedInLbs || 0)}lbs if you count all her outfits.`,
		`She is ${toImperialHeight(character.heightInMeters)} tall.`,
		`Her build is ${character.build}.`,
	];

	function close() {
		dispatch('close', {})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>
<text x="38%" y="14%" class="character-name">{character.name}</text>
<image
	xlink:href="{getBodyPicLink(character.nameSlug, 'base')}"
	x="6%"
	y="10%"
	height="80%"
/>

<text class="sentence" y="18%">
	{#each sentences as sentence}
		<tspan x="36%" dy="4%">{sentence}</tspan>
	{/each}

</text>

<rect x="83.1%" y="83.5%" height="4.6%" width="8%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => close()}></rect>
<text x="84%" y="87%" class="button-label" on:click={() => close()}>close</text>

<style>
	.character-name {
		fill: white;
		font-size: 7px;
	}

	.sentence {
		fill: white;
		font-size: 3px;
	}

	.button-label {
		fill: white;
		font-size: 3px;
	}
</style>
