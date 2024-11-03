<script lang="ts">
    import bgLink from '/src/assets/BG.webp'

    import CharacterChart from './lib/character_chart.svelte';

    import { toCompletedState, type CompletedState } from './lib/completed_state';
    import { applyDonations } from './lib/donation_engine';
    import { parseCsvData } from './lib/donation_log_parser';
    import { initState } from './lib/state';
    import { viewPortHeight, viewPortWidth } from './lib/view_model';

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

      // console.log("donations", JSON.stringify(rawDonations, null, 2))
      // console.log("last state", JSON.stringify(lastState, null, 2))
      return toCompletedState(lastState);
    }

    $: page = 'CHARACTER_CHART';
    let selectedCharacterName: string | null;
    $: selectedCharacterName = null;

    let displayImmobilityThresholds = false;
    let groupCharacters = false;

    function setPage(newPage: string) {
      if (selectedCharacterName) {
        return;
      }
      page = newPage;
      saveStateToLocalStorage();
    }

    function selectCharacter(characterName: string) {
      selectedCharacterName = characterName;
      saveStateToLocalStorage();
    }

    function saveStateToLocalStorage() {
      localStorage.setItem("fehwgc", JSON.stringify({
        displayImmobilityThresholds,
        selectedCharacterName,
        page,
        groupCharacters,
      }))
    }

    function restoreStateFromLocalStorage() {
      const retrieved = localStorage.getItem("fehwgc");
      if (!retrieved) {
        return
      }
      const parsedRetrieved = JSON.parse(retrieved);
      displayImmobilityThresholds = parsedRetrieved.displayImmobilityThresholds;
      selectedCharacterName = parsedRetrieved.selectedCharacterName;
      page = parsedRetrieved.page;
      groupCharacters = parsedRetrieved.groupCharacters;
    }
  </script>

  <main>


      <svg viewBox="0 0 {viewPortWidth} {viewPortHeight}" xmlns="http://www.w3.org/2000/svg" class="chart">
        <image xlink:href="{bgLink}" width=100% />

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


        <CharacterChart state="{viewModel}" />

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
