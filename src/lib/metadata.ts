export type Shape = '💎' | '🍎' | '⌛' | '🟣' | '🍐';

export type Build = 'Petite' | 'Regular' | 'Strong' | 'Giant';

export function initialWeightForBuild(b: Build): number {
    return {
        'Petite': 100,
        'Regular': 120,
        'Strong': 160,
        'Giant': 300,
    }[b];
}

export type OutfitBaseMetadata = {
    outfitWeightThresholdInLb: number;
    mainShape: Shape;
    secondaryShape?: Shape;
    outfit: string;
    outfitSlug: string;
};

export type CharacterGroup = {
    name: string;
    slug: string;
}

export type CharacterBaseMetadata = {
    name: string;
    nameSlug: string;
    heightInCm: number;
    build: Build;
    initialRoaster?: boolean;
    group?: CharacterGroup;

    outfits: OutfitBaseMetadata[];
};

type GameMetadataPrecursor = {
    name: string;
    nameSlug: string;
    darkColor: string;
    lightColor: string;
}

export type GameBaseMetadata = {
    characters: CharacterBaseMetadata[];
} & GameMetadataPrecursor;

export function getOutfitMetadata(characterNameSlug: string, outfitSlug: string): OutfitBaseMetadata | undefined {
    for (const outfit of (getCharacterMetadata(characterNameSlug)?.outfits) || []) {
        if (outfit.outfitSlug === outfitSlug) {
            return outfit
        }
    }
    return undefined
}

export function getCharacterMetadata(characterNameSlug: string): CharacterBaseMetadata | undefined {
    for (const game of baseMetadata) {
        for (const character of game.characters) {
            if (character.nameSlug === characterNameSlug) {
                return character
            }
        }
    }
    return undefined
}

export function getCharacterDisplayName(characterNameSlug: string): string {
    return getCharacterMetadata(characterNameSlug)?.name ||  characterNameSlug;
}

export function getCharacterOutfitDisplayName(characterNameSlug: string, outfitSlug?: string): string {
    if (outfitSlug === 'broken') {
        return 'Broken'
    } else if (!outfitSlug) {
        return 'Base'
    }
    for (const game of baseMetadata) {
        for (const character of game.characters) {
            if (character.nameSlug === characterNameSlug) {
                for (const outfit of character.outfits) {
                    if (outfit.outfitSlug === outfitSlug) {
                        return outfit.outfit as string
                    }
                }
            }
        }
    }
    return outfitSlug;
}

const awakeningGamePrecursor = {
    name: "Awakening",
    nameSlug: "awakening",
    darkColor: '#3f5471',
    lightColor: '#c7d5c6',
}
const awakeningMainCastGroup = {
    name: 'Main Cast',
    slug: 'main_cast',
}
const awakeningSecondaryCastGroup = {
    name: 'Secondary cast',
    slug: 'secondary_cast',
}
const bindingBladeGamePrecursor = {
    name: "Binding Blade",
    nameSlug: "binding_blade",
    darkColor: '#49607c',
    lightColor: '#e7e2ce',
}
const blazingSwordGamePrecursor = {
    name: "Blazing Sword",
    nameSlug: "blazing_sword",
    darkColor: '#5e9a3a',
    lightColor: '#fef76f',
}
const echoesGamePrecursor = {
    name: "Echoes",
    nameSlug: "echoes",
    darkColor: '#3a9073',
    lightColor: '#b9f3c8',
}
const engageGamePrecursor = {
    name: "Engage",
    nameSlug: "engage",
    darkColor: '#5937c7',
    lightColor: '#fe8aff',
}
const fatesGamePrecursor = {
    name: "Fates",
    nameSlug: "fates",
    darkColor: '#895ea9',
    lightColor: '#ffe2eb',
}
const fatesBirthrightGroup = {
    name: 'Birthright',
    slug: 'birthright',
}
const fatesConquestGroup = {
    name: 'Conquest',
    slug: 'conquest',
}
const fatesRevelationsGroup = {
    name: 'Revelations',
    slug: 'revelations',
}
const heroesGamePrecursor = {
    name: "Heroes",
    nameSlug: "heroes",
    darkColor: '#1e7fc7',
    lightColor: '#5deeff',
}
const heroesBook13Group = {
    name: 'Books 1-3',
    slug: 'books1_3',
}
const heroesBook45Group = {
    name: 'Books 4-5',
    slug: 'books4_5',
}
const heroesBook68Group = {
    name: 'Books 6-8',
    slug: 'books6_8',
}
const holyWarGamePrecursor = {
    name: "Holy War",
    nameSlug: "holy_war",
    darkColor: '#9f7530',
    lightColor: '#ffea5b',
}
const mirageGamePrecursor = {
    name: "Mirage",
    nameSlug: "mirage",
    darkColor: '#181827',
    lightColor: '#4c3c4b',
}
const telliusGamePrecursor = {
    name: "Tellius",
    nameSlug: "tellius",
    darkColor: '#2e4cc7',
    lightColor: '#91bfff',
}
const telliusPathOfRadianceGroup = {
    name: 'Path of Radiance',
    slug: 'path_of_radiance',
}
const telliusRadiantDawnGroup = {
    name: 'Radiant Dawn',
    slug: 'radiant_dawn',
}
const sacredStonesGamePrecursor = {
    name: "Sacred Stones",
    nameSlug: "sacred_stones",
    darkColor: '#2daca6',
    lightColor: '#8dfde9',
}
const shadowDragonGamePrecursor = {
    name: "Shadow Dragon",
    nameSlug: "shadow_dragon",
    darkColor: '#4d497a',
    lightColor: '#f3b8cc',
}
const thraciaGamePrecursor = {
    name: "Thracia",
    nameSlug: "thracia",
    darkColor: '#7e2235',
    lightColor: '#fe5664',
}
const threeHousesGamePrecursor = {
    name: "Three Houses",
    nameSlug: "three_houses",
    darkColor: '#9f9b91',
    lightColor: '#fff7db',
}
const threeHousesStudentsGroup = {
    name: 'Students',
    slug: 'students',
}
const threeHousesProfessionalsGroup = {
    name: 'Professionals',
    slug: 'professionals',
}

export const baseMetadata: GameBaseMetadata[] = [
    {
        ...awakeningGamePrecursor,
        characters: [
            {
                "name": "Female Robin",
                "nameSlug": "female_robin",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Night",
                        "outfitSlug": "night"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Brave",
                        "outfitSlug": "brave"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Dark",
                        "outfitSlug": "dark"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Emmeryn",
                "nameSlug": "emmeryn",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Sully",
                "nameSlug": "sully",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Sumia",
                "nameSlug": "sumia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Maribelle",
                "nameSlug": "maribelle",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Miriel",
                "nameSlug": "miriel",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Cordelia",
                "nameSlug": "cordelia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Armored",
                        "outfitSlug": "armored"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Phila",
                "nameSlug": "phila",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Flavia",
                "nameSlug": "flavia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Olivia",
                "nameSlug": "olivia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "Night",
                        "outfitSlug": "night"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Tharja",
                "nameSlug": "tharja",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Aversa",
                "nameSlug": "aversa",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Say'ri",
                "nameSlug": "sayri",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Cherche",
                "nameSlug": "cherche",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    }
                ]
            },
            {
                "name": "Adult Tiki",
                "nameSlug": "adult_tiki",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Brides",
                        "outfitSlug": "brides",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Brave",
                        "outfitSlug": "brave"
                    }
                ]
            },
            {
                "name": "Panne",
                "nameSlug": "panne",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    }
                ]
            },
            {
                "name": "Awakening Anna",
                "nameSlug": "awakening_anna",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    }
                ]
            },
            {
                "name": "Lucina",
                "nameSlug": "lucina",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Persona",
                        "outfitSlug": "persona"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Armored",
                        "outfitSlug": "armored",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Brave",
                        "outfitSlug": "brave",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Naga",
                "nameSlug": "naga",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Kjelle",
                "nameSlug": "kjelle",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Cynthia",
                "nameSlug": "cynthia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Severa",
                "nameSlug": "severa",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring"
                    }
                ]
            },
            {
                "name": "Noire",
                "nameSlug": "noire",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": awakeningSecondaryCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Lissa",
                "nameSlug": "lissa",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": awakeningMainCastGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🟣"
                    }
                ]
            }
        ],
    },
    {
        ...bindingBladeGamePrecursor,
        characters: [
            {
                "name": "Gwendolyn",
                "nameSlug": "gwendolyn",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Cecilia",
                "nameSlug": "cecilia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Brunnya",
                "nameSlug": "brunnya",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "💎",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Guinivere",
                "nameSlug": "guinivere",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 550.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Melady",
                "nameSlug": "melady",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Echidna",
                "nameSlug": "echidna",
                "heightInCm": 160.0,
                "build": 'Strong',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Igrene",
                "nameSlug": "igrene",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    }
                ]
            },
            {
                "name": "Idunn",
                "nameSlug": "idunn",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 550.0,
                        "mainShape": "⌛",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Elimine",
                "nameSlug": "elimine",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "💎",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Juno",
                "nameSlug": "juno",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "⌛"
                    }
                ]
            }
        ],
    },
    {
        ...blazingSwordGamePrecursor,
        characters: [
            {
                "name": "Lyn",
                "nameSlug": "lyn",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Armored",
                        "outfitSlug": "armored"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Brave",
                        "outfitSlug": "brave",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Flame Tribe",
                        "outfitSlug": "flame_tribe"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Isadora",
                "nameSlug": "isadora",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Leila",
                "nameSlug": "leila",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Thief",
                        "outfitSlug": "thief"
                    }
                ]
            },
            {
                "name": "Louise",
                "nameSlug": "louise",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    }
                ]
            },
            {
                "name": "Fiora",
                "nameSlug": "fiora",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Karla",
                "nameSlug": "karla",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Dark",
                        "outfitSlug": "dark",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "💎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Limstella",
                "nameSlug": "limstella",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Sonia",
                "nameSlug": "sonia",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ursula",
                "nameSlug": "ursula",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Dark",
                        "outfitSlug": "dark"
                    }
                ]
            }
        ],
    },
    {
        ...echoesGamePrecursor,
        characters: [
            {
                "name": "Silque",
                "nameSlug": "silque",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted"
                    }
                ]
            },
            {
                "name": "Clair",
                "nameSlug": "clair",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Faye",
                "nameSlug": "faye",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Valentine",
                        "outfitSlug": "valentine"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🟣",
                        "outfit": "Embla",
                        "outfitSlug": "embla",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Mathilda",
                "nameSlug": "mathilda",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Sonya",
                "nameSlug": "sonya",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Beautiful Mage",
                        "outfitSlug": "beautiful_mage"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Muspelt",
                        "outfitSlug": "muspelt",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Tatiana",
                "nameSlug": "tatiana",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Mila",
                "nameSlug": "mila",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 700.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Marla",
                "nameSlug": "marla",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Hestia",
                "nameSlug": "hestia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Rinea",
                "nameSlug": "rinea",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom"
                    }
                ]
            }
        ],
    },
    {
        ...engageGamePrecursor,
        characters: [
            {
                "name": "Female Alear",
                "nameSlug": "female_alear",
                "heightInCm": 165.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    }
                ]
            },
            {
                "name": "Lumera",
                "nameSlug": "lumera",
                "heightInCm": 177.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Chloé",
                "nameSlug": "chloe",
                "heightInCm": 167.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring"
                    }
                ]
            },
            {
                "name": "Lapis",
                "nameSlug": "lapis",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Citrinne",
                "nameSlug": "citrinne",
                "heightInCm": 163.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ivy",
                "nameSlug": "ivy",
                "heightInCm": 172.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Timerra",
                "nameSlug": "timerra",
                "heightInCm": 159.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Merrin",
                "nameSlug": "merrin",
                "heightInCm": 173.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Panette",
                "nameSlug": "panette",
                "heightInCm": 164.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Zephia",
                "nameSlug": "zephia",
                "heightInCm": 177.0,
                "build": 'Strong',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Nel",
                "nameSlug": "nel",
                "heightInCm": 175.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Goldmary",
                "nameSlug": "goldmary",
                "heightInCm": 173.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Etie",
                "nameSlug": "etie",
                "heightInCm": 154.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Yunaka",
                "nameSlug": "yunaka",
                "heightInCm": 164.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Christmas",
                        "outfitSlug": "christmas",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Céline",
                "nameSlug": "celine",
                "heightInCm": 155.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            }
        ],
    },
    {
        ...fatesGamePrecursor,
        characters: [
            {
                "name": "Female Corrin",
                "nameSlug": "female_corrin",
                "heightInCm": 165.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Night",
                        "outfitSlug": "night",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    }
                ]
            },
            {
                "name": "Azura",
                "nameSlug": "azura",
                "heightInCm": 168.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍎",
                        "outfit": "Night",
                        "outfitSlug": "night"
                    }
                ]
            },
            {
                "name": "Felicia",
                "nameSlug": "felicia",
                "heightInCm": 158.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Picnic",
                        "outfitSlug": "picnic"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    }
                ]
            },
            {
                "name": "Mikoto",
                "nameSlug": "mikoto",
                "heightInCm": 170.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Kagero",
                "nameSlug": "kagero",
                "heightInCm": 165.0,
                "build": 'Regular',
                "group": fatesBirthrightGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Thief",
                        "outfitSlug": "thief",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Hinoka",
                "nameSlug": "hinoka",
                "heightInCm": 170.0,
                "build": 'Regular',
                "group": fatesBirthrightGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Hot Spring",
                        "outfitSlug": "hot_spring",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🟣",
                        "outfit": "Pirate",
                        "outfitSlug": "pirate",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Setsuna",
                "nameSlug": "setsuna",
                "heightInCm": 163.0,
                "build": 'Regular',
                "group": fatesBirthrightGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Oboro",
                "nameSlug": "oboro",
                "heightInCm": 163.0,
                "build": 'Regular',
                "group": fatesBirthrightGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    }
                ]
            },
            {
                "name": "Orochi",
                "nameSlug": "orochi",
                "heightInCm": 167.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer"
                    }
                ]
            },
            {
                "name": "Rinkah",
                "nameSlug": "rinkah",
                "heightInCm": 161.0,
                "initialRoaster": true,
                "build": 'Strong',
                "group": fatesBirthrightGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Flame Tribe",
                        "outfitSlug": "flame_tribe",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Peri",
                "nameSlug": "peri",
                "heightInCm": 163.0,
                "build": 'Regular',
                "group": fatesConquestGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Camilla",
                "nameSlug": "camilla",
                "heightInCm": 178.0,
                "build": 'Strong',
                "group": fatesConquestGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Dream",
                        "outfitSlug": "dream"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Dark",
                        "outfitSlug": "dark"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Hot Spring",
                        "outfitSlug": "hot_spring"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Pirate",
                        "outfitSlug": "pirate"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Selena",
                "nameSlug": "selena",
                "heightInCm": 158.0,
                "build": 'Petite',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    }
                ]
            },
            {
                "name": "Effie",
                "nameSlug": "effie",
                "heightInCm": 172.0,
                "build": 'Regular',
                "group": fatesConquestGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted"
                    }
                ]
            },
            {
                "name": "Charlotte",
                "nameSlug": "charlotte",
                "heightInCm": 161.0,
                "build": 'Regular',
                "group": fatesConquestGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    }
                ]
            },
            {
                "name": "Flora",
                "nameSlug": "flora",
                "heightInCm": 181.0,
                "build": 'Regular',
                "group": fatesConquestGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Picnic",
                        "outfitSlug": "picnic",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Ice Tribe",
                        "outfitSlug": "ice_tribe",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Candace",
                "nameSlug": "candace",
                "heightInCm": 165.0,
                "build": 'Giant',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Arete",
                "nameSlug": "arete",
                "heightInCm": 175.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Reina",
                "nameSlug": "reina",
                "heightInCm": 170.0,
                "build": 'Regular',
                "group": fatesRevelationsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    }
                ]
            }
        ],
    },
    {
        ...heroesGamePrecursor,
        characters: [
            {
                "name": "Anna",
                "nameSlug": "anna",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    }
                ]
            },
            {
                "name": "Henriette",
                "nameSlug": "henriette",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted"
                    }
                ]
            },
            {
                "name": "Ash",
                "nameSlug": "ash",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🟣",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Letizia",
                "nameSlug": "letizia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen"
                    }
                ]
            },
            {
                "name": "Embla",
                "nameSlug": "embla",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Nifl",
                "nameSlug": "nifl",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Ice Tribe",
                        "outfitSlug": "ice_tribe",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Fjorm",
                "nameSlug": "fjorm",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Ice Tribe",
                        "outfitSlug": "ice_tribe"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Gunnthra",
                "nameSlug": "gunnthra",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Laegjarn",
                "nameSlug": "laegjarn",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Flame Ascendant",
                        "outfitSlug": "flame_ascendant",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Hel",
                "nameSlug": "hel",
                "heightInCm": 160.0,
                "build": 'Giant',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Thrasir",
                "nameSlug": "thrasir",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted"
                    }
                ]
            },
            {
                "name": "Ganglot",
                "nameSlug": "ganglot",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Eir",
                "nameSlug": "eir",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Ascendant",
                        "outfitSlug": "ascendant",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Ymir",
                "nameSlug": "ymir",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Peony",
                "nameSlug": "peony",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Cherished Dream",
                        "outfitSlug": "dream",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Flame Tribe",
                        "outfitSlug": "flame_tribe",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Mirabilis",
                "nameSlug": "mirabilis",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Spring",
                        "outfitSlug": "spring"
                    }
                ]
            },
            {
                "name": "Triandra",
                "nameSlug": "triandra",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Dream",
                        "outfitSlug": "dream"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Plumeria",
                "nameSlug": "plumeria",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Dream",
                        "outfitSlug": "dream",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Freyja",
                "nameSlug": "freyja",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Eitr ",
                "nameSlug": "eitr",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "secondaryShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ginnungagap",
                "nameSlug": "ginnungagap",
                "heightInCm": 160.0,
                "build": 'Giant',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Reginn",
                "nameSlug": "reginn",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Thjazi",
                "nameSlug": "thjazi",
                "heightInCm": 160.0,
                "build": 'Giant',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Dagr",
                "nameSlug": "dagr",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Strong',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer"
                    }
                ]
            },
            {
                "name": "Nott",
                "nameSlug": "nott",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook45Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    }
                ]
            },
            {
                "name": "Seior",
                "nameSlug": "seior",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Gullveig",
                "nameSlug": "gullveig",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Brave",
                        "outfitSlug": "brave",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Kvasir",
                "nameSlug": "kvasir",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "⌛",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    }
                ]
            },
            {
                "name": "Heior",
                "nameSlug": "heior",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "New Year",
                        "outfitSlug": "new_year"
                    }
                ]
            },
            {
                "name": "Nerpuz",
                "nameSlug": "nerpuz",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "⌛",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Ratatoskr",
                "nameSlug": "ratatoskr",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 550.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Hraesvelgr",
                "nameSlug": "hraesvelgr",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Nidhoggr",
                "nameSlug": "niohoggr",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Heidrun",
                "nameSlug": "heiorun",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook68Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Loki",
                "nameSlug": "loki",
                "initialRoaster": true,
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "💎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Thorr",
                "nameSlug": "thorr",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": heroesBook13Group,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    }
                ]
            }
        ],
    },
    {
        ...holyWarGamePrecursor,
        characters: [
            {
                "name": "Tailtiu",
                "nameSlug": "tailtiu",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Dark",
                        "outfitSlug": "dark"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Maid",
                        "outfitSlug": "maid",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Ethlyn",
                "nameSlug": "ethlyn",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Arya",
                "nameSlug": "arya",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Maid",
                        "outfitSlug": "maid"
                    }
                ]
            },
            {
                "name": "Annand",
                "nameSlug": "annand",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Dithorba",
                "nameSlug": "dithorba",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Erinys",
                "nameSlug": "erinys",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Lachesis",
                "nameSlug": "lachesis",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Night",
                        "outfitSlug": "night"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom"
                    }
                ]
            },
            {
                "name": "Deirdre",
                "nameSlug": "deirdre",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom"
                    }
                ]
            },
            {
                "name": "Silvia",
                "nameSlug": "silvia",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Larcei",
                "nameSlug": "larcei",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍎",
                        "outfit": "Armored",
                        "outfitSlug": "armored"
                    }
                ]
            },
            {
                "name": "Lene",
                "nameSlug": "lene",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Julia ",
                "nameSlug": "julia",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Ascendant",
                        "outfitSlug": "ascendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Scion",
                        "outfitSlug": "scion",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Altena",
                "nameSlug": "altena",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ishtar",
                "nameSlug": "ishtar",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 550.0,
                        "mainShape": "🟣",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Hilda [Holy War]",
                "nameSlug": "hilda_holy_war",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ullr",
                "nameSlug": "ullr",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Brigid",
                "nameSlug": "brigid",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Pirate",
                        "outfitSlug": "pirate"
                    }
                ]
            }
        ],
    },
    {
        ...mirageGamePrecursor,
        characters: [
            {
                "name": "Tsubasa",
                "nameSlug": "tsubasa",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Kiria",
                "nameSlug": "kiria",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Eleanora",
                "nameSlug": "eleanora",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            }
        ],
    },
    {
        ...telliusGamePrecursor,
        characters: [
            {
                "name": "Titania",
                "nameSlug": "titania",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Devoted",
                        "outfitSlug": "devoted",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Elincia",
                "nameSlug": "elincia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Armored",
                        "outfitSlug": "armored",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Yukata",
                        "outfitSlug": "yukata",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Nephenee",
                "nameSlug": "nephenee",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Ballroom",
                        "outfitSlug": "ballroom",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Yukata",
                        "outfitSlug": "yukata"
                    }
                ]
            },
            {
                "name": "Sigrun",
                "nameSlug": "sigrun",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Tanith",
                "nameSlug": "tanith",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Marcia",
                "nameSlug": "marcia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Astrid",
                "nameSlug": "astrid",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Petrine",
                "nameSlug": "petrine",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Strong',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Ilyana",
                "nameSlug": "ilyana",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            },
            {
                "name": "Mia",
                "nameSlug": "mia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            },
            {
                "name": "Lethe",
                "nameSlug": "lethe",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusPathOfRadianceGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "New Year",
                        "outfitSlug": "new_year",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            },
            {
                "name": "Leanne",
                "nameSlug": "leanne",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer"
                    }
                ]
            },
            {
                "name": "Ena",
                "nameSlug": "ena",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            },
            {
                "name": "Lucia",
                "nameSlug": "lucia",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Yukata",
                        "outfitSlug": "yukata",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Nailah",
                "nameSlug": "nailah",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Altina",
                "nameSlug": "altina",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Ashera",
                "nameSlug": "ashera",
                "heightInCm": 160.0,
                "build": 'Strong',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Heather",
                "nameSlug": "heather",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    }
                ]
            },
            {
                "name": "Vika",
                "nameSlug": "vika",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": telliusRadiantDawnGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Pirate",
                        "outfitSlug": "pirate"
                    }
                ]
            }
        ],
    },
    {
        ...sacredStonesGamePrecursor,
        characters: [
            {
                "name": "Eirika",
                "nameSlug": "eirika",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "💎",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Armored",
                        "outfitSlug": "armored"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Brave",
                        "outfitSlug": "brave",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    }
                ]
            },
            {
                "name": "Syrene",
                "nameSlug": "syrene",
                "heightInCm": 160.0,
                "build": 'Strong',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Vanessa",
                "nameSlug": "vanessa",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Selena (Sacred Stones)",
                "nameSlug": "selena_sacred_stones",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Natasha",
                "nameSlug": "natasha",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Marisa",
                "nameSlug": "marisa",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Tethys",
                "nameSlug": "tethys",
                "initialRoaster": true,
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "L'Arachel",
                "nameSlug": "larachel",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            }
        ],
    },
    {
        ...shadowDragonGamePrecursor,
        characters: [
            {
                "name": "Caeda",
                "nameSlug": "caeda",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Beloved Queen",
                        "outfitSlug": "beloved_queen"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Marth's Faithful",
                        "outfitSlug": "marths_faithful",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Bride",
                        "outfitSlug": "bride",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Elice",
                "nameSlug": "elice",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Nyna",
                "nameSlug": "nyna",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Linde",
                "nameSlug": "linde",
                "heightInCm": 160.0,
                "build": 'Petite',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍎",
                        "outfit": "Askr",
                        "outfitSlug": "askr"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Minerva",
                "nameSlug": "minerva",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Muspell",
                        "outfitSlug": "muspell"
                    }
                ]
            },
            {
                "name": "Palla",
                "nameSlug": "palla",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🍐"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Catria",
                "nameSlug": "catria",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Bride",
                        "outfitSlug": "bride"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🟣",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "⌛",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Wind Tribe",
                        "outfitSlug": "wind_tribe"
                    }
                ]
            },
            {
                "name": "Lena",
                "nameSlug": "lena",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Sheena",
                "nameSlug": "sheena",
                "heightInCm": 160.0,
                "build": 'Strong',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🍐",
                        "outfit": "Embla",
                        "outfitSlug": "embla",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Nagi",
                "nameSlug": "nagi",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest"
                    }
                ]
            },
            {
                "name": "Eremiya",
                "nameSlug": "eremiya",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Clarisse",
                "nameSlug": "clarisse",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Phina",
                "nameSlug": "phina",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Athena",
                "nameSlug": "athena",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Malice",
                "nameSlug": "malice",
                "heightInCm": 160.0,
                "initialRoaster": true,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 550.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Kris",
                "nameSlug": "kris",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            }
        ],
    },
    {
        ...thraciaGamePrecursor,
        characters: [
            {
                "name": "Eyvel",
                "nameSlug": "eyvel",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Tanya",
                "nameSlug": "tanya",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Safy",
                "nameSlug": "safy",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Olwen",
                "nameSlug": "olwen",
                "heightInCm": 160.0,
                "build": 'Regular',
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Armored",
                        "outfitSlug": "armored"
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Resplendant",
                        "outfitSlug": "resplendant"
                    }
                ]
            }
        ],
    },
    {
        ...threeHousesGamePrecursor,
        characters: [
            {
                "name": "Female Byleth",
                "nameSlug": "female_byleth",
                "heightInCm": 164.0,
                "initialRoaster": true,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "💎",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    }
                ]
            },
            {
                "name": "Rhea",
                "nameSlug": "rhea",
                "heightInCm": 172.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Persona",
                        "outfitSlug": "persona"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "⌛",
                        "outfit": "Harvest",
                        "outfitSlug": "harvest",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Catherine",
                "nameSlug": "catherine",
                "heightInCm": 175.0,
                "build": 'Strong',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Shamir",
                "nameSlug": "shamir",
                "heightInCm": 169.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "⌛",
                        "outfit": "Ninja",
                        "outfitSlug": "ninja"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "⌛"
                    }
                ]
            },
            {
                "name": "Cornelia",
                "nameSlug": "cornelia",
                "heightInCm": 168.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Kronya",
                "nameSlug": "kronya",
                "heightInCm": 157.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "secondaryShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Female Shez",
                "nameSlug": "female_shez",
                "heightInCm": 170.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Brave",
                        "outfitSlug": "brave",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Monica",
                "nameSlug": "monica",
                "heightInCm": 157.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Arval",
                "nameSlug": "arval",
                "heightInCm": 160.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🍎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Manuela",
                "nameSlug": "manuela",
                "heightInCm": 172.0,
                "build": 'Regular',
                "group": threeHousesProfessionalsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "💎",
                        "outfit": "Winter",
                        "outfitSlug": "winter"
                    }
                ]
            },
            {
                "name": "Edelgard",
                "nameSlug": "edelgard",
                "heightInCm": 158.0,
                "build": 'Petite',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Legendary",
                        "outfitSlug": "legendary"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Christmas",
                        "outfitSlug": "christmas"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍎",
                        "outfit": "Persona",
                        "outfitSlug": "persona",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Fallen",
                        "outfitSlug": "fallen",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Dorothea",
                "nameSlug": "dorothea",
                "heightInCm": 170.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Christmas",
                        "outfitSlug": "christmas",
                        "secondaryShape": "🍎"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍐",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 600.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            },
            {
                "name": "Annette",
                "nameSlug": "annette",
                "heightInCm": 153.0,
                "build": 'Petite',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Christmas",
                        "outfitSlug": "christmas"
                    }
                ]
            },
            {
                "name": "Bernadetta",
                "nameSlug": "bernadetta",
                "heightInCm": 150.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Spring",
                        "outfitSlug": "spring",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Winter",
                        "outfitSlug": "winter",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 200.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍐"
                    }
                ]
            },
            {
                "name": "Constance",
                "nameSlug": "constance",
                "heightInCm": 164.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Hapi",
                "nameSlug": "hapi",
                "heightInCm": 169.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Hilda",
                "nameSlug": "hilda",
                "heightInCm": 154.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "💎",
                        "secondaryShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "⌛",
                        "outfit": "Ascended",
                        "outfitSlug": "ascended"
                    },
                    {
                        "outfitWeightThresholdInLb": 450.0,
                        "mainShape": "🍐",
                        "outfit": "Christmas",
                        "outfitSlug": "christmas",
                        "secondaryShape": "⌛"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "⌛",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "💎"
                    }
                ]
            },
            {
                "name": "Ingrid",
                "nameSlug": "ingrid",
                "heightInCm": 165.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🍎",
                        "outfit": "Rearmed",
                        "outfitSlug": "rearmed",
                        "secondaryShape": "🟣"
                    },
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🍎"
                    }
                ]
            },
            {
                "name": "Lysithea",
                "nameSlug": "lysithea",
                "heightInCm": 160.0,
                "build": 'Petite',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍐",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    }
                ]
            },
            {
                "name": "Marianne",
                "nameSlug": "marianne",
                "heightInCm": 163.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🟣",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 250.0,
                        "mainShape": "🍎",
                        "outfit": "Dancer",
                        "outfitSlug": "dancer"
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Armored",
                        "outfitSlug": "armored",
                        "secondaryShape": "💎"
                    },
                    {
                        "outfitWeightThresholdInLb": 500.0,
                        "mainShape": "🍎",
                        "outfit": "Summer",
                        "outfitSlug": "summer",
                        "secondaryShape": "🟣"
                    }
                ]
            },
            {
                "name": "Mercedes",
                "nameSlug": "mercedes",
                "heightInCm": 169.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 400.0,
                        "mainShape": "🍎",
                        "secondaryShape": "💎",
                        "outfit": "Base",
                        "outfitSlug": "base",
                    },
                    {
                        "outfitWeightThresholdInLb": 300.0,
                        "mainShape": "🟣",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    },
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "💎",
                        "outfit": "Picnic",
                        "outfitSlug": "picnic"
                    }
                ]
            },
            {
                "name": "Leonie",
                "nameSlug": "leonie",
                "heightInCm": 168.0,
                "build": 'Regular',
                "group": threeHousesStudentsGroup,
                "outfits": [
                    {
                        "outfitWeightThresholdInLb": 350.0,
                        "mainShape": "🍐",
                        "outfit": "Summer",
                        "outfitSlug": "summer"
                    }
                ]
            }
        ],
    },
];