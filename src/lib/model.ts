export type RawDonation = {
    character: string;
    amount: number;
};

export type CharacterStats = {
    name: string;
    totalAmount: number;
};

export type CharacterViewModel = CharacterStats & {
    x: number;
    y: number;
    width: number;
    height: number;
};
