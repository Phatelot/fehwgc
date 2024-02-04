export type RawDonation = {
    character: string;
    amount: number;
};

export type CharacterStats = {
    name: string;
    totalDonatedAmount: number;
    weight: number;
};

export type CharacterMetadata = {
    color: 'RED' | 'BLUE' | 'YELLOW' | 'GREY' | 'WHITE';
    baseWeight: number;
    heightInMeters: number;
    pictureLink: string;
};
