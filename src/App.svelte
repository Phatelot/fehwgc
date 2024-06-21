<script lang="ts">
    import WeightLabel from './lib/weight_label.svelte'

    import { parseTsvData } from './lib/data_parser';
    import { toCharacterStats } from './lib/stats';
    import { type ViewModel, toViewModel } from './lib/view_model';

    async function fetchData(): Promise<ViewModel> {
      let response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vShRwjPHvlfF_8R6YEjJ4LvbvJ8BOCn5r3HikzbXJhrJYklPAr19Ibbpmcb09wCg9Gr5_OhfX_F-1LS/pub?gid=0&single=true&output=tsv");
      return toViewModel(toCharacterStats(parseTsvData(await response.text())));
    }

    function selectChar(name: string) {
      console.log(`${name} is selected`)
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

          <mask id="mask">
            <polyline points="0,0 {viewModel.viewPortWidth},0 {viewModel.viewPortWidth},{viewModel.viewPortHeight*0.3} 0,{viewModel.viewPortHeight*0.8}" fill="white" />
          </mask>



        </defs>


        <text x="21%" y="18%" class="small" transform="rotate(-5)">
          <tspan>*Canadian Dollars, so </tspan>
          <tspan dy="4%" x="24%">US Dollars go further</tspan>
          <tspan dy="4%" x="27%"><a class="link-tree-link" href="https://linktr.ee/ebcart">LinkTree with tip jar here</a></tspan>
        </text>


        {#each viewModel.femaleCharacters as charViewModel}
          <rect x="{charViewModel.x}%" y="{charViewModel.y}%" width="{charViewModel.width}%" height="{charViewModel.height}%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="url(#{charViewModel.barGradient})" on:click={() => selectChar(charViewModel.name)} />
            <image
              xlink:href="{charViewModel.pictureLink}"
              x="{charViewModel.x}%"
              y="{charViewModel.y + charViewModel.height + 1}%"
              height="{charViewModel.picHeight}%"
              preserveAspectRatio="true"
            />
          <WeightLabel charViewModel="{charViewModel}" />
        {/each}
      </svg>

    {:catch error}
      <p>error: {error}</p>
    {/await}
  </main>

  <style>
    .chart {
      display: block;
    }

    .small {
      font-size: 1.8px;
      fill: black;
    }

    .link-tree-link {
      fill: blue;
      text-decoration: underline;
    }
  </style>
