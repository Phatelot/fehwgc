<script lang="ts">
    import type { CharacterViewModel } from "./view_model";
    import { formatWeight } from "./weight_utils";

	export let charViewModel: CharacterViewModel;

	$: formattedWeight = formatWeight(charViewModel.weight);
</script>

<text x="{charViewModel.x}%" y="{charViewModel.y + charViewModel.height}%" transform="translate(0, 10)">
	<tspan class="{ formattedWeight.length > 3 ? 'very-small' : 'small'}">{formattedWeight}</tspan><tspan class="very-small">lbs</tspan>
</text>

<style>
  .small {
    font-size: 1.9px;
    fill: black;
  }

	.very-small {
    font-size: 1.4px;
    fill: black;
  }
</style>
