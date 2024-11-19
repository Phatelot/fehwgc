import { toFrameType } from './frames';

export function getBgPictureLink(gameSlug: string) : string {
	return normalize(import.meta.env.BASE_URL + "/frame_bgs/" + gameSlug + ".png");
}

export function getFramePictureLink(outfitSlug: string) : string {
	return normalize(import.meta.env.BASE_URL + "/frames/" + toFrameType(outfitSlug) + ".png");
}

export function getFacePicLink(characterSlug: string, outfitSlug: string) : string {
	const outfitSuffix = outfitSlug === "base" ? '' : '_' + outfitSlug;
	return normalize(import.meta.env.BASE_URL + "/characters/" + characterSlug + outfitSuffix + "_face.webp");
}

export function getBodyPicLink(characterSlug: string, outfitSlug: string) : string {
	const outfitSuffix = outfitSlug === "base" ? '' : '_' + outfitSlug;
	return normalize(import.meta.env.BASE_URL + "/characters/" + characterSlug + outfitSuffix + "_body.webp");
}

export function getTraitPicLink(trait: string) : string {
	return normalize(import.meta.env.BASE_URL + "/traits/" + trait + ".png");
}

function normalize(url: string): string {
	return url.replace('//', '/')
}
