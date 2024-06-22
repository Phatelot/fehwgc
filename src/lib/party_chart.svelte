<script lang="ts">
    import { type ChartViewModel } from "./view_model";
    import WeightLabel from "./weight_label.svelte";

	export let viewModel: ChartViewModel;
</script>


  {#each viewModel.parties as partyViewModel}
	<rect x="{partyViewModel.x}%" y="{partyViewModel.y}%" width="{partyViewModel.width}%" height="{partyViewModel.height}%" rx="0.5px" ry="0.5px" stroke="white" stroke-width="0.4" stroke-linecap="round" fill="url(#{partyViewModel.barGradient})" />
	<image
	  xlink:href="{partyViewModel.pictureLink}"
	  x="{partyViewModel.x}%"
	  y="{partyViewModel.y + partyViewModel.height + 1}%"
	  height="{partyViewModel.picHeight}%"
	  preserveAspectRatio="true"
	/>
	<WeightLabel charViewModel="{partyViewModel}" small="{false}" />
  {/each}

<style>
  .not-so-small {
    font-size: 4px;
    fill: black;
  }

  .small {
    font-size: 1.8px;
    fill: black;
  }

  .very-small {
    font-size: 1.4px;
    fill: black;
  }

  .link-tree-link {
    fill: blue;
    text-decoration: underline;
  }
</style>
