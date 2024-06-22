export type RawDonation = {
    character: string;
    amount: number;
};

export type CharacterStats = {
    name: string;
    totalDonatedAmount: number;
    weight: number;
    immobilityThreshold: number;
};

export type Party = 'DUNGEON' | 'FLAMELAS' | 'ADVENTURERS' | 'KABRUS' | 'LAIOS' | 'MITHRUNS' | 'SHUROS' | 'OTHERS';

export type CharacterMetadata = {
    party: Party;
    baseWeight: number;
    heightInMeters: number;
    species: ('TALLMAN' | 'OGRE' | 'DWARF' | 'MONSTER' | 'ELF' | 'HALFFOOT' | 'GNOME' | 'KOBOLD')[];
    numbers?: number; // null/0/1 if single character, else number of characters
    displayName?: string;
} & ({
    gender: 'MAN';
} | {
    gender: 'WOMAN';
    pictureLink: string;
} | {
    gender: 'YES';
    pictureLink: string;
});
