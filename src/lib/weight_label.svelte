<script lang="ts">
  import { formatWeight } from "./weight_utils";

	export let outfit: {
    x: number;
    y: number;
    width: number;
    weightInLbs: number;
    height: number;
    pictureHeight: number;
  };
  export let small: boolean;

	$: formattedWeight = formatWeight(outfit.weightInLbs);
</script>

{#if small}
  <text x="{outfit.x + outfit.width / 4}%" y="{outfit.y + outfit.height}%" transform="translate(0, -1)">
    <tspan class="{ formattedWeight.length > 3 ? 'very-small' : 'small'}">{formattedWeight}</tspan><tspan class="very-small">lbs</tspan>
  </text>
{:else}
  <text x="{outfit.x}%" y="{outfit.y + outfit.height}%" transform="translate(3, 25)">
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
