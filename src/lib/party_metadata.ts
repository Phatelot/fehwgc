import type { Party, PartyMetadata } from "./model";

import dungeonPic from '/src/assets/Dungeon.jpg';
import flamelasPic from '/src/assets/Flamelas_Canaries.jpg';
import adventurersPic from '/src/assets/Adventurers.jpg';
import kabrusPic from '/src/assets/Kabrus_Party.jpg';
import laiosPic from '/src/assets/Laios_Party.jpg';
import mithrunsPic from '/src/assets/Mithruns_Party.jpg';
import otherPic from '/src/assets/Other.jpg';
import shurosPic from '/src/assets/Shuros_Party.jpg';

export const partyMetadata : {[key: string]: PartyMetadata} = {
	'DUNGEON': {
		displayName: `The Dungeon`,
		color: 'purple',
		pictureLink: dungeonPic,
	},
	'FLAMELAS': {
		displayName: `Flamela's Canaries`,
		color: 'green',
		pictureLink: flamelasPic,
	},
	'ADVENTURERS': {
		displayName: `Adventurers`,
		color: 'darkTeal',
		pictureLink: adventurersPic,
	},
	'KABRUS': {
		displayName: `Kabru's Party`,
		color: 'blue',
		pictureLink: kabrusPic,
	},
	'LAIOS': {
		displayName: `Laios' Party`,
		color: 'orange',
		pictureLink: laiosPic,
	},
	'MITHRUNS': {
		displayName: `Mithrun's Canaries`,
		color: 'darkGreen',
		pictureLink: mithrunsPic,
	},
	'SHUROS': {
		displayName: `Shuro's Party`,
		color: 'red',
		pictureLink: shurosPic,
	},
	'OTHERS': {
		displayName: `Other`,
		color: 'pink',
		pictureLink: otherPic,
	},
};

export function getPartyMetadata(party: string) : PartyMetadata {
    return partyMetadata[party]
}

export function getParties(): string[] {
	return Object.keys(partyMetadata);
}
