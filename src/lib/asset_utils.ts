import { toFrameType } from './frames';

const characters = import.meta.glob('/src/assets/characters/*.webp', { eager: true });

const frameBgs = import.meta.glob('/src/assets/frame_bgs/*.png', { eager: true });

const frames = import.meta.glob('/src/assets/frames/*.png', { eager: true });

export function getBgPictureLink(gameSlug: string) : string {
	return import.meta.env.BASE_URL + "frame_bgs/" + gameSlug + ".png";
}

export function getFramePictureLink(outfitSlug: string) : string {
	return import.meta.env.BASE_URL + "frames/" + toFrameType(outfitSlug) + ".png";
}

export function getFacePicLink(characterSlug: string, outfitSlug: string) : string {
	const outfitSuffix = outfitSlug === "base" ? '' : '_' + outfitSlug;
	return import.meta.env.BASE_URL + "characters/" + characterSlug + outfitSuffix + "_face.webp";
}
