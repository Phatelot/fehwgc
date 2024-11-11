<script lang="ts">
    import { getBodyPicLink } from "./asset_utils";
    import Box from "./box.svelte";
    import { getOutfitCompletedState, type CompletedState, type OutfitCompletedState } from "./completed_state";
    import { formatBMI, formatWeight, toBMICategory, toImperialHeight } from "./weight_utils";

	export let characterSlug: string;
	export let outfitSlug: string;
	export let state: CompletedState;

	let outfit = getOutfitCompletedState(state, characterSlug, outfitSlug) as OutfitCompletedState;

	let sentences = [
		`In this outfit, ${outfit.characterName} weighs ${formatWeight(outfit.weightInLbs)}lbs.`,
		`She is ${toImperialHeight(outfit.heightInMeters)} tall.`,
		`That gives her a BMI of ${formatBMI(outfit.BMI)}, so she is ${toBMICategory(outfit.BMI)}.`,
	];

</script>

<Box x={2} y={5} width={96} height={90}></Box>
<text x="36%" y="14%" class="character-name">{outfit.characterName} - {outfit.name}</text>
<image
	xlink:href="{getBodyPicLink(outfit.characterSlug, outfit.broken ? 'broken' : outfit.nameSlug || '')}"
	x="6%"
	y="10%"
	height="80%"
	preserveAspectRatio="true"
/>

<text class="sentence" y="18%">
	{#each sentences as sentence}
		<tspan x="34%" dy="4%">{sentence}</tspan>
	{/each}

</text>

<style>
	.character-name {
		fill: white;
		font-size: 7px;
	}

	.sentence {
		fill: white;
		font-size: 3px;
	}
</style>
