<script lang="ts">
    import Box from './box.svelte';
	import traitsLink from '/src/assets/traits_rules.webp';
</script>

<Box x={2} y={5} width={96} height={90}></Box>

<image
	xlink:href="{traitsLink}"
	x="12%"
	y="4%"
	height="92%"
/>
