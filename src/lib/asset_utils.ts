import { toFrameType } from './frames';

const characters = import.meta.glob('/src/assets/characters/*.webp', { eager: true });
const charactersUrls = Object.keys(characters).map(path => new URL(path, import.meta.url).href);

const frameBgs = import.meta.glob('/src/assets/frame_bgs/*.png', { eager: true });
const frameBgsUrls = Object.keys(frameBgs).map(path => new URL(path, import.meta.url).href);

const frames = import.meta.glob('/src/assets/frames/*.png', { eager: true });
const framesUrls = Object.keys(frames).map(path => new URL(path, import.meta.url).href);

export function getBgPictureLink(gameSlug: string) : string {
	return frameBgsUrls.find(url => url.includes(gameSlug + ".png")) || 'URL NOT FOUND IN META IMPORT GLOB';
}

export function getFramePictureLink(outfitSlug: string) : string {
	return framesUrls.find(url => url.includes(toFrameType(outfitSlug) + ".png")) || 'URL NOT FOUND IN META IMPORT GLOB';
}

export function getFacePicLink(characterSlug: string, outfitSlug: string) : string {
	const outfitSuffix = outfitSlug === "base" ? '' : '_' + outfitSlug;
	return charactersUrls.find(url => url.includes(characterSlug + outfitSuffix + "_face.webp")) || 'URL NOT FOUND IN META IMPORT GLOB';
}
