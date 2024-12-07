<script lang="ts">
	import arrowSvg from '/src/assets/arrow_light.svg'

    import type { Omnistate } from "./completed_state";
    import {viewPortHeight, viewPortWidth } from "./view_model";
    import Box from './box.svelte';
    import { serializeChanges } from './change_engine';

	export let state: Omnistate;

    $: start = Math.max(state.donations.length - 1, 0);
    $: end = state.donations.length;

    function decrementStart() {
        start = Math.max(0, start-1);
    }

    function incrementStart() {
        if (start < state.donations.length - 1) {
            start = start + 1;
            if (start === end) {
                end = end + 1;
            }
        }
        pageNumber = 0
    }

    function decrementEnd() {
        if (end > 1) {
            end = end - 1;
            if (start === end) {
                start = start - 1
            }
        }
        pageNumber = 0
    }

    function incrementEnd() {
        end = Math.min(end + 1, state.donations.length)
    }

    function allDonations() {
        start = 0;
        end = state.donations.length;
    }

    function lastDonation() {
        start = Math.max(state.donations.length - 1, 0);
        end = state.donations.length;
        pageNumber = 0;
    }

    $: sentences = (() => {
        if (start === end) {
            return ['No donations yet!']
        }
        const startState = state.states[start];
        const endState = state.states[end];

        return serializeChanges([startState, endState]);
    })()

    const maxSentencesPerPage = 12;

    $: pageNumber = 0;
    $: maxPageNumber = (() => {
        return Math.floor((sentences.length - 1) / maxSentencesPerPage);
    })()


    function decrementPageNumber() {
        pageNumber = Math.max(0, pageNumber - 1)
    }

    function incrementPageNumber() {
        pageNumber = Math.min(maxPageNumber, pageNumber + 1)
    }

    $: page = sentences.slice(pageNumber * maxSentencesPerPage, (pageNumber + 1) * maxSentencesPerPage)

    function label(i: number): string {
        if (i <= 0) {
            return 'Beginning'
        }
        return `Donation ${i}`
    }

</script>

<Box x={2} y={5} width={96} height={90}></Box>

<text x="41%" y="14%" class="title">Changelog</text>


<Box x={26} y={18} width={10} height={5} />
<text x="27%" y="21.2%" class="button-label">{label(start)}</text>
<image x="22.6%" y="19%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => decrementStart()}/>
<rect x="21%" y="16%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => decrementStart()}/>
<image x="-40.4%" y="19%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => incrementStart()}/>
<rect x="36.2%" y="16%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => incrementStart()}/>

<Box x={64} y={18} width={10} height={5} />
<text x="65%" y="21.2%" class="button-label">{label(end)}</text>
<image x="60.6%" y="19%" height="3%" xlink:href="{arrowSvg}" transform='scale(1, 1)' on:click={() => decrementEnd()}/>
<rect x="59%" y="16%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => decrementEnd()}/>
<image x="-78.4%" y="19%" height="3%" xlink:href="{arrowSvg}" transform='scale(-1, 1)' on:click={() => incrementEnd()}/>
<rect x="74.2%" y="16%" height="9%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => incrementEnd()}/>

<rect x="31.9%" y="24.5%" height="4.6%" width="12%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => allDonations()}></rect>
<text x="32.8%" y="28%" class="button-label" on:click={() => allDonations()}>All donations</text>

<rect x="56.1%" y="24.5%" height="4.6%" width="12%" rx="1px" ry="1px" stroke="#aeffff" stroke-width="0.4" stroke-linecap="round" fill="#004858" on:click={() => lastDonation()}></rect>
<text x="57%" y="28%" class="button-label" on:click={() => lastDonation()}>Last donation</text>

<text class="sentence" y="30%">
	{#each page as sentence, i}
        <tspan x="12%" dy="5%">{sentence}</tspan>
	{/each}
</text>


{#if maxPageNumber > 0}
    <image x="60.6%" y="19%" height="3%" xlink:href="{arrowSvg}" transform='scale(1.5, 1.5) rotate(90, {60.1 / 100 * viewPortWidth}, {21 / 100 * viewPortHeight})' on:click={() => decrementPageNumber()}/>
    <rect x="87.5%" y="25%" height="20%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => decrementPageNumber()}/>

    <text class="sentence" y="48.5%">
        <tspan x="89%">{pageNumber+1}/{Math.max(pageNumber+1, maxPageNumber+1)}</tspan>
    </text>

    <image x="60.5%" y="40%" height="3%" xlink:href="{arrowSvg}" transform='scale(1.5, 1.5) rotate(270, {60.5 / 100 * viewPortWidth}, {42 / 100 * viewPortHeight})' on:click={() => incrementPageNumber()}/>
    <rect x="87.5%" y="50%" height="20%" width="5.8%" fill="#ae2f29" opacity='0' on:click={() => incrementPageNumber()}/>
{/if}

<style>
	.title {
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
</style>
