<script lang="ts">
    import bgLink from '/src/assets/BG.webp'

    import { Octokit } from 'octokit';
    import { toCompletedState, type CompletedState } from './lib/completed_state';
    import { applyDonations } from './lib/donation_engine';
    import { parseCsvData } from './lib/donation_log_parser';
    import { initState, type Donation } from './lib/state';
    import { viewPortHeight, viewPortWidth } from './lib/view_model';
    import Box from './lib/box.svelte';
    import OutfitChart from './lib/outfit_chart.svelte';
    import OutfitPopup from './lib/outfit_popup.svelte';
    import CharacterChart from './lib/character_chart.svelte';
    import CharacterPopup from './lib/character_popup.svelte';
    import MenuPopup from './lib/menu_popup.svelte';

    async function fetchData(): Promise<CompletedState> {
      try {
        const token = localStorage.getItem('fehwgc-admin') || '';
        const gistId = '8c4b31c95b425cb40d3f865d95561bfa';

        let donations: Donation[];
        if (!token) {
          const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            cache: "no-store",
            headers: {
              "Accept": "application/vnd.github+json",
            },
          });
          donations = parseCsvData(JSON.parse(await response.text())
            .files['donos.csv']
            .content);
        } else {
          const octokit = new Octokit({
            auth: token,
          });

          const response = await octokit.request(`GET /gists/${gistId}`);
          const files = response.data.files;
          const donoFile = (files || {})['donos.csv'];
          const content = donoFile?.content || '';
          donations = parseCsvData(content);
        }

        const states = applyDonations(initState(), donations)
        const lastState = states[states.length-1];

        restoreStateFromLocalStorage();

        return toCompletedState(lastState);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    $: page = 'OUTFIT_CHART';
    let selectedCharacterSlug: string | null;
    $: selectedCharacterSlug = null;
    let selectedOutfitSlug: string | null;
    $: selectedOutfitSlug = null;

    function selectOutfit(characterSlug: string, outfitSlug: string) {
      selectedCharacterSlug = characterSlug;
      selectedOutfitSlug = outfitSlug;
      saveStateToLocalStorage();
    }

    function selectCharacter(characterSlug: string) {
      selectedCharacterSlug = characterSlug;
      saveStateToLocalStorage();
    }

    function saveStateToLocalStorage() {
      localStorage.setItem("fehwgc", JSON.stringify({
        page,
        selectedCharacterSlug,
        selectedOutfitSlug,
      }))
    }

    function restoreStateFromLocalStorage() {
      const retrieved = localStorage.getItem("fehwgc");
      if (!retrieved) {
        return
      }
      const parsedRetrieved = JSON.parse(retrieved);
      page = parsedRetrieved.page;
      selectedCharacterSlug = parsedRetrieved.selectedCharacterSlug;
      selectedOutfitSlug = parsedRetrieved.selectedOutfitSlug;
    }
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

        {#if page === 'OUTFIT_CHART'}
          <OutfitChart state="{viewModel}" on:selectoutfit={(e) => selectOutfit(e.detail.characterSlug, e.detail.outfitSlug)}/>
        {:else if page === 'CHARACTER_CHART'}
          <CharacterChart state="{viewModel}" on:selectcharacter={(e) => selectCharacter(e.detail.characterSlug)}/>
        {:else}
          <MenuPopup on:selectpage={(e) => {(page = e.detail.page);  saveStateToLocalStorage()}}/>
        {/if}

        {#if !!selectedCharacterSlug && !!selectedOutfitSlug}
          <OutfitPopup
            characterSlug="{selectedCharacterSlug}"
            outfitSlug="{selectedOutfitSlug}"
            state="{viewModel}"
            on:close={() => {(selectedCharacterSlug = null); (selectedOutfitSlug = null); saveStateToLocalStorage()}}
          />
        {:else if !!selectedCharacterSlug}
          <CharacterPopup
            characterSlug="{selectedCharacterSlug}"
            state="{viewModel}"
            on:close={() => {(selectedCharacterSlug = null); (selectedOutfitSlug = null); saveStateToLocalStorage()}}
          />
        {:else if page !== 'MENU'}
          <Box x={1.5} y={3} width={10} height={5} on:click={(e) => {(page = 'MENU');}} />
          <text x="4.5%" y="6.2%" class="button-menu" on:click={(e) => {(page = 'MENU');}}>menu</text>
        {/if}

      {:catch error}
        <text x="50%" y="45%" style="font-size: 3px" text-anchor="middle">Error: {JSON.stringify(error)}</text>
      {/await}



      </svg>


  </main>

<style>
  .chart {
    display: block;
  }

  .button-menu {
    fill: white;
    font-size: 3px;
  }
</style>
