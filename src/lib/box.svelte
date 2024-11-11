<script lang="ts">
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
</script>

<svg shape-rendering="crispEdges">
	<defs>
	  <linearGradient id="box-mask-gradient" x1="0" x2="1" y1="0" y2="0">
		<stop offset="0%" stop-color="#000000"></stop>
		<stop offset="15%" stop-color="#ffffff"></stop>
		<stop offset="85%" stop-color="#ffffff"></stop>
		<stop offset="100%" stop-color="#000000"></stop>
	  </linearGradient>
	  <mask id="box-mask" x="{x}%" y="{y}%" width="{width}%" height="{height}%" maskUnits="userSpaceOnUse">
		<rect x="{x}%" y="{y}%" width="{width}%" height="{height}%" fill="url(#box-mask-gradient)" />
	  </mask>
	  <linearGradient id="box-border-mask-gradient" x1="0" x2="1" y1="0" y2="0">
		<stop offset="0%" stop-color="#000000"></stop>
		<stop offset="10%" stop-color="#ffffff"></stop>
		<stop offset="90%" stop-color="#ffffff"></stop>
		<stop offset="100%" stop-color="#000000"></stop>
	  </linearGradient>
	  <mask id="box-border-mask" x="{x}%" y="0%" width="{width}%" height="100%" maskUnits="userSpaceOnUse">
		<rect x="{x}%" y="0%" width="{width}%" height="100%" fill="url(#box-border-mask-gradient)" />
	  </mask>
	  <radialGradient id="box-top-color-gradient" cx="0.5" cy="0" r="20%">
		<stop offset="0%" stop-color="#427276" />
		<stop offset="100%" stop-color="#03242d" />
	  </radialGradient>
	  <radialGradient id="box-bottom-color-gradient" cx="0.5" cy="1" r="20%">
		<stop offset="0%" stop-color="#427276" />
		<stop offset="100%" stop-color="#03242d" />
	  </radialGradient>
	  <linearGradient id="box-border-color-gradient" x1="0" x2="1" y1="0" y2="0">
		<stop offset="0%" stop-color="#004858"></stop>
		<stop offset="50%" stop-color="#aeffff"></stop>
		<stop offset="100%" stop-color="#004858"></stop>
	  </linearGradient>

	</defs>

	<rect x="{x}%" y="{y-height/60}" width="{width}%" height="{height/60}%" fill="url(#box-border-color-gradient)" mask="url(#box-border-mask)" />
	<rect x="{x}%" y="{y}%" width="{width}%" height="{height/2}%" fill="url(#box-top-color-gradient)" mask="url(#box-mask)" />
	<rect x="{x}%" y="{y+height/2}%" width="{width}%" height="{height/2}%" fill="url(#box-bottom-color-gradient)" mask="url(#box-mask)" />
	<rect x="{x}%" y="{y+height}" width="{width}%" height="{height/60}%" fill="url(#box-border-color-gradient)" mask="url(#box-border-mask)" />
  </svg>
