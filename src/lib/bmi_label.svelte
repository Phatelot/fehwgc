<script lang="ts">
  import { formatBMI, formatWeight } from "./weight_utils";

	export let outfit: {
    x: number;
    y: number;
    width: number;
    BMI: number;
    height: number;
    pictureHeight: number;
  };

	$: formattedBMI = formatBMI(outfit.BMI);
</script>

<text x="{outfit.x + outfit.width / 4}%" y="{outfit.y + outfit.height}%" transform="translate(0, -1)">
  <tspan class="small">{formattedBMI}</tspan>
</text>


<style>

  .small {
    font-size: 1.9px;
    fill: black;
  }

</style>
