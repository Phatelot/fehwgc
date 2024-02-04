import type { CharacterMetadata } from './model';

import annettePic from '/src/assets/annette.png';
import bylethPic from '/src/assets/Byleth-F.webp';
import catherinePic from '/src/assets/Catherine_Portrait.webp';
import constancePic from '/src/assets/Constance_Portrait.webp';
import dorotheaPic from '/src/assets/Dorothea_Portrait.webp';
import edelgardPic from '/src/assets/Edelgard.webp';
import hapiPic from '/src/assets/Hapi_Portrait.webp';
import hildaPic from '/src/assets/Hilda_Portrait.webp';
import ingridPic from '/src/assets/Ingrid_Portrait.webp';
import kronyaPic from '/src/assets/Kronya_Portrait.webp';
import leoniePic from '/src/assets/Leonie_Portrait.webp';
import lysitheaPic from '/src/assets/Lysithea_Portrait.webp';
import mariannePic from '/src/assets/Marianne_Portrait.webp';
import petraPic from '/src/assets/Petra_Portrait.webp';
import shamirPic from '/src/assets/Shamir.webp';

const characterMetadata : {[key: string]: CharacterMetadata} = {
    "Shamir": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: shamirPic,
        color: 'WHITE',
    },
    "Edelgard": {
        heightInMeters: 1.60,
        baseWeight: 120,
        pictureLink: edelgardPic,
        color: 'RED',
    },
    "Kronya": {
        heightInMeters: 1.60,
        baseWeight: 120,
        pictureLink: kronyaPic,
        color: 'GREY',
    },
    "Hilda": {
        heightInMeters: 1.60,
        baseWeight: 120,
        pictureLink: hildaPic,
        color: 'YELLOW',
    },
    "Annette": {
        heightInMeters: 1.60,
        baseWeight: 120,
        pictureLink: annettePic,
        color: 'BLUE',
    },
    "Byleth": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: bylethPic,
        color: 'GREY',
    },
    "Catherine": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: catherinePic,
        color: 'WHITE',
    },
    "Constance": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: constancePic,
        color: 'GREY',
    },
    "Dorothea": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: dorotheaPic,
        color: 'RED',
    },
    "Hapi": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: hapiPic,
        color: 'GREY',
    },
    "Ingrid": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: ingridPic,
        color: 'BLUE',
    },
    "Leonie": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: leoniePic,
        color: 'YELLOW',
    },
    "Lysithea": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: lysitheaPic,
        color: 'YELLOW',
    },
    "Marianne": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: mariannePic,
        color: 'YELLOW',
    },
    "Petra": {
        heightInMeters: 1.65,
        baseWeight: 120,
        pictureLink: petraPic,
        color: 'RED',
    },
};

export function getCharacterMetadata(characterName: string) : CharacterMetadata {
    return characterMetadata[characterName]
}

export function getCharacters(): string[] {
    return Object.keys(characterMetadata);
}