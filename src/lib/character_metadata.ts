import type { CharacterMetadata, Party } from './model';

import BenchidoriPic from '/src/assets/Benchidori.jpg';
import ChillchucksWifePic from '/src/assets/Chillchucks_Wife.jpg';
import CithisPic from '/src/assets/Cithis.jpg';
import DayaPic from '/src/assets/Daya.jpg';
import DungeonDwellersPic from '/src/assets/Dungeon_Dwellers.jpg';
import Elven_QueenPic from '/src/assets/Elven_Queen.jpg';
import EriquePic from '/src/assets/Erique.jpg';
import FalinPic from '/src/assets/Falin.jpg';
import FlamelaPic from '/src/assets/Flamela.jpg';
import FlekiPic from '/src/assets/Fleki.jpg';
import GoldenKingdomPic from '/src/assets/Golden_Kingdom.jpg';
import HienPic from '/src/assets/Hien.jpg';
import KikiPic from '/src/assets/Kiki.jpg';
import LeedPic from '/src/assets/Leed.jpg';
import MaizuruPic from '/src/assets/Maizuru.jpg';
import MarcillePic from '/src/assets/Marcille.jpg';
import MarcillesMomPic from '/src/assets/Marcilles_Mom.jpg';
import MilsirilPic from '/src/assets/Milsiril.jpg';
import MisylPic from '/src/assets/Misyl.jpg';
import MonsterFalinPic from '/src/assets/Monster_Falin.jpg';
import NamariPic from '/src/assets/Namari.jpg';
import OttaPic from '/src/assets/Otta.jpg';
import PattadolPic from '/src/assets/Pattadol.jpg';
import RinPic from '/src/assets/Rin.jpg';
import TadePic from '/src/assets/Tade.jpg';
import TheQueensAttendantsPic from '/src/assets/The_Queens_Attendants.jpg';
import UnnamedAdventurersPic from '/src/assets/Unnamed_Adventurers.jpg';
import UnnamedCanariesPic from '/src/assets/Unnamed_Canaries.jpg';

const characterMetadata : {[key: string]: CharacterMetadata} = {
    "Falin": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 152,
        party: 'LAIOS',
        pictureLink: FalinPic,
        species: ['TALLMAN'],
        immobilityBMI: 130,
    },
    "Marcille": {
        heightInMeters: 1.6,
        gender: 'WOMAN',
        baseWeight: 112,
        party: 'LAIOS',
        pictureLink: MarcillePic,
        species: ['ELF', 'TALLMAN'],
        immobilityBMI: 120,
    },
    "Laios": {
        heightInMeters: 1.85,
        gender: 'MAN',
        baseWeight: 196,
        party: 'LAIOS',
        species: ['TALLMAN'],
        immobilityBMI: 200,
    },
    "Chillchuck": {
        heightInMeters: 1.1,
        gender: 'MAN',
        baseWeight: 48,
        party: 'LAIOS',
        species: ['HALFFOOT'],
        displayName: 'Chilchuck',
        immobilityBMI: 110,
    },
    "Namari": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 127,
        party: 'ADVENTURERS',
        pictureLink: NamariPic,
        species: ['DWARF'],
        immobilityBMI: 210,
    },
    "Kiki": {
        heightInMeters: 1.8,
        gender: 'WOMAN',
        baseWeight: 150,
        party: 'ADVENTURERS',
        pictureLink: KikiPic,
        species: ['TALLMAN'],
        immobilityBMI: 200,
    },
    "Kaka": {
        heightInMeters: 1.9,
        gender: 'MAN',
        baseWeight: 183,
        party: 'ADVENTURERS',
        species: ['TALLMAN'],
        immobilityBMI: 210,
    },
    "Benichidori": {
        heightInMeters: 1.6,
        gender: 'WOMAN',
        baseWeight: 112,
        party: 'SHUROS',
        pictureLink: BenchidoriPic,
        species: ['TALLMAN'],
        immobilityBMI: 140,
    },
    "Maizuru": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 125,
        party: 'SHUROS',
        pictureLink: MaizuruPic,
        species: ['TALLMAN'],
        immobilityBMI: 120,
    },
    "Hien": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 155,
        party: 'SHUROS',
        pictureLink: HienPic,
        species: ['TALLMAN'],
        immobilityBMI: 180,
    },
    "Tade": {
        heightInMeters: 1.95,
        gender: 'WOMAN',
        baseWeight: 235,
        party: 'SHUROS',
        pictureLink: TadePic,
        species: ['OGRE'],
        immobilityBMI: 210,
    },
    "Shuro": {
        heightInMeters: 1.8,
        gender: 'MAN',
        baseWeight: 165,
        party: 'SHUROS',
        species: ['TALLMAN'],
        immobilityBMI: 210,
    },
    "Rin": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'KABRUS',
        pictureLink: RinPic,
        species: ['TALLMAN'],
        immobilityBMI: 120,
    },
    "Daya": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 141,
        party: 'KABRUS',
        pictureLink: DayaPic,
        species: ['DWARF'],
        immobilityBMI: 190,
    },
    "Kabru": {
        heightInMeters: 1.7,
        gender: 'MAN',
        baseWeight: 134,
        party: 'KABRUS',
        species: ['TALLMAN'],
        immobilityBMI: 190,
    },
    "Kuro": {
        heightInMeters: 1.45,
        gender: 'MAN',
        baseWeight: 110,
        party: 'KABRUS',
        species: ['KOBOLD'],
        immobilityBMI: 120,
    },
    "Holm": {
        heightInMeters: 1.4,
        gender: 'MAN',
        baseWeight: 90,
        party: 'KABRUS',
        species: ['GNOME'],
        immobilityBMI: 120,
    },
    "Mickbell": {
        heightInMeters: 1.05,
        gender: 'MAN',
        baseWeight: 44,
        party: 'KABRUS',
        species: ['HALFFOOT'],
        immobilityBMI: 110,
    },
    "Pattadol": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 111,
        party: 'MITHRUNS',
        pictureLink: PattadolPic,
        species: ['ELF'],
        immobilityBMI: 120,
    },
    "Cithis": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 119,
        party: 'MITHRUNS',
        pictureLink: CithisPic,
        species: ['ELF'],
        immobilityBMI: 120,
    },
    "Fleki": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 66,
        party: 'MITHRUNS',
        pictureLink: FlekiPic,
        species: ['ELF'],
        immobilityBMI: 110,
    },
    "Otta": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 75,
        party: 'MITHRUNS',
        pictureLink: OttaPic,
        species: ['ELF'],
        immobilityBMI: 110,
    },
    "Mithrun": {
        heightInMeters: 1.55,
        gender: 'MAN',
        baseWeight: 111,
        party: 'MITHRUNS',
        species: ['ELF'],
        immobilityBMI: 120,
    },
    "Lycion": {
        heightInMeters: 1.7,
        gender: 'MAN',
        baseWeight: 154,
        party: 'MITHRUNS',
        species: ['ELF'],
        immobilityBMI: 140,
    },
    "Flamela": {
        heightInMeters: 1.4,
        gender: 'WOMAN',
        baseWeight: 95,
        party: 'FLAMELAS',
        pictureLink: FlamelaPic,
        species: ['ELF'],
        immobilityBMI: 120,
    },
    "Misyl": {
        heightInMeters: 1.45,
        gender: 'WOMAN',
        baseWeight: 93,
        party: 'FLAMELAS',
        pictureLink: MisylPic,
        species: ['ELF'],
        immobilityBMI: 130,
    },
    "Erique": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'FLAMELAS',
        pictureLink: EriquePic,
        species: ['ELF'],
        immobilityBMI: 120,
    },
    "Unnamed_Elves": {
        heightInMeters: 1.50,
        gender: 'WOMAN',
        baseWeight: 665,
        party: 'FLAMELAS',
        numbers: 7,
        pictureLink: UnnamedCanariesPic,
        species: ['ELF'],
        displayName: 'Unnamed canaries',
        immobilityBMI: 120,
    },
    "Queen": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 115,
        party: 'OTHERS',
        pictureLink: Elven_QueenPic,
        species: ['ELF'],
        displayName: 'The Elven Queen',
        immobilityBMI: 140,
    },
    "Milsiril": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 104,
        party: 'OTHERS',
        pictureLink: MilsirilPic,
        species: ['ELF'],
        immobilityBMI: 140,
    },
    "Marcilles_Mom": {
        heightInMeters: 1.55,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'OTHERS',
        pictureLink: MarcillesMomPic,
        species: ['ELF'],
        displayName: 'Marcille\'s Mom',
        immobilityBMI: 120,
    },
    "Attendants": {
        heightInMeters: 1.50,
        gender: 'WOMAN',
        baseWeight: 380,
        party: 'OTHERS',
        numbers: 4,
        pictureLink: TheQueensAttendantsPic,
        species: ['ELF'],
        displayName: 'Queen\'s Attendants',
        immobilityBMI: 130,
    },
    "Leed": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 203,
        party: 'DUNGEON',
        pictureLink: LeedPic,
        species: ['MONSTER'],
        immobilityBMI: 215,
    },
    "Monster_Falin": {
        heightInMeters: 1.7,
        gender: 'YES',
        baseWeight: 6080,
        party: 'DUNGEON',
        pictureLink: MonsterFalinPic,
        species: ['MONSTER'],
        displayName: 'Monster Falin',
        immobilityBMI: 220,
    },
    "Zon": {
        heightInMeters: 1.75,
        gender: 'MAN',
        baseWeight: 265,
        party: 'DUNGEON',
        species: ['MONSTER'],
        immobilityBMI: 225,
    },
    "Thistle": {
        heightInMeters: 1.3,
        gender: 'MAN',
        baseWeight: 63,
        party: 'DUNGEON',
        species: ['ELF'],
        immobilityBMI: 110,
    },
    "Chillchuck_wife": {
        heightInMeters: 1.00,
        baseWeight: 42,
        displayName: 'Chilchuck\'s wife',
        gender: 'WOMAN',
        party: 'OTHERS',
        pictureLink: ChillchucksWifePic,
        species: ['HALFFOOT'],
        immobilityBMI: 100,
    },
    "Dungeon_dwellers": {
        heightInMeters: 1.55,
        baseWeight: 555,
        numbers: 5,
        gender: 'WOMAN',
        party: 'OTHERS',
        pictureLink: DungeonDwellersPic,
        species: ['TALLMAN'],
        immobilityBMI: 130,
        displayName: 'Dungeon Dwellers',
    },
    "Golden_kingdom": {
        heightInMeters: 1.50,
        baseWeight: 475,
        numbers: 5,
        gender: 'WOMAN',
        party: 'DUNGEON',
        pictureLink: GoldenKingdomPic,
        species: ['TALLMAN'],
        immobilityBMI: 120,
        displayName: 'the Golden Kingdom'
    },
    "Unnamed_adventurers": {
        heightInMeters: 1.65,
        baseWeight: 650,
        numbers: 5,
        gender: 'WOMAN',
        party: 'ADVENTURERS',
        pictureLink: UnnamedAdventurersPic,
        species: ['TALLMAN'],
        immobilityBMI: 150,
        displayName: 'the unnamed adventurers',
    },
};

export function getCharacterMetadata(characterName: string) : CharacterMetadata {
    return characterMetadata[characterName]
}

export function getCharacters(): string[] {
    return Object.keys(characterMetadata);
}

export function getFemaleCharactersNumber(): number {
    return Object.values(characterMetadata)
        .filter(c => c.gender === 'WOMAN')
        .length;
}

export function getParty(characterName: string) : Party {
    return characterMetadata[characterName].party;
}

export function getPartySize(party: Party) : number {
    return Object.values(characterMetadata)
        .filter(c => c.party === party)
        .length; // poly characters still count as 1 for bonus weight repartition
}

export function getPartyMembersNames(characterName : string) : string[] {
    const party = getParty(characterName);
    return Object.keys(characterMetadata).filter(c => characterMetadata[c].party === party);
}
