<script lang="ts">
	import arrowSvg from '/src/assets/arrow.svg'

    import type { CompletedState } from "./completed_state";
    import {createCharacterViewModel, type CharacterViewModel } from "./view_model";
    import WeightLabel from "./weight_label.svelte";

	import { createEventDispatcher } from 'svelte';
    import Portrait from './portrait.svelte';

	export let state: CompletedState;

	let viewModel: CharacterViewModel[][] = createCharacterViewModel(state);
	$: page = 0;
	$: canGoFatter = page > 0;
	$: canGoThinner = page < viewModel.length - 1;

	$: pageViewModel = viewModel[page];

	const dispatch = createEventDispatcher<{
		selectcharacter: {
			characterSlug: string,
		}
	}>();

	function selectCharacter(character: CharacterViewModel) {
		dispatch('selectcharacter', {
			characterSlug: character.characterSlug,
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
  {#each pageViewModel as character}
	<rect
	  x="{character.x}%"
	  y="{character.y}%"
	  width="{character.width}%"
	  height="{character.height}%"
	  rx="0.5px"
	  ry="0.5px"
	  stroke="white"
	  stroke-width="0.4"
	  stroke-linecap="round"
	  fill="url(#{character.barGradient})"
	  on:click={() => selectCharacter(character)}
	/>
	<Portrait model={character} on:click={() => selectCharacter(character)}/>

	<WeightLabel outfit="{character}" small/>
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