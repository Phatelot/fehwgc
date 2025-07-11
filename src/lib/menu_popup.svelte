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
		selectmaxdisplayfactor: {
			factor: number;
		}
	}>();

	export let state: CompletedState;
	export let selectedGameSlug: string;
	export let maxDisplayFactor: number;

	let selectableGameSlugs = [
		{
			name: 'All',
			nameSlug: 'all',
		},
		...state.games,
	]
	let selectedGameIndex = selectableGameSlugs.findIndex(g => g.nameSlug === selectedGameSlug);

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

<Box x={56} y={20} width={20} height={13} />

<text x="56%" y="25%" class="button-label">
	Only characters from:
</text>

<image x="55.6%" y="27%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousGame()}/>
<rect x="54%" y="24%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousGame()}/>

<text x="60%" y="30%" class="button-label">
	{selectableGameSlugs[selectedGameIndex].name}
</text>

<image x="-76.4%" y="27%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextGame()}/>
<rect x="72%" y="24%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextGame()}/>



<Box x={56} y={40} width={20} height={13} />

<text x="56%" y="45%" class="button-label">
	Maximum factor between smallest and biggest:
</text>

<image x="55.6%" y="47%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => previousFactor()}/>
<rect x="54%" y="44%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => previousFactor()}/>

<text x="60%" y="50%" class="button-label">
	{selectableMaxDisplayFactors[maxDisplayFactorIndex]}
</text>

<image x="-76.4%" y="47%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => nextFactor()}/>
<rect x="72%" y="44%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => nextFactor()}/>

<style>
	.button-label {
		fill: white;
		font-size: 3px;
	}
</style>
