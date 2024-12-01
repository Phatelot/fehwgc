<script lang="ts">
	import arrowSvg from '/src/assets/arrow.svg'
    import type { CompletedState } from "./completed_state";
    import Portrait from "./portrait.svelte";
    import { createUnlockViewModel, viewPortHeight, viewPortWidth, type UnlockViewModel } from "./view_model";
    import { createEventDispatcher } from 'svelte';

	export let state: CompletedState;

	const dispatch = createEventDispatcher<{
		selectoutfit: {
			characterSlug: string,
			outfitSlug: string,
		}
	}>();

	function selectOutfit(outfit: UnlockViewModel) {
		dispatch('selectoutfit', {
			characterSlug: outfit.characterSlug,
			outfitSlug: outfit.broken ? 'broken': outfit.outfitSlug || '',
		})
	}

	let viewModel: UnlockViewModel[][] = createUnlockViewModel(state);

	$: page = 0;
	$: canGoLower = page < viewModel.length - 1;
	$: canGoHigher = page > 0;

	$: pageViewModel = viewModel[page];

	function lowerPage() {
		if (canGoLower) {
			page++;
			pageViewModel = viewModel[page]  // do NOT try to one-line this
		}
	}

	function higherPage() {
		if (canGoHigher) {
			page--;
			pageViewModel = viewModel[page] // do NOT try to one-line this
		}
	}

</script>

{#each pageViewModel as portrait}
	<Portrait model={portrait} on:click={() => selectOutfit(portrait)}/>
{/each}

{#if canGoHigher}
	<image x="63.1%" y="23%" height="3%" xlink:href="{arrowSvg}" transform='scale(1.5, 1.5) rotate(90, {62.6 / 100 * viewPortWidth}, {25 / 100 * viewPortHeight})' on:click={() => higherPage()}/>
	<rect x="90.5%" y="32%" height="20%" width="8%" fill="#ae2f29" opacity='0' on:click={() => higherPage()}/>
{/if}

<text class="sentence" y="57%">
	<tspan x="92.5%">{page+1}/{viewModel.length}</tspan>
</text>

{#if canGoLower}
	<image x="63%" y="46%" height="3%" xlink:href="{arrowSvg}" transform='scale(1.5, 1.5) rotate(270, {63 / 100 * viewPortWidth}, {48 / 100 * viewPortHeight})' on:click={() => lowerPage()}/>
	<rect x="90.5%" y="60%" height="20%" width="8%" fill="#ae2f29" opacity='0' on:click={() => lowerPage()}/>
{/if}


<style>
	.sentence {
		fill: #03242d;
		font-size: 3px;
	}
</style>
