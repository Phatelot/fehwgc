import type { CharacterMetadata } from './model';

import BenchidoriPic from '/src/assets/Benchidori.jpg';
import CithisPic from '/src/assets/Cithis.jpg';
import DayaPic from '/src/assets/Daya.jpg';
import Elven_QueenPic from '/src/assets/Elven_Queen.jpg';
import EriquePic from '/src/assets/Erique.jpg';
import FalinPic from '/src/assets/Falin.jpg';
import FlamelaPic from '/src/assets/Flamela.jpg';
import FlekiPic from '/src/assets/Fleki.jpg';
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
import UnnamedCanariesPic from '/src/assets/Unnamed_Canaries.jpg';

const characterMetadata : {[key: string]: CharacterMetadata} = {
    "Falin": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 152,
        party: 'LAIOS',
        pictureLink: FalinPic,
        species: ['TALLMAN'],
    },
    "Marcille": {
        heightInMeters: 1.6,
        gender: 'WOMAN',
        baseWeight: 112,
        party: 'LAIOS',
        pictureLink: MarcillePic,
        species: ['ELF', 'TALLMAN'],
    },
    "Laios": {
        heightInMeters: 1.85,
        gender: 'MAN',
        baseWeight: 196,
        party: 'LAIOS',
        species: ['TALLMAN'],
    },
    "Chillchuck": {
        heightInMeters: 1.1,
        gender: 'MAN',
        baseWeight: 48,
        party: 'LAIOS',
        species: ['HALFFOOT'],
    },
    "Namari": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 127,
        party: 'TANSUS',
        pictureLink: NamariPic,
        species: ['DWARF'],
    },
    "Kiki": {
        heightInMeters: 1.8,
        gender: 'WOMAN',
        baseWeight: 150,
        party: 'TANSUS',
        pictureLink: KikiPic,
        species: ['TALLMAN'],
    },
    "Kaka": {
        heightInMeters: 1.9,
        gender: 'MAN',
        baseWeight: 183,
        party: 'TANSUS',
        species: ['TALLMAN'],
    },
    "Benichidori": {
        heightInMeters: 1.6,
        gender: 'WOMAN',
        baseWeight: 112,
        party: 'SHUROS',
        pictureLink: BenchidoriPic,
        species: ['TALLMAN'],
    },
    "Maizuru": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 125,
        party: 'SHUROS',
        pictureLink: MaizuruPic,
        species: ['TALLMAN'],
    },
    "Hien": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 155,
        party: 'SHUROS',
        pictureLink: HienPic,
        species: ['TALLMAN'],
    },
    "Tade": {
        heightInMeters: 1.95,
        gender: 'WOMAN',
        baseWeight: 235,
        party: 'SHUROS',
        pictureLink: TadePic,
        species: ['OGRE'],
    },
    "Shuro": {
        heightInMeters: 1.8,
        gender: 'MAN',
        baseWeight: 165,
        party: 'SHUROS',
        species: ['TALLMAN'],
    },
    "Rin": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'KABRUS',
        pictureLink: RinPic,
        species: ['TALLMAN'],
    },
    "Daya": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 141,
        party: 'KABRUS',
        pictureLink: DayaPic,
        species: ['DWARF'],
    },
    "Kabru": {
        heightInMeters: 1.7,
        gender: 'MAN',
        baseWeight: 134,
        party: 'KABRUS',
        species: ['TALLMAN'],
    },
    "Kuro": {
        heightInMeters: 1.45,
        gender: 'MAN',
        baseWeight: 110,
        party: 'KABRUS',
        species: ['KOBOLD'],
    },
    "Holm": {
        heightInMeters: 1.4,
        gender: 'MAN',
        baseWeight: 90,
        party: 'KABRUS',
        species: ['GNOME'],
    },
    "Mickbell": {
        heightInMeters: 1.05,
        gender: 'MAN',
        baseWeight: 44,
        party: 'KABRUS',
        species: ['HALFFOOT'],
    },
    "Pattadol": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 111,
        party: 'MITHRUNS',
        pictureLink: PattadolPic,
        species: ['ELF'],
    },
    "Cithis": {
        heightInMeters: 1.65,
        gender: 'WOMAN',
        baseWeight: 119,
        party: 'MITHRUNS',
        pictureLink: CithisPic,
        species: ['ELF'],
    },
    "Fleki": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 66,
        party: 'MITHRUNS',
        pictureLink: FlekiPic,
        species: ['ELF'],
    },
    "Otta": {
        heightInMeters: 1.3,
        gender: 'WOMAN',
        baseWeight: 75,
        party: 'MITHRUNS',
        pictureLink: OttaPic,
        species: ['ELF'],
    },
    "Mithrun": {
        heightInMeters: 1.55,
        gender: 'MAN',
        baseWeight: 111,
        party: 'MITHRUNS',
        species: ['ELF'],
    },
    "Lycion": {
        heightInMeters: 1.7,
        gender: 'MAN',
        baseWeight: 154,
        party: 'MITHRUNS',
        species: ['ELF'],
    },
    "Flamela": {
        heightInMeters: 1.4,
        gender: 'WOMAN',
        baseWeight: 95,
        party: 'FLAMELAS',
        pictureLink: FlamelaPic,
        species: ['ELF'],
    },
    "Misyl": {
        heightInMeters: 1.45,
        gender: 'WOMAN',
        baseWeight: 93,
        party: 'FLAMELAS',
        pictureLink: MisylPic,
        species: ['ELF'],
    },
    "Erique": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'FLAMELAS',
        pictureLink: EriquePic,
        species: ['ELF'],
    },
    "Unnamed_Elves": {
        heightInMeters: 1.50,
        gender: 'WOMAN',
        baseWeight: 665,
        party: 'FLAMELAS',
        numbers: 7,
        pictureLink: UnnamedCanariesPic,
        species: ['ELF'],
    },
    "Queen": {
        heightInMeters: 1.7,
        gender: 'WOMAN',
        baseWeight: 115,
        party: 'ELVES',
        pictureLink: Elven_QueenPic,
        species: ['ELF'],
    },
    "Milsiril": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 104,
        party: 'ELVES',
        pictureLink: MilsirilPic,
        species: ['ELF'],
    },
    "Marcilles_Mom": {
        heightInMeters: 1.55,
        gender: 'WOMAN',
        baseWeight: 110,
        party: 'ELVES',
        pictureLink: MarcillesMomPic,
        species: ['ELF'],
    },
    "Attendants": {
        heightInMeters: 1.50,
        gender: 'WOMAN',
        baseWeight: 380,
        party: 'ELVES',
        numbers: 4,
        pictureLink: TheQueensAttendantsPic,
        species: ['ELF'],
    },
    "Leed": {
        heightInMeters: 1.5,
        gender: 'WOMAN',
        baseWeight: 203,
        party: 'DUNGEON',
        pictureLink: LeedPic,
        species: ['MONSTER'],
    },
    "Monster_Falin": {
        heightInMeters: 1, // ignore this
        gender: 'YES',
        baseWeight: 6080,
        party: 'DUNGEON',
        pictureLink: MonsterFalinPic,
        species: ['MONSTER'],
    },
    "Zon": {
        heightInMeters: 1.75,
        gender: 'MAN',
        baseWeight: 265,
        party: 'DUNGEON',
        species: [],
    },
    "Thistle": {
        heightInMeters: 1.3,
        gender: 'MAN',
        baseWeight: 63,
        party: 'DUNGEON',
        species: ['ELF'],
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
