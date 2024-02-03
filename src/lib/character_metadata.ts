import shamirPic from '/src/assets/Shamir.webp';
import edelgardPic from '/src/assets/Edelgard.webp';
import kronyaPic from '/src/assets/Kronya_Portrait.webp';
import hildaPic from '/src/assets/Hilda_Portrait.webp';
import annettePic from '/src/assets/annette.png';
import type { CharacterMetadata } from './model';

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
};

export function getCharacterMetadata(characterName: string) : CharacterMetadata {
    return characterMetadata[characterName]
}