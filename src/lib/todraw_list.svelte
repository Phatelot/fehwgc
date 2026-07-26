<script lang="ts">
	import arrowSvg from "/src/assets/arrow.svg";
	import Box from "./box.svelte";
	import type { CompletedState } from "./completed_state";
	import { createEventDispatcher } from "svelte";
	import { isToDrawOutfitPerfectlyUpToDate, percentThresholdForToDraw, saveToDrawOutfits, type ToDrawOutfits } from "./todraw_status";
	import {
		type ToDrawListOutfitViewModel,
		createToDrawListViewModel,
		viewPortHeight,
		viewPortWidth,
	} from "./view_model";
	import Portrait from "./portrait.svelte";

	export let state: CompletedState;
	export let savedToDrawOutfits: ToDrawOutfits;

	const dispatch = createEventDispatcher<{
		selectoutfit: {
			characterSlug: string;
			outfitSlug: string;
		};
	}>();

	function selectOutfit(outfit: ToDrawListOutfitViewModel) {
		dispatch("selectoutfit", {
			characterSlug: outfit.characterSlug,
			outfitSlug: outfit.broken ? "broken" : outfit.outfitSlug || "",
		});
	}

	function switchStatus(outfit: ToDrawListOutfitViewModel) {
		const key = outfit.characterSlug + "_" + (outfit.broken ? "broken" : outfit.outfitSlug)


		const previous = savedToDrawOutfits[key]
		if (!previous) {
			savedToDrawOutfits[key] = {
				initWeightInLb: outfit.weightInLbs,
				lastDrawnWeightInLb: outfit.weightInLbs,
			}
		} else {
			if (Math.abs(outfit.weightInLbs - (previous.lastDrawnWeightInLb || 0)) < 0.1) {
				delete savedToDrawOutfits[key];
				savedToDrawOutfits = savedToDrawOutfits
			} else {
				previous.lastDrawnWeightInLb = outfit.weightInLbs
				savedToDrawOutfits = savedToDrawOutfits
			}
		}
		saveToDrawOutfits(savedToDrawOutfits)
	}

	$: viewModel = createToDrawListViewModel(
		state,
		savedToDrawOutfits,
	);

	$: flattenedOutfits = viewModel.outfits.flatMap(p => p)

	$: page = 0;
	$: canGoLower = page < viewModel.outfits.length - 1;
	$: canGoHigher = page > 0;

	$: pageViewModel = viewModel.outfits[page];

	function lowerPage() {
		if (canGoLower) {
			page++;
			pageViewModel = viewModel.outfits[page]; // do NOT try to one-line this
		}
	}

	function lowestPage() {
		page = viewModel.outfits.length - 1
		pageViewModel = viewModel.outfits[page]; // do NOT try to one-line this
	}

	function higherPage() {
		if (canGoHigher) {
			page--;
			pageViewModel = viewModel.outfits[page]; // do NOT try to one-line this
		}
	}

	function highestPage() {
		page = 0
		pageViewModel = viewModel.outfits[page]; // do NOT try to one-line this
	}
</script>

<Box x={2} y={5} width={96} height={90}></Box>

<text x="41%" y="14%" class="title">To-draw List</text>

<text class="sentence" y="{6 + 14}%">
	<tspan x="{6}%">100% up to date: {flattenedOutfits.filter(o => o.status === "OK" && isToDrawOutfitPerfectlyUpToDate(o)).length}/{flattenedOutfits.length}</tspan>
	<tspan x="{30}%">&lt;{percentThresholdForToDraw}% gain: {flattenedOutfits.filter(o => o.status === "OK").length}/{flattenedOutfits.length}</tspan>
	<tspan x="{54}%">need redraw: {flattenedOutfits.filter(o => o.status === "NOK").length}/{flattenedOutfits.length}</tspan>
	<tspan x="{78}%">unknown: {flattenedOutfits.filter(o => o.status === "UNKNOWN").length}/{flattenedOutfits.length}</tspan>
</text>

{#each pageViewModel as portrait, index}
	<Portrait
		model={{ ...portrait, almostUnlocked: false }}
		on:click={() => selectOutfit(portrait)}
	/>

	<text class="sentence" y="{portrait.y + 14}%">
		<tspan x="{portrait.x + 6}%">{portrait.characterAndOutfitLabel + " " + portrait.statusIcon}</tspan>
		<tspan x="{portrait.x + 6}%" dy="5%">{portrait.weightLabel}</tspan>
	</text>
	<rect x="{portrait.x + portrait.width + 0.3}%" y="{portrait.y + 10}%" height="13%" width="22%" fill="#ae2f29" opacity='0' on:click={() => switchStatus(portrait)}/>
{/each}

{#if canGoHigher}
	<image
		x="63.1%"
		y="23%"
		height="3%"
		xlink:href={arrowSvg}
		transform="scale(1.5, 1.5) rotate(90, {(62.6 / 100) *
			viewPortWidth}, {(25 / 100) * viewPortHeight})"
		on:click={() => higherPage()}
	/>
	<rect
		x="90.5%"
		y="32%"
		height="20%"
		width="8%"
		fill="#ae2f29"
		opacity="0"
		on:click={() => higherPage()}
	/>
{/if}

<text class="sentence" y="57%">
	<tspan x="92.5%">{page + 1}/{viewModel.outfits.length}</tspan>
</text>

{#if canGoLower}
	<image
		x="63%"
		y="46%"
		height="3%"
		xlink:href={arrowSvg}
		transform="scale(1.5, 1.5) rotate(270, {(63 / 100) *
			viewPortWidth}, {(48 / 100) * viewPortHeight})"
		on:click={() => lowerPage()}
	/>
	<rect
		x="90.5%"
		y="60%"
		height="20%"
		width="8%"
		fill="#ae2f29"
		opacity="0"
		on:click={() => lowerPage()}
	/>
{/if}

<text
	x="8%"
	y="87.5%"
	class="notes"
>Click on portrait to open details</text>
<text
	x="8%"
	y="92%"
	class="notes"
>Click on text to switch status</text>

<rect
	x="78.5%"
	y="85.5%"
	height="4.6%"
	width="15%"
	rx="1px"
	ry="1px"
	stroke="#aeffff"
	stroke-width="0.4"
	stroke-linecap="round"
	fill="#004858"
	on:click={() => lowestPage()}
></rect>
<text
	x="81.7%"
	y="89%"
	class="button-label"
	on:click={() => lowestPage()}>Last page</text
>
<rect
	x="61.5%"
	y="85.5%"
	height="4.6%"
	width="15%"
	rx="1px"
	ry="1px"
	stroke="#aeffff"
	stroke-width="0.4"
	stroke-linecap="round"
	fill="#004858"
	on:click={() => highestPage()}
></rect>
<text
	x="64.7%"
	y="89%"
	class="button-label"
	on:click={() => highestPage()}>First page</text
>

<style>
	.title {
		fill: white;
		font-size: 7px;
	}

	.sentence {
		fill: white;
		font-size: 3px;
	}

	.notes {
		fill: white;
		font-size: 2.5px;
	}

	.button-label {
		fill: white;
		font-size: 3px;
	}
</style>
