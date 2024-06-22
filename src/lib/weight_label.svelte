<script lang="ts">
  import type { CharacterViewModel } from "./view_model";
  import { formatWeight } from "./weight_utils";

	export let charViewModel: {
    x: number;
    y: number;
    weight: number;
    height: number;
  };
  export let small: boolean;

	$: formattedWeight = formatWeight(charViewModel.weight);
</script>

{#if small}
  <text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" transform="translate(0, 10)">
    <tspan class="{ formattedWeight.length > 3 ? 'very-small' : 'small'}">{formattedWeight}</tspan><tspan class="very-small">lbs</tspan>
  </text>
{:else}
  <text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" transform="translate(3, 25)">
    <tspan class="{ formattedWeight.length > 3 ? 'not-so-big' : 'big'}">{formattedWeight}</tspan><tspan class="not-so-big">lbs</tspan>
  </text>
{/if}

<style>
  .big {
    font-size: 4px;
    fill: black;
  }

	.not-so-big {
    font-size: 3px;
    fill: black;
  }

  .small {
    font-size: 1.9px;
    fill: black;
  }

	.very-small {
    font-size: 1.4px;
    fill: black;
  }
</style>
