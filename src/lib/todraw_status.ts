import type { ToDrawListOutfitViewModel } from "./view_model";

export type ToDrawStatus = "UNKNOWN" | "OK" | "NOK";

export function toDrawStatusToIcon(status: ToDrawStatus): string {
	return {
		"UNKNOWN": "❔",
		"OK": "✅",
		"NOK": "❗",
	}[status];
}

export type ToDrawOutfit = {
	initWeightInLb: number;
	lastDrawnWeightInLb: number | undefined;
};

export const percentThresholdForToDraw = 10;

export type ToDrawStatusWithPercent = {
	status: ToDrawStatus;
	baseWeight: number;
	percent: number;
	wasCheckedOnce: boolean;
}

export function ComputeToDrawStatus(toDraw: ToDrawOutfit, actualCurrentWeightInLb: number): ToDrawStatusWithPercent {
	if (!toDraw.lastDrawnWeightInLb) {
		const percent = ((actualCurrentWeightInLb / toDraw.initWeightInLb) - 1) * 100

		return {
			status: (percent >= percentThresholdForToDraw) ? "NOK" : "UNKNOWN",
			baseWeight: toDraw.initWeightInLb,
			percent,
			wasCheckedOnce: false,
		}
	}
	const percent = ((actualCurrentWeightInLb / toDraw.lastDrawnWeightInLb) - 1) * 100
	return {
		status: (percent > percentThresholdForToDraw) ? "NOK" : "OK",
		baseWeight: toDraw.lastDrawnWeightInLb,
		percent,
		wasCheckedOnce: true,
	}
}

export type ToDrawOutfits = {[keys: string]: ToDrawOutfit}

export function loadToDrawOutfits(): ToDrawOutfits {
	const retrieved = localStorage.getItem("fehwgc-todraw");
	if (!retrieved) {
        return {};
	}
	return JSON.parse(retrieved);
}

export function saveToDrawOutfits(outfits: ToDrawOutfits) {
	const saved = loadToDrawOutfits()

	localStorage.setItem("fehwgc-todraw", JSON.stringify({...saved, ...outfits}));
}

export function isToDrawOutfitPerfectlyUpToDate(o: ToDrawListOutfitViewModel): boolean {
	return Math.abs(o.differenceInPercent) < 0.1
}
