<script lang="ts">
    import { getBodyPicLink, getChibiPicLink, getTraitPicLink } from "./asset_utils";
    import Box from "./box.svelte";
    import { getCharacterCompletedState, getOutfitCompletedState, weighAsMuchAsTheXSmallest, type CharacterCompletedState, type CompletedState, type OutfitCompletedState } from "./completed_state";
    import { donationURL } from "./donation_engine";
    import type { Shape } from "./metadata";
    import { traitNames } from "./trait";
    import { formatMoney } from "./utils";
    import { viewPortWidth } from "./view_model";
    import { formatBMI, formatPercentage, formatWeight, toBMICategory, toImperialHeight, weightInLbsForBMI } from "./weight_utils";

	import appleLink from '/src/assets/shapes/apple.png'
	import circleLink from '/src/assets/shapes/circle.png'
	import hourglassLink from '/src/assets/shapes/hourglass.png'
	import pearLink from '/src/assets/shapes/pear.png'
	import triangleLink from '/src/assets/shapes/triangle.png'

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		close: {},
		selectcharacter: {
			characterSlug: string,
		},
		selectshape: {
			shape: string;
		};
		selecttrait: {
			trait: string;
		};
	}>();

	export let characterSlug: string;
	export let outfitSlug: string;
	export let state: CompletedState;

	let traitTextElement: SVGTSpanElement;
	let traitTextWidthPercent = 0;

	let shapeTextElement: SVGTSpanElement;
	let shapeTextWidthPercent = 0;

	function linkFromShape(shape: Shape) : string {
		return {
			'💎': triangleLink,
			'🍎': appleLink,
			'⌛': hourglassLink,
			'🟣': circleLink,
			'🍐': pearLink,
		}[shape]
	}

	$: if (!!traitTextElement) {
		const traitTextWidth = traitTextElement.getBBox().width;
		traitTextWidthPercent = (traitTextWidth / viewPortWidth) * 100;
	}

	$: if (!!shapeTextElement) {
		const shapeTextWidth = shapeTextElement.getBBox().width;
		shapeTextWidthPercent = (shapeTextWidth / viewPortWidth) * 100;
	}

	let character = getCharacterCompletedState(state, characterSlug) as CharacterCompletedState;
	let outfit = getOutfitCompletedState(state, characterSlug, outfitSlug) as OutfitCompletedState;

	const imperialHeight = toImperialHeight(outfit.heightInMeters);
	const weighsAsMuchAsXSmallestCombined = weighAsMuchAsTheXSmallest(outfit, state);

	let traitSentenceIndex: number;
	let shapeSentenceIndex: number;
	let locatorSentenceIndex: number;

	function createSentences(): string[] {
		const sentences = [
			`${outfit.characterName} is from the game ${outfit.gameName} (${outfit.groupName ? 'group: ' + outfit.groupName : 'not in any group'}).`
		]

		if (!outfit.unlocked) {
			if (character.outfits[0].nameSlug === outfit.nameSlug) {
				sentences.push(`She hasn't been unlocked yet (she still needs $${formatMoney(120 - character.donationReceived)}).`);
			} else {
				sentences.push(`She hasn't been unlocked yet (she needs to outgrow her previous outfits first).`);
			}
			return sentences;
		}

		locatorSentenceIndex = sentences.length;
		sentences.push(`See her on the spread`);

		if (outfit.broken && (['ena', 'heiorun', 'hraesvelgr', 'niohoggr'].indexOf(characterSlug) >= 0)) {
			sentences.push(
				`In this outfit, she weighs ${formatWeight(outfit.weightInLbs)}lbs.`,
			);
		} else {
			sentences.push(
				`In this outfit, she weighs ${formatWeight(outfit.weightInLbs)}lbs and is ${imperialHeight} tall.`,
			);
		}

		const bmiCategory = toBMICategory(outfit.BMI);
		if (bmiCategory === 'underweight') {
			sentences.push(`That gives her a BMI of ${formatBMI(outfit.BMI)}, so the poor girl is ${bmiCategory}.`)
		} else {
			sentences.push(`That gives her a BMI of ${formatBMI(outfit.BMI)}, so she is ${bmiCategory}.`)
		}

		if (imperialHeight !== `5'5"`) {
			sentences.push(`If she was 5'5", with constant BMI, she'd weigh ${formatWeight(weightInLbsForBMI(1.651, outfit.BMI))}lbs.`);
		}

		if (weighsAsMuchAsXSmallestCombined > 1) {
			sentences.push(`On her own, she weighs as much as the ${weighsAsMuchAsXSmallestCombined} smallest characters combined.`)
		}

		const weightTotalPercentage = (outfit.weightInLbs * 100)/state.stats.totalWeightUnlockedInLbs
		if (weightTotalPercentage >= 0.1) {
			sentences.push(`She accounts for ${formatPercentage(weightTotalPercentage)}% of the total weight of all outfits.`)
		}

		shapeSentenceIndex = sentences.length;
		if (outfit.secondaryShape) {
			sentences.push(`Her shapes are: `)
		} else {
			sentences.push(`Her shape is: `)
		}
		sentences.push(`Her build is ${outfit.build}.`);

		traitSentenceIndex = sentences.length;

		sentences.push(`This outfit rolled the trait ${traitNames[outfit.trait] || ''}:`);

		if (outfit.isSelfFeeding || outfit.selfFedBy || outfit.boundFeeding || outfit.mutualGainingWith || outfit.isBlobBound || outfit.isGreedyGuts || outfit.isChaosFeeder || outfit.isGenerous) {
			sentences.push(`The rules are altered for her!`)
		}

		if (outfit.isSelfFeeding) {
			sentences.push(
				`While she can't gain herself, all other outfits of this character have`,
				`their gain DOUBLED!`,
			);
		} else if (outfit.selfFedBy) {
			sentences.push(`She is self-fed by ${outfit.selfFedBy}.`);
		}
		if (outfit.boundFedBy) {
			sentences.push(`She is fed by ${outfit.boundFedBy}.`);
		} else if (outfit.boundFeeding) {
			sentences.push(
				`While she can't gain herself, all donos to her are DOUBLED, then sent to her feedee!`,
				`She rolled ${outfit.boundFeeding} as her feedee!`,
			);
		} else if (outfit.mutualGainingWith) {
			sentences.push(`She is bound to ${outfit.mutualGainingWith}, and all donos to one, grow the other!`);
		} else if (outfit.isBlobBound) {
			sentences.push(`Destined for fatness, donations to her are multiplied by an extra 50%!`);
		} else if (outfit.isGreedyGuts) {
			sentences.push(`She hates sharing! Donations to her are DOUBLED, but provide NO spillover!`);
		} else if (outfit.isChaosFeeder) {
			sentences.push(
				`While she can't gain weight herself, all donations to her are TRIPLED,`,
				`and sent to a random unlocked character!`,
			);
		} else if (outfit.isGenerous) {
			sentences.push(`She shares the spoils- donations to her are halved, but all spillover is doubled!`);
		}

		if (outfit.outgrown && outfit.outgrownThresholdInLbs) {
			sentences.push(`She has outgrown this outfit since she reached ${formatWeight(outfit.outgrownThresholdInLbs)}lbs.`)
		} else if (outfit.outgrownThresholdInLbs) {
			sentences.push(`That outfit can withstand up to ${formatWeight(outfit.outgrownThresholdInLbs)}lbs.`)
		}

		if (outfit.donationReceived) {
			sentences.push(`So far, this outfit has received $${formatMoney(outfit.donationReceived)}.`)
		} else {
			sentences.push(`This outfit hasn't received any donations... yet.`)
		}

		return sentences;
	}

	let sentences = createSentences();

	function selectShape() {
		dispatch("selectshape", { shape: (outfit.mainShape || '') + (outfit.secondaryShape || '') })
		close();
	}

	function selectTrait() {
		dispatch("selecttrait", { trait: outfit.trait })
		close();
	}

	function close() {
		dispatch('close', {})
	}

	function openCharacterPopup() {
		dispatch('selectcharacter', {
			characterSlug: characterSlug,
		})
	}

</script>

<Box x={2} y={5} width={96} height={90}></Box>
<text x="38%" y="14%" class="character-name">{outfit.characterName} - {outfit.name}</text>

{#if outfit.characterSlug == 'edelgard' && outfit.broken && outfit.nameSlug == 'fallen'}
	<image
		xlink:href="{getBodyPicLink(outfit.characterSlug, outfit.nameSlug || '').replace('body', 'body_alt')}"
		x="6%"
		y="10%"
		height="80%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{:else if outfit.broken && (outfit.characterSlug == 'ena' || outfit.characterSlug == 'heiorun' || outfit.characterSlug == 'hraesvelgr' || outfit.characterSlug == 'niohoggr') }
	<image
		xlink:href="{getBodyPicLink(outfit.characterSlug, outfit.nameSlug || '').replace('body', 'body_alt')}"
		x="6%"
		y="10%"
		height="80%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{:else}
	<image
		xlink:href="{getBodyPicLink(outfit.characterSlug, outfit.nameSlug || '')}"
		x="6%"
		y="10%"
		height="80%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{/if}


{#if outfit.characterSlug == 'edelgard' && outfit.broken && outfit.nameSlug == 'fallen'}
	<image
		xlink:href="{getChibiPicLink(outfit.characterSlug, outfit.nameSlug || '').replace('chibi', 'chibi_alt')}"
		x="58%"
		y="65%"
		height="25%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{:else if outfit.broken && (outfit.characterSlug == 'ena' || outfit.characterSlug == 'heiorun' || outfit.characterSlug == 'hraesvelgr' || outfit.characterSlug == 'niohoggr') }
	<image
		xlink:href="{getChibiPicLink(outfit.characterSlug, outfit.nameSlug || '').replace('chibi', 'chibi_alt')}"
		x="58%"
		y="65%"
		height="25%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{:else}
	<image
		xlink:href="{getChibiPicLink(outfit.characterSlug, outfit.nameSlug || '')}"
		x="58%"
		y="65%"
		height="25%"
		style="{outfit.unlocked ? '' : 'filter: grayscale(1);'}"
	/>
{/if}



<text class="sentence" y="18%">
	{#each sentences as sentence, i}
		{#if i == traitSentenceIndex }
			<tspan bind:this={traitTextElement} id="sentence-{i}" x="36%" dy="4%">{sentence}</tspan>
		{:else if i == shapeSentenceIndex}
			<tspan bind:this={shapeTextElement} id="sentence-{i}" x="36%" dy="4%">{sentence}</tspan>
		{:else if i == locatorSentenceIndex}
			<tspan x="36%" dy="4%"><a class="link-locator-link" href={`https://phatelot.github.io/fehwgc-locator/#/?cs=${outfit.characterSlug}_${outfit.broken ? 'broken': outfit.nameSlug}`}>{sentence}</a></tspan>
		{:else}
			<tspan x="36%" dy="4%">{sentence}</tspan>
		{/if}
	{/each}
</text>


{#each sentences as _, i}
	{#if i == shapeSentenceIndex}
		{#if outfit.mainShape}
			<image
				xlink:href="{linkFromShape(outfit.mainShape)}"
				x="{36 + shapeTextWidthPercent}%"
				y="{18.5 + i * 4}%"
				height="5%"
			/>
			<rect x="{36 + shapeTextWidthPercent}%" y="{18.5 + i * 4}%" height="5%" width="2.2%" fill="#ae2f29" opacity='0' on:click={() => selectShape()}/>
		{/if}
		{#if outfit.secondaryShape}
			<image
				xlink:href="{linkFromShape(outfit.secondaryShape)}"
				x="{38 + shapeTextWidthPercent}%"
				y="{18.5 + i * 4}%"
				height="5%"
			/>
			<rect x="{38 + shapeTextWidthPercent}%" y="{18.5 + i * 4}%" height="5%" width="2.2%" fill="#ae2f29" opacity='0' on:click={() => selectShape()}/>
		{/if}
	{/if}

	{#if i == traitSentenceIndex}
		<image
			xlink:href="{getTraitPicLink(outfit.trait)}"
			x="{36 + traitTextWidthPercent}%"
			y="{18 + i *4}%"
			height="7%"
		/>
		<rect x="{36 + traitTextWidthPercent}%" y="{18.5 + i * 4}%" height="7%" width="3%" fill="#ae2f29" opacity='0' on:click={() => selectTrait()}/>
	{/if}
{/each}

{#if outfit.unlocked}
	<text x="50%" y="93%" text-anchor="middle"><a class="link-tree-link" href="{donationURL}">Donate to make her grow!</a></text>
{:else}
	<text x="50%" y="93%" text-anchor="middle"><a class="link-tree-link" href="{donationURL}">Donate to unlock her!</a></text>
{/if}

<rect x="68.1%" y="83.5%" height="4.6%" width="12%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => openCharacterPopup()}></rect>
<text x="69%" y="87%" class="button-label" on:click={() => openCharacterPopup()}>character info</text>

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

	.link-locator-link {
		fill: blue;
		text-decoration: underline;
	}

	.link-tree-link {
		fill: blue;
		text-decoration: underline;
		font-size: 4px;
	}
</style>
