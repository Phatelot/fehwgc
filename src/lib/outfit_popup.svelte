<script lang="ts">
    import { getBodyPicLink } from "./asset_utils";
    import Box from "./box.svelte";
    import { getOutfitCompletedState, type CompletedState, type OutfitCompletedState } from "./completed_state";
    import { traitNames } from "./trait";
    import { formatBMI, formatWeight, toBMICategory, toImperialHeight } from "./weight_utils";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let characterSlug: string;
	export let outfitSlug: string;
	export let state: CompletedState;

	let outfit = getOutfitCompletedState(state, characterSlug, outfitSlug) as OutfitCompletedState;

	let sentences = [
		`In this outfit, ${outfit.characterName} weighs ${formatWeight(outfit.weightInLbs)}lbs.`,
		`She is ${toImperialHeight(outfit.heightInMeters)} tall.`,
		`That gives her a BMI of ${formatBMI(outfit.BMI)}, so she is ${toBMICategory(outfit.BMI)}.`,
		`Her trait is ${traitNames[outfit.trait] || ''}.`,
	];

	function close() {
		dispatch('close', {})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>
<text x="38%" y="14%" class="character-name">{outfit.characterName} - {outfit.name}</text>
<image
	xlink:href="{getBodyPicLink(outfit.characterSlug, outfit.nameSlug || '')}"
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
