<script lang="ts">
    import { getTraitPicLink } from './asset_utils';
	import frameMaskLink from '/src/assets/mask.png'

	export let model: {
		bgPictureLink: string;
		pictureLink: string;
		framePictureLink: string;
		x: number;
		y: number;
		height: number;
		pictureHeight: number;
		width: number;
		id: string;
		trait?: string;
		grey?: boolean;
	}

</script>

	<image
	  xlink:href="{model.bgPictureLink}"
	  x="{model.x}%"
	  y="{model.y + model.height + 6}%"
	  height="{model.pictureHeight}%"
	/>
	<defs>
		<mask id="{'image-mask-' + model.id}" x="0%" y="0%" width="100%" height="100%" maskUnits="userSpaceOnUse">
		  <image xlink:href="{frameMaskLink}" width="{model.width}%" height="{model.pictureHeight}%" x="{model.x}%" y="{model.y + model.height + 6}%"/>
		</mask>
	</defs>

	<image
	  mask="url(#{'image-mask-' + model.id})"
	  xlink:href="{model.pictureLink}"
	  x="{model.x}%"
	  y="{model.y + model.height + 6}%"
	  height="{model.pictureHeight}%"
	  style="{model.grey ? 'filter: grayscale(1);' : ''}"
	  on:click
	/>
	<image
	  xlink:href="{model.framePictureLink}"
	  x="{model.x}%"
	  y="{model.y + model.height + 6}%"
	  height="{model.pictureHeight}%"
	  style="{model.grey ? 'filter: grayscale(1);' : ''}"
	  on:click
    />

{#if model.trait}
	<image
	  xlink:href="{getTraitPicLink(model.trait)}"
	  x="{model.x - 1.3}%"
	  y="{5.5 + model.y + model.height + 8}%"
	  height="7%"
	  on:click
	/>
{/if}
