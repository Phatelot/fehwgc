<script lang="ts">
    // import Counter from './lib/Counter.svelte'
    
    import arrosoir from './assets/arrosoir.png'
    import mapBg from './assets/map.jpeg'
  
    import { parseTsvData } from './lib/data_parser';
      import { toCharacterStats } from './lib/stats';
      import { type ViewModel, toViewModel } from './lib/view_model';
  
    async function fetchData(): Promise<ViewModel> {
      let response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQOpOuCk5XUTvH8hTd2dVSaZ9o_uSNgvB8mb8ythFFEtMz0ohnNmsC-Il3su8HqMdx9xz8L2ePt7qrZ/pub?gid=0&single=true&output=tsv");
      return toViewModel(toCharacterStats(parseTsvData(await response.text())));
    }
  
    function selectChar(name: string) {
      console.log(`${name} is selected`)
    }
  </script>
  
  <main>
    <!-- <div class="card">
      <Counter />
    </div> -->
  
    {#await fetchData()}
      <p>loading data...</p>
    {:then viewModel}
  
      <svg viewBox="0 0 {viewModel.viewPortWidth} {viewModel.viewPortHeight}" xmlns="http://www.w3.org/2000/svg" class="chart">
        <defs>
          <linearGradient id="whiteGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#303080" />
            <stop offset="100%" stop-color="#5050ff" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#6e1126" />
            <stop offset="100%" stop-color="#f32529" />
          </linearGradient>
          <linearGradient id="greyGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#362e46" />
            <stop offset="100%" stop-color="#594743" />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#af6f49" />
            <stop offset="100%" stop-color="#ffcf43" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#303080" />
            <stop offset="100%" stop-color="#5050ff" />
          </linearGradient>

          <mask id="mask">
            <polyline points="0,0 {viewModel.viewPortWidth},0 {viewModel.viewPortWidth},{viewModel.viewPortHeight*0.3} 0,{viewModel.viewPortHeight*0.8}" fill="white" />
          </mask>



        </defs>

        <image xlink:href="{mapBg}" width=100% mask="url(#mask)"/>


  
        <image xlink:href="{arrosoir}" width="15%" x="8%" y="10%" />

        <text x="21%" y="18%" class="small" transform="rotate(-5)">
          <tspan>*Canadian Dollars, so </tspan>
          <tspan dy="4%" x="24%">US Dollars go further</tspan>
          <tspan dy="4%" x="27%"><a class="link-tree-link" href="https://linktr.ee/ebcart">LinkTree with tip jar here</a></tspan>
        </text>

  
        {#each viewModel.characters as charViewModel}
          <rect x="{charViewModel.x}%" y="{charViewModel.y}%" width="{charViewModel.width}%" height="{charViewModel.height}%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="url(#{charViewModel.barGradient})" on:click={() => selectChar(charViewModel.name)} />
            <image
              xlink:href="{charViewModel.pictureLink}"
              x="{charViewModel.x}%"
              y="{charViewModel.y + charViewModel.height - charViewModel.picHeight}%"
              height="{charViewModel.picHeight}%"
              preserveAspectRatio="true"
            />
          <text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" class="small" transform="translate(0, 4)">{charViewModel.weight}lbs</text>
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
      font: 3px sans-serif;
      font-weight: 600;
      fill: black;
      stroke: white;
      stroke-width: 0.15;
    }

    .link-tree-link {
      fill: blue;
      text-decoration: underline;
    }
  </style>
  