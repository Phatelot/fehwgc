export type RawDonation = {
    character: string;
    amount: number;
};

export type CharacterStats = {
    name: string;
    totalAmount: number;
};

export type CharacterMetadata = {
    color: 'RED' | 'BLUE' | 'YELLOW' | 'GREY' | 'WHITE';
    baseWeight: number;
    heightInMeters: number;
    pictureLink: string;
};
