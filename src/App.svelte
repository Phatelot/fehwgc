<script lang="ts">
    import bgLink from '/src/assets/BG.webp'

    import CharacterChart from './lib/character_chart.svelte';

    import { toCompletedState, type CompletedState } from './lib/completed_state';
    import { applyDonations } from './lib/donation_engine';
    import { parseCsvData } from './lib/donation_log_parser';
    import { initState } from './lib/state';
    import { viewPortHeight, viewPortWidth } from './lib/view_model';
    import Box from './lib/box.svelte';
    import OutfitPopup from './lib/outfit_popup.svelte';

    async function fetchData(): Promise<CompletedState> {
      const response = await fetch("https://api.github.com/gists/8c4b31c95b425cb40d3f865d95561bfa", {
        cache: "no-store",
        headers: {
          "Accept": "application/vnd.github+json",
        },
      });
      const donations = parseCsvData(JSON.parse(await response.text())
        .files['donos.csv']
        .content);

      const states = applyDonations(initState(), donations)
      const lastState = states[states.length-1];

      return toCompletedState(lastState);
    }

    // $: page = 'CHARACTER_CHART';
    let selectedCharacterSlug: string | null;
    $: selectedCharacterSlug = null;
    let selectedOutfitSlug: string | null;
    $: selectedOutfitSlug = null;

    // let displayImmobilityThresholds = false;
    // let groupCharacters = false;

    // function setPage(newPage: string) {
    //   if (selectedCharacterName) {
    //     return;
    //   }
    //   page = newPage;
    //   saveStateToLocalStorage();
    // }

    function selectOutfit(characterSlug: string, outfitSlug: string) {
      selectedCharacterSlug = characterSlug;
      selectedOutfitSlug = outfitSlug;
      // saveStateToLocalStorage();
    }

    // function saveStateToLocalStorage() {
    //   localStorage.setItem("fehwgc", JSON.stringify({
    //     displayImmobilityThresholds,
    //     selectedCharacterName,
    //     page,
    //     groupCharacters,
    //   }))
    // }

    // function restoreStateFromLocalStorage() {
    //   const retrieved = localStorage.getItem("fehwgc");
    //   if (!retrieved) {
    //     return
    //   }
    //   const parsedRetrieved = JSON.parse(retrieved);
    //   displayImmobilityThresholds = parsedRetrieved.displayImmobilityThresholds;
    //   selectedCharacterName = parsedRetrieved.selectedCharacterName;
    //   page = parsedRetrieved.page;
    //   groupCharacters = parsedRetrieved.groupCharacters;
    // }
  </script>

  <main>
      <svg viewBox="0 0 {viewPortWidth} {viewPortHeight}" xmlns="http://www.w3.org/2000/svg" class="chart">
        <defs>
          <linearGradient id="bg-mask-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"></stop>
            <stop offset="60%" stop-color="#ffffff"></stop>
            <stop offset="100%" stop-color="#000000"></stop>
          </linearGradient>
          <mask id="bg-mask" x="0%" y="0%" width="100%" height="100%" maskUnits="userSpaceOnUse">
            <rect x="0%" y="0%" width="100%" height="100%" fill="url(#bg-mask-gradient)" />
          </mask>
        </defs>

        <image xlink:href="{bgLink}" width=100% mask="url(#bg-mask)"/>

      {#await fetchData()}
        <text x="50%" y="45%" class="menu" text-anchor="middle">Loading data...</text>
      {:then viewModel}

        <defs>
          {#each viewModel.games as game}
            <linearGradient id="{game.nameSlug}Gradient" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0%" stop-color="{game.darkColor}" />
              <stop offset="100%" stop-color="{game.lightColor}" />
            </linearGradient>
          {/each}
        </defs>


        <CharacterChart state="{viewModel}" on:selectoutfit={(e) => selectOutfit(e.detail.characterSlug, e.detail.outfitSlug)}/>

        {#if !!selectedCharacterSlug && !!selectedOutfitSlug}
          <OutfitPopup
            characterSlug="{selectedCharacterSlug}"
            outfitSlug="{selectedOutfitSlug}"
            state="{viewModel}"
            on:close={() => {(selectedCharacterSlug = null); (selectedOutfitSlug = null); /* saveStateToLocalStorage()*/}}
          />
        {/if}
        <!-- <Box x={3} y={7} width={35} height={24}></Box> -->

      {:catch error}
        <text x="50%" y="45%" class="menu" text-anchor="middle">Error: {JSON.stringify(error)}</text>
      {/await}



      </svg>


  </main>

<style>
  .chart {
    display: block;
  }

  .menu {
    font-size: 4px;
  }
</style>
