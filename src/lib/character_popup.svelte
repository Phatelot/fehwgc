<script lang="ts">

	import { getBodyPicLink } from "./asset_utils";
    import Box from "./box.svelte";
    import { getCharacterCompletedState, getHeaviestOutfitSlug, type CharacterCompletedState, type CompletedState } from "./completed_state";
    import { donationURL } from "./donation_engine";
    import Portrait from "./portrait.svelte";
    import { formatMoney } from "./utils";
    import { createOutfitOfCharacterViewModel, type OutfitOfCharacterViewModel } from "./view_model";
    import { formatWeight, toImperialHeight } from "./weight_utils";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		close: {},
		selectoutfit: {
			characterSlug: string,
			outfitSlug: string,
		}
	}>();

	export let characterSlug: string;
	export let state: CompletedState;

	let character = getCharacterCompletedState(state, characterSlug) as CharacterCompletedState;
	let outfitsOfCharacter = createOutfitOfCharacterViewModel(character);

	let showOutfits = true;

	const sentences = [
		`${character.name} is from the game ${character.gameName} (${character.groupName ? 'group: ' + character.groupName : 'not in any group'}).`,
	];

	if (character.unlocked) {
		sentences.push(`She weighs ${formatWeight(character.stats?.totalWeightUnlockedInLbs || 0)}lbs if you count all her outfits.`);
	}

	sentences.push(
		`She is ${toImperialHeight(character.heightInMeters)} tall.`,
		`Her build is ${character.build}.`,
	)

	if (character.numberOfUnlockedOutfits === character.outfits.length) {
		sentences.push(`All her ${character.outfits.length} (including the final broken one) outfits are unlocked and outgrown.`);
	} else if (!character.unlocked) {
		sentences.push("She hasn't been unlocked yet.")
	} else {
		sentences.push(`${character.numberOfUnlockedOutfits} of her ${character.outfits.length} outfits (including the final broken one) ${character.numberOfUnlockedOutfits === 1 ? 'is' : 'are'} unlocked.`)
	}

	if (character.stats?.totalDonationReceived) {
		sentences.push(`So far, she has received $${formatMoney(character.stats.totalDonationReceived)}.`)
	} else {
		sentences.push(`She hasn't received any donations... yet.`)
	}

	function selectOutfit(outfit: OutfitOfCharacterViewModel) {
		dispatch('selectoutfit', {
			characterSlug: character.nameSlug,
			outfitSlug: outfit.broken ? 'broken': outfit.outfitSlug || '',
		})
	}

	function close() {
		dispatch('close', {})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>
<text x="38%" y="14%" class="character-name">{character.name}</text>
<image
	xlink:href="{getBodyPicLink(character.nameSlug, getHeaviestOutfitSlug(character))}"
	x="6%"
	y="10%"
	height="80%"
	style="{character.unlocked ? '' : 'filter: grayscale(1);'}"
/>

{#if !showOutfits}
	<text class="sentence" y="18%">
		{#each sentences as sentence}
			<tspan x="36%" dy="4%">{sentence}</tspan>
		{/each}
	</text>
{:else}
	{#each outfitsOfCharacter as outfit}
		<Portrait model="{outfit}" ></Portrait>
		<text class="sentence" y="{outfit.y + 14}%">
			<tspan x="{outfit.x + 6}%">{outfit.outfitName}</tspan>
			<tspan x="{outfit.x + 6}%" dy="5%">{outfit.outfitWeightLabel}</tspan>
		</text>
		<rect x="{outfit.x - 1}%" y="{outfit.y + 10}%" height="13%" width="18%" fill="#ae2f29" opacity='0' on:click={() => selectOutfit(outfit)}/>
	{/each}
{/if}

<text x="50%" y="93%" text-anchor="middle"><a class="link-tree-link" href="{donationURL}">Donate to make her grow!</a></text>

<rect x="68.1%" y="83.5%" height="4.6%" width="12%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => showOutfits = !showOutfits}></rect>
<text x="69%" y="87%" class="button-label" on:click={() => showOutfits = !showOutfits}>{showOutfits ? 'see her info' : 'see her outfits'}</text>

<rect x="83.1%" y="83.5%" height="4.6%" width="8%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => close()}></rect>
<text x="84%" y="87%" class="button-label" on:click={() => close()}>close</text>

<style>
	.character-name {
		fill: white;
		font-size: 7px;
	}

	.sentence {
		fill: white;
		font-size: 3px;
	}

	.button-label {
		fill: white;
		font-size: 3px;
	}

	.link-tree-link {
		fill: blue;
		text-decoration: underline;
		font-size: 4px;
	}
</style>
