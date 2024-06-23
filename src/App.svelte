<script lang="ts">
    import CharacterChart from './lib/character_chart.svelte';
    import PartyChart from './lib/party_chart.svelte';

    import cornerSvg from '/src/assets/corner.svg';
    import titleJpg from '/src/assets/title.jpg';

    import { parseTsvData } from './lib/data_parser';
    import { toCharacterStats, toPartyStats } from './lib/stats';
    import { type ChartViewModel, toViewModel } from './lib/view_model';
    import CharacterPopup from './lib/character_popup.svelte';
    import AllCharacters from './lib/all_characters.svelte';
    import ReverseDonationLog from './lib/reverse_donation_log.svelte';

    async function fetchData(): Promise<ChartViewModel> {
      let response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vShRwjPHvlfF_8R6YEjJ4LvbvJ8BOCn5r3HikzbXJhrJYklPAr19Ibbpmcb09wCg9Gr5_OhfX_F-1LS/pub?gid=0&single=true&output=tsv");
      const rawDonations = parseTsvData(await response.text());
      const characterStats = toCharacterStats(rawDonations);
      const partyStats = toPartyStats(characterStats);
      return toViewModel(characterStats, partyStats, rawDonations);
    }

    $: page = 'CHARACTER_CHART';
    let selectedCharacterName: string | null;
    $: selectedCharacterName = null;

    let displayImmobilityThresholds = false;
    let groupCharacters = false;

    function setPage(newPage: string) {
      page = newPage;
    }

    function selectCharacter(characterName: string) {
      selectedCharacterName = characterName;
    }
  </script>

  <main>
    {#await fetchData()}
      <p>loading data...</p>
    {:then viewModel}

      <svg viewBox="0 0 {viewModel.viewPortWidth} {viewModel.viewPortHeight}" xmlns="http://www.w3.org/2000/svg" class="chart">
        <defs>
          <linearGradient id="orangeGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#8b4b22" />
            <stop offset="100%" stop-color="#edc051" />
          </linearGradient>
          <linearGradient id="darkTealGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#084c56" />
            <stop offset="100%" stop-color="#10a5ad" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#901e1d" />
            <stop offset="100%" stop-color="#da3a37" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#3a447f" />
            <stop offset="100%" stop-color="#86a8e2" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#4525cb" />
            <stop offset="100%" stop-color="#9464b6" />
          </linearGradient>
          <linearGradient id="darkGreenGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#0a4334" />
            <stop offset="100%" stop-color="#16a375" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#1e5119" />
            <stop offset="100%" stop-color="#41ba36" />
          </linearGradient>
          <linearGradient id="pinkGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#9d397b" />
            <stop offset="100%" stop-color="#ec61d4" />
          </linearGradient>

        </defs>

        {#if page !== 'MENU'}
          <rect x="4%" y="3.5%" height="4.6%" width="6%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5"></rect>
          <text x="4.2%" y="7%" class="menu" on:click={() => setPage('MENU')} >Menu</text>
        {/if}

        <image x="25%" y="3%" width="50%" xlink:href="{titleJpg}" />

        {#if page === 'MENU'}
        <rect x="20%" y="16.5%" height="4.6%" width="22%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" on:click={() => setPage('CHARACTER_CHART')}></rect>
        <rect x="20%" y="38.5%" height="4.6%" width="22%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" on:click={() => setPage('PARTY_CHART')}></rect>
        <rect x="20%" y="48.5%" height="4.6%" width="22%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" on:click={() => setPage('CHARACTER_STATS')}></rect>
        <rect x="20%" y="58.5%" height="4.6%" width="22%" rx="1px" ry="1px" stroke="#ae2f29" stroke-width="0.4" stroke-linecap="round" fill="#f9edd5" on:click={() => setPage('REVERSE_DONATION_LOG')}></rect>
        <text x="20%" y="20%">
          <tspan x="22%" dy="0%" class="menu" on:click={() => setPage('CHARACTER_CHART')}>Character chart</tspan>
          <tspan x="20%" dy="7%" class="menu" on:click={() => (displayImmobilityThresholds = !displayImmobilityThresholds)}>Immobility thresholds: {displayImmobilityThresholds ? 'ON' : 'OFF'}</tspan>
          <tspan x="20%" dy="5%" class="menu" on:click={() => (groupCharacters = !groupCharacters)}>Group unnamed characters: {groupCharacters ? 'ON' : 'OFF'}</tspan>
          <tspan x="22%" dy="10%" class="menu" on:click={() => setPage('PARTY_CHART')}>Party chart</tspan>
          <tspan x="22%" dy="10%" class="menu" on:click={() => setPage('CHARACTER_STATS')}>Character stats</tspan>
          <tspan x="22%" dy="10%" class="menu" on:click={() => setPage('REVERSE_DONATION_LOG')}>Donation log</tspan>
        </text>
        {:else if page === 'CHARACTER_CHART'}
          <CharacterChart viewModel="{viewModel}" groupCharacters={groupCharacters} displayPromoText={!displayImmobilityThresholds} on:selectcharacter={(e) => selectCharacter(e.detail.characterName)} />
        {:else if page === 'PARTY_CHART'}
          <PartyChart viewModel="{viewModel}" />
        {:else if page === 'CHARACTER_STATS'}
          <AllCharacters viewModel="{viewModel}" on:selectcharacter={(e) => selectCharacter(e.detail.characterName)} />
        {:else if page === 'REVERSE_DONATION_LOG'}
          <ReverseDonationLog viewModel="{viewModel}" on:selectcharacter={(e) => selectCharacter(e.detail.characterName)} />
        {/if}


        <image x="0%" y="0%" height="8%" xlink:href="{cornerSvg}" />
        <image x="0%" y="0%" height="8%" xlink:href="{cornerSvg}" transform='scale(-1, 1)' transform-origin="center"/>
        <image x="0%" y="0%" height="8%" xlink:href="{cornerSvg}" transform='scale(1, -1)' transform-origin="center"/>
        <image x="0%" y="0%" height="8%" xlink:href="{cornerSvg}" transform='scale(-1, -1)' transform-origin="center"/>
        <rect x="{`${8 * viewModel.viewPortHeight / viewModel.viewPortWidth - 0.2}%`}" y="0" height="1.4%" width="{`${100 - 2 * 8 * viewModel.viewPortHeight / viewModel.viewPortWidth + 0.4}%`}" fill="#ae2f29" />
        <rect x="{`${8 * viewModel.viewPortHeight / viewModel.viewPortWidth - 0.2}%`}" y="1.7%" height="0.75%" width="{`${100 - 2 * 8 * viewModel.viewPortHeight / viewModel.viewPortWidth + 0.4}%`}" fill="#ae2f29" />

        <rect x="0%" y="98.6%" height="1.5%" width="100%" fill="#ae2f29" />
        <rect x="{`${8 * viewModel.viewPortHeight / viewModel.viewPortWidth - 0.2}%`}" y="97.55%" height="0.75%" width="{`${100 - 2 * 8 * viewModel.viewPortHeight / viewModel.viewPortWidth + 0.4}%`}" fill="#ae2f29" />

        <rect x="0%" y="7.8%" height="84.4%" width="0.65%" fill="#ae2f29" />
        <rect x="0.8%" y="7.8%" height="84.4%" width="0.4%" fill="#ae2f29" />

        <rect x="99.35%" y="7.8%" height="84.4%" width="0.65%" fill="#ae2f29" />
        <rect x="98.8%" y="7.8%" height="84.4%" width="0.4%" fill="#ae2f29" />

        {#if !!selectedCharacterName}
          <CharacterPopup viewModel="{viewModel}" characterName="{selectedCharacterName}" on:close={() => selectedCharacterName = null}/>
        {/if}


      </svg>

    {:catch error}
      <p>error: {error}</p>
    {/await}
  </main>

<style>
  .chart {
    display: block;
    background-color: #f9edd5;
  }

  .menu {
    font-size: 4px;
  }
</style>
