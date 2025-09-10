<script lang="ts">
	import arrowSvg from '/src/assets/arrow_light.svg'
	import Box from "./box.svelte";
	import { createEventDispatcher } from "svelte";
	import type { CompletedState } from "./completed_state";
	const dispatch = createEventDispatcher<{
		selectpage: {
			page: string;
		};
		selectgame: {
			gameSlug: string;
		};
		selectshape: {
			shape: string;
		};
		selecttrait: {
			trait: string;
		};
		selectmaxdisplayfactor: {
			factor: number;
		};
	}>();

	export let state: CompletedState;
	export let selectedGameSlug: string;
	export let selectedShape: string;
	export let selectedTrait: string;
	export let maxDisplayFactor: number;

	let selectableGameSlugs = [
		{
			name: 'All',
			nameSlug: 'all',
		},
		...state.games,
	]
	let selectedGameIndex = selectableGameSlugs.findIndex(g => g.nameSlug === selectedGameSlug);

	const shapes = state.games
		.flatMap(g => g.characters)
		.flatMap(c => c.outfits)
		.map(o => (o.mainShape || '') + (o.secondaryShape || ''))
		.filter(s => !!s)
		.filter((item, index, array) => array.indexOf(item) === index)
		.sort();

	let selectableShapes = [
		'All',
		...shapes,
	]
	let selectedShapeIndex = selectableShapes.indexOf(selectedShape);

	const traits = state.games
		.flatMap(g => g.characters)
		.flatMap(c => c.outfits)
		.map(o => o.trait)
		.filter(s => !!s)
		.filter((item, index, array) => array.indexOf(item) === index)
		.sort();

	let selectableTraits = [
		'All',
		...traits,
	];
	let selectedTraitIndex = selectableTraits.indexOf(selectedTrait);

	let selectableMaxDisplayFactors = [
		5, 10, 20, 50, 100, 200, 300, 500,
	]

	let maxDisplayFactorIndex = selectableMaxDisplayFactors.findIndex(f => f == maxDisplayFactor);

	const pages = [
		["OUTFIT_CHART", "Outfit Chart"],
		["UNLOCKOMETER", "Unlock-o-meter"],
		["BMI_CHART", "BMI Chart"],
		["CHARACTER_CHART", "Character Chart"],
		["CHARACTER_LIST", "Character List"],
		["CHANGELOG", "Changelog"],
		["GLOBAL_STATS", "Global Stats"],
		["RULES", "Rules"],
		["TRAITS", "Traits Index"],
	];

	function selectPage(page: string) {
		dispatch("selectpage", { page });
	}

	function selectGame() {
		dispatch("selectgame", { gameSlug: selectableGameSlugs[selectedGameIndex].nameSlug })
	}

	function previousGame() {
		selectedGameIndex += selectableGameSlugs.length - 1;
		selectedGameIndex %= selectableGameSlugs.length;
		selectGame();
	}

	function nextGame() {
		selectedGameIndex++;
		selectedGameIndex %= selectableGameSlugs.length;
		selectGame();
	}

	function selectShape() {
		dispatch("selectshape", { shape: selectableShapes[selectedShapeIndex] })
	}

	function previousShape() {
		selectedShapeIndex += selectableShapes.length - 1;
		selectedShapeIndex %= selectableShapes.length;
		selectShape();
	}

	function nextShape() {
		selectedShapeIndex++;
		selectedShapeIndex %= selectableShapes.length;
		selectShape();
	}

	function selectTrait() {
		dispatch("selecttrait", { trait: selectableTraits[selectedTraitIndex] })
	}

	function previousTrait() {
		selectedTraitIndex += selectableTraits.length - 1;
		selectedTraitIndex %= selectableTraits.length;
		selectTrait();
	}

	function nextTrait() {
		selectedTraitIndex++;
		selectedTraitIndex %= selectableTraits.length;
		selectTrait();
	}

	function selectMaxDisplayFactor() {
		dispatch("selectmaxdisplayfactor", {factor: selectableMaxDisplayFactors[maxDisplayFactorIndex]})
	}

	function previousFactor() {
		maxDisplayFactorIndex += selectableMaxDisplayFactors.length - 1;
		maxDisplayFactorIndex %= selectableMaxDisplayFactors.length;
		selectMaxDisplayFactor();
	}

	function nextFactor() {
		maxDisplayFactorIndex++;
		maxDisplayFactorIndex %= selectableMaxDisplayFactors.length;
		selectMaxDisplayFactor();
	}
</script>

<Box x={2} y={5} width={96} height={90}></Box>

{#each pages as page, i}
	<rect
		x="30%"
		y="{20 + 7 * i}%"
		height="4.6%"
		width="15%"
		rx="1px"
		ry="1px"
		stroke="#aeffff"
		stroke-width="0.4"
		stroke-linecap="round"
		fill="#004858"
		on:click={() => selectPage(page[0])}
	></rect>
	<text
		x="32%"
		y="{23.5 + 7 * i}%"
		class="button-label"
		on:click={() => selectPage(page[0])}>{page[1]}</text
	>
{/each}

<Box x={56} y={15} width={20} height={13} />

<text x="56%" y="20%" class="button-label">
	Only characters from:
</text>

<image x="55.6%" y="22%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousGame()}/>
<rect x="54%" y="19%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousGame()}/>

<text x="60%" y="25%" class="button-label">
	{selectableGameSlugs[selectedGameIndex].name}
</text>

<image x="-76.4%" y="22%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextGame()}/>
<rect x="72%" y="19%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextGame()}/>


<Box x={56} y={31} width={20} height={13} />

<text x="56%" y="36%" class="button-label">
	Only characters with shape:
</text>

<image x="55.6%" y="38%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousShape()}/>
<rect x="54%" y="35%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousShape()}/>

<text x="60%" y="41%" class="button-label">
	{selectableShapes[selectedShapeIndex]}
</text>

<image x="-76.4%" y="38%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextShape()}/>
<rect x="72%" y="35%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextShape()}/>


<Box x={56} y={47} width={20} height={13} />

<text x="56%" y="52%" class="button-label">
	Only characters with trait:
</text>

<image x="55.6%" y="54%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousTrait()}/>
<rect x="54%" y="51%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousTrait()}/>

<text x="60%" y="57%" class="button-label">
	{selectableTraits[selectedTraitIndex]}
</text>

<image x="-76.4%" y="54%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextTrait()}/>
<rect x="72%" y="41%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextTrait()}/>


<Box x={56} y={77} width={20} height={13} />

<text x="56%" y="82%" class="button-label">
	Max. factor between smallest and biggest:
</text>

<image x="55.6%" y="84%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousFactor()}/>
<rect x="54%" y="81%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousFactor()}/>

<text x="60%" y="87%" class="button-label">
	{selectableMaxDisplayFactors[maxDisplayFactorIndex]}
</text>

<image x="-76.4%" y="84%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextFactor()}/>
<rect x="72%" y="71%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextFactor()}/>

<style>
	.button-label {
		fill: white;
		font-size: 3px;
	}
</style>
