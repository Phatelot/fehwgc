<script lang="ts">
    // import Counter from './lib/Counter.svelte'
    import tel from './assets/tel.jpg'
    
  
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


          <pattern id="lowerBgPattern" viewBox="0,0,100,100" width="10%" height="{10 * viewModel.viewPortWidth / viewModel.viewPortHeight / 0.8}%">
            <rect width="100" height="100" class="lower-bg-base" />
            <polyline points="0,0 5,0 100,95 100,100 95,100 0,5" class="lower-bg-line" />
            <polyline points="100,0 100,5 5,100 0,100 0,95 95,0" class="lower-bg-line" />
          </pattern>
        </defs>



        <polyline points="0,{viewModel.viewPortHeight} 0,{viewModel.viewPortHeight*0.7} {viewModel.viewPortWidth},{viewModel.viewPortHeight*0.2} {viewModel.viewPortWidth},{viewModel.viewPortHeight}" fill="url(#lowerBgPattern)" />
  
  
        {#each viewModel.characters as charViewModel}
          <rect x="{charViewModel.x}%" y="{charViewModel.y}%" width="{charViewModel.width}%" height="{charViewModel.height}%" rx="1px" ry="1px" stroke="white" stroke-width="1" stroke-linecap="round" fill="url(#{charViewModel.barGradient})" on:click={() => selectChar(charViewModel.name)} />
            <image
            class="oooo"
            xlink:href="{charViewModel.pictureLink}"
            x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height - charViewModel.picHeight}%" height="{charViewModel.picHeight}%" preserveAspectRatio="true"
            />
          <text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" class="small" transform="translate(0, 8)">{charViewModel.name + " " + charViewModel.totalAmount}</text>
        {/each}
      </svg>
  
    {:catch error}
      <p>error: {error}</p>
    {/await}
  </main>
  
  <style>
  .chart {
    display: block;
    background-image: url("assets/map.jpeg");
    background-size: contain;
  }

          .small {
            font: 6px sans-serif;
            fill: black;
            stroke: white;
            stroke-width: 0.25;
          }

          .lower-bg-line {
            fill: #5d5c5a;
          }

          .lower-bg-base {
            fill: #696a65;
          }

  </style>
  