import { toFrameType } from './frames';
import sampleAssetUrl from '/src/assets/characters/altena_body.webp'

function getAssetsBase(): string {
	return sampleAssetUrl.replace('/characters/altena_body.webp', '')
}

export function getBgPictureLink(gameSlug: string) : string {
	return getAssetsBase() + "/frame_bgs/" + gameSlug + ".png";
}

export function getFramePictureLink(outfitSlug: string) : string {
	return getAssetsBase() + "/frames/" + toFrameType(outfitSlug) + ".png";
}

export function getFrameMaskLink() : string {
	return getAssetsBase() + "/frames/mask.png";
}

export function getFacePicLink(characterSlug: string, outfitSlug: string) : string {
	const outfitSuffix = outfitSlug === "base" ? '' : '_' + outfitSlug;
	return getAssetsBase() + "/characters/" + characterSlug + outfitSuffix + "_face.webp";
}

export function getBgPicLink() : string {
	return getAssetsBase() + "/BG.webp";
}
