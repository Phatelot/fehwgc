<script lang="ts">
    // import Counter from './lib/Counter.svelte'
    import tel from './assets/tel.jpg'
  
    import { parseTsvData } from './lib/data_parser';
      import { toCharacterStats } from './lib/stats';
      import { toViewModel } from './lib/view_model';
      import type { CharacterViewModel } from './lib/model';
  
    async function fetchData(): Promise<CharacterViewModel[]> {
      let response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTfCcbVwXZICCxJc1yfTggCBv21-9IYvcIo-VmufIb-M72y0i8SVamzcNNg0IowgixSvvIJc38gkeZ4/pub?gid=1546497897&single=true&output=tsv");
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
    {:then viewModels}
  
      <svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" class="chart">
        <defs>
          <linearGradient id="blueGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#303080" />
            <stop offset="100%" stop-color="#5050ff" />
          </linearGradient>
        </defs>

        <image
        class="oooo"
    xlink:href="{tel}"
    x="0"
    y="0"
/>
  
  
        {#each viewModels as viewModel}
          <rect x="{viewModel.x}%" y="{viewModel.y}%" width="{viewModel.width}%" height="{viewModel.height}%" rx="1px" ry="1px" stroke="white" stroke-width="1" stroke-linecap="round" fill="url(#blueGradient)" on:click={() => selectChar(viewModel.name)} />
          <text x="{viewModel.x}%" y="{viewModel.y + viewModel.height}%" class="small">{viewModel.name + " " + viewModel.totalAmount}</text>
        {/each}
      </svg>
  
    {:catch error}
      <p>error: {error}</p>
    {/await}
  </main>
  
  <style>
  .chart {
    display: block;
    /* max-width: 480px;
    max-height: 160px; */
  
    /* width: 480px;
    height: 160px; */
  }
  

  .oooo {
    height: 142px;
    width: 142px;
  }
  
          .small {
            font: italic 8px sans-serif;
            fill: red;
          }
  </style>
  