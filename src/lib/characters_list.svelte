<script lang="ts">
	import arrowSvg from '/src/assets/arrow.svg'
    import Box from './box.svelte';
    import type { CompletedState } from './completed_state';
    import { createCharacterListItemViewModel, viewPortHeight, viewPortWidth, type CharacterListItemViewModel } from './view_model';
	import { createEventDispatcher } from 'svelte';

	export let state: CompletedState;

	let viewModel: CharacterListItemViewModel[][] = createCharacterListItemViewModel(state);
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

	const dispatch = createEventDispatcher<{
		selectcharacter: {
			characterSlug: string,
		}
	}>();

	function selectCharacter(character: CharacterListItemViewModel) {
		dispatch('selectcharacter', {
			characterSlug: character.characterSlug,
		})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>

<text x="41%" y="14%" class="title">Character List</text>

{#each pageViewModel as characterListItem}
	<text class="{characterListItem.unlocked ? 'character-name' : 'character-name--locked'}" y="{characterListItem.y + 6}%" on:click={() => selectCharacter(characterListItem)}>
		<tspan x="{characterListItem.x + 3}%">{characterListItem.characterName}</tspan>
	</text>
	<rect x="{characterListItem.x}%" y="{characterListItem.y}%" height="{characterListItem.height}%" width="{characterListItem.width}%" fill="#ae2f29" opacity='0' on:click={() => selectCharacter(characterListItem)}/>
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
	.title {
		fill: white;
		font-size: 7px;
	}

	.sentence {
		fill: #03242d;
		font-size: 3px;
	}

	.character-name {
		fill: white;
		font-size: 3px;
	}

	.character-name--locked {
		fill: #1e91b1;
		font-size: 3px;
	}
</style>
