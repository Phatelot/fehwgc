<script lang="ts">
	import frameMaskLink from '/src/assets/mask.png'
	import appleLink from '/src/assets/shapes/apple.png'
	import circleLink from '/src/assets/shapes/circle.png'
	import hourglassLink from '/src/assets/shapes/hourglass.png'
	import pearLink from '/src/assets/shapes/pear.png'
	import triangleLink from '/src/assets/shapes/triangle.png'

    import type { CompletedState } from "./completed_state";
    import { createOutfitViewModel as createOutfitViewModel, type OutfitViewModel } from "./view_model";
    import WeightLabel from "./weight_label.svelte";
    import type { Shape } from './metadata';

	import { createEventDispatcher } from 'svelte';

	export let state: CompletedState;

	let viewModel: OutfitViewModel[] = createOutfitViewModel(state);

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

	function selectOutfit(outfit: OutfitViewModel) {
		dispatch('selectoutfit', {
			characterSlug: outfit.characterSlug,
			outfitSlug: outfit.broken ? 'broken': outfit.outfitSlug || '',
		})
	}

</script>

  {#each viewModel as outfit}
	{#if outfit.outgrownY}
		<rect x="{outfit.x}%" y="{outfit.outgrownY}%" width="{outfit.width}%" height="0.8%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="black"/>
	{/if}

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
	<image
	  xlink:href="{outfit.bgPictureLink}"
	  x="{outfit.x}%"
	  y="{outfit.y + outfit.height + 6}%"
	  height="{outfit.pictureHeight}%"
	  preserveAspectRatio="true"
	/>
	<defs>
		<mask id="{'image-mask-' + outfit.id}" x="0%" y="0%" width="100%" height="100%" maskUnits="userSpaceOnUse">
		  <image xlink:href="{frameMaskLink}" width="{viewModel[0].width}%" height="{viewModel[0].pictureHeight}%" x="{outfit.x}%" y="{outfit.y + outfit.height + 6}%"/>
		</mask>
	</defs>

	<image
	  mask="url(#{'image-mask-' + outfit.id})"
	  xlink:href="{outfit.pictureLink}"
	  x="{outfit.x}%"
	  y="{outfit.y + outfit.height + 6}%"
	  height="{outfit.pictureHeight}%"
	  preserveAspectRatio="true"
	/>
	<image
	  xlink:href="{outfit.framePictureLink}"
	  x="{outfit.x}%"
	  y="{outfit.y + outfit.height + 6}%"
	  height="{outfit.pictureHeight}%"
	  preserveAspectRatio="true"
	  on:click={() => selectOutfit(outfit)}
    />
	{#if outfit.mainShape}
		<image
			xlink:href="{linkFromShape(outfit.mainShape)}"
			x="{outfit.x + outfit.width * 0.05}%"
			y="{5.5 + outfit.y + outfit.height - outfit.pictureHeight * 0.4}%"
			height="{outfit.pictureHeight * 0.4}%"
			preserveAspectRatio="true"
		/>
	{/if}
	{#if outfit.secondaryShape}
		<image
			xlink:href="{linkFromShape(outfit.secondaryShape)}"
			x="{outfit.x + outfit.width * 0.55}%"
			y="{5.5 + outfit.y + outfit.height - outfit.pictureHeight * 0.4}%"
			height="{outfit.pictureHeight * 0.4}%"
			preserveAspectRatio="true"
		/>
	{/if}

	<WeightLabel outfit="{outfit}" small/>
  {/each}
