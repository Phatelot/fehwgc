<script lang="ts">
	import frameMaskLink from '/src/assets/mask.png'

    import type { CompletedState } from "./completed_state";
    import {createCharacterViewModel, type CharacterViewModel } from "./view_model";
    import WeightLabel from "./weight_label.svelte";

	import { createEventDispatcher } from 'svelte';

	export let state: CompletedState;

	let viewModel: CharacterViewModel[] = createCharacterViewModel(state);

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

</script>

  {#each viewModel as character}
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
	<image
	  xlink:href="{character.bgPictureLink}"
	  x="{character.x}%"
	  y="{character.y + character.height + 6}%"
	  height="{character.pictureHeight}%"
	  preserveAspectRatio="true"
	/>
	<defs>
		<mask id="{'image-mask-' + character.id}" x="0%" y="0%" width="100%" height="100%" maskUnits="userSpaceOnUse">
		  <image xlink:href="{frameMaskLink}" width="{viewModel[0].width}%" height="{viewModel[0].pictureHeight}%" x="{character.x}%" y="{character.y + character.height + 6}%"/>
		</mask>
	</defs>

	<image
	  mask="url(#{'image-mask-' + character.id})"
	  xlink:href="{character.pictureLink}"
	  x="{character.x}%"
	  y="{character.y + character.height + 6}%"
	  height="{character.pictureHeight}%"
	  preserveAspectRatio="true"
	/>
	<image
	  xlink:href="{character.framePictureLink}"
	  x="{character.x}%"
	  y="{character.y + character.height + 6}%"
	  height="{character.pictureHeight}%"
	  preserveAspectRatio="true"
	  on:click={() => selectCharacter(character)}
    />

	<WeightLabel outfit="{character}" small/>
  {/each}
