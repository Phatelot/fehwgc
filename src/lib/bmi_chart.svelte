<script lang="ts">
	import appleLink from '/src/assets/shapes/apple.png'
	import circleLink from '/src/assets/shapes/circle.png'
	import hourglassLink from '/src/assets/shapes/hourglass.png'
	import pearLink from '/src/assets/shapes/pear.png'
	import triangleLink from '/src/assets/shapes/triangle.png'
	import arrowSvg from '/src/assets/arrow.svg'

    import type { CompletedState } from "./completed_state";
    import { createBMIOutfitViewModel, type BMIOutfitViewModel } from "./view_model";
    import type { Shape } from './metadata';

    import { createEventDispatcher } from 'svelte';
    import BmiLabel from './bmi_label.svelte';
    import Portrait from './portrait.svelte';

	export let state: CompletedState;
	export let maxDisplayFactor: number;

	let viewModel: BMIOutfitViewModel[][] = createBMIOutfitViewModel(state, maxDisplayFactor);
	$: page = 0;
	$: canGoFatter = page > 0;
	$: canGoThinner = page < viewModel.length - 1;

	$: pageViewModel = viewModel[page];

	function linkFromShape(shape: Shape) : string {
		return {
			'💎': triangleLink,
			'🍎': appleLink,
			'⌛': hourglassLink,
			'🟣': circleLink,
			'🍐': pearLink,
		}[shape]
	}

	const dispatch = createEventDispatcher<{
		selectoutfit: {
			characterSlug: string,
			outfitSlug: string,
		}
	}>();

	function selectOutfit(outfit: BMIOutfitViewModel) {
		dispatch('selectoutfit', {
			characterSlug: outfit.characterSlug,
			outfitSlug: outfit.broken ? 'broken': outfit.outfitSlug || '',
		})
	}

	function fatterPage() {
		if (canGoFatter) {
			page--;
			pageViewModel = viewModel[page]  // do NOT try to one-line this
		}
	}

	function thinnerPage() {
		if (canGoThinner) {
			page++;
			pageViewModel = viewModel[page] // do NOT try to one-line this
		}
	}

</script>

{#if pageViewModel && pageViewModel.length > 0}
  {#each pageViewModel as outfit}

	<rect
	  x="{outfit.x}%"
	  y="{outfit.y}%"
	  width="{outfit.width}%"
	  height="{outfit.height}%"
	  rx="0.5px"
	  ry="0.5px"
	  stroke="white"
	  stroke-width="0.4"
	  stroke-linecap="round"
	  fill="url(#{outfit.barGradient})"
	  on:click={() => selectOutfit(outfit)}
	/>

	<Portrait model={outfit} on:click={() => selectOutfit(outfit)}/>

	{#if outfit.mainShape}
		<image
			xlink:href="{linkFromShape(outfit.mainShape)}"
			x="{outfit.x + outfit.width * 0.05}%"
			y="{5.5 + outfit.y + outfit.height - outfit.pictureHeight * 0.4}%"
			height="{outfit.pictureHeight * 0.4}%"
		/>
	{/if}
	{#if outfit.secondaryShape}
		<image
			xlink:href="{linkFromShape(outfit.secondaryShape)}"
			x="{outfit.x + outfit.width * 0.55}%"
			y="{5.5 + outfit.y + outfit.height - outfit.pictureHeight * 0.4}%"
			height="{outfit.pictureHeight * 0.4}%"
		/>
	{/if}

	<BmiLabel outfit="{outfit}" />
  {/each}

  {#if canGoThinner}
	<image x="0.6%" y="86%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => thinnerPage()}/>
	<rect x="0%" y="80%" height="15%" width="3.8%" fill="#ae2f29" opacity='0' on:click={() => thinnerPage()}/>
  {/if}
  {#if canGoFatter}
	<image x="-99.4%" y="86%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => fatterPage()}/>
	<rect x="96.2%" y="80%" height="15%" width="3.8%" fill="#ae2f29" opacity='0' on:click={() => fatterPage()}/>
  {/if}
{/if}
