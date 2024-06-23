<script lang="ts">
    import { generateSentencesForGlobal } from "./sentence_generator";
    import { type ChartViewModel } from "./view_model";

	export let viewModel: ChartViewModel;

	let sentences = generateSentencesForGlobal(viewModel);
</script>

<text x="6%" y="18%" class="not-so-small">
	{#each sentences as sentence}
		<tspan x="4.5%" dy="5%" class="not-so-small">{sentence}</tspan>
	{/each}
</text>

<style>
  .not-so-small {
    font-size: 4px;
    fill: black;
  }
</style>
