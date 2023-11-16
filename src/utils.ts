import { LngLat } from "maplibre-gl";
import type {  Position } from "geojson";
import { colors } from "./constant";

export const generateCircleCordinates = (center: LngLat, radius = 0.01):Position[] => {
	return Array.from({ length: 360 }, (_, i) => [
		center.lng + radius * Math.cos(i),
		center.lat + radius * Math.sin(i),
	]);
};

export const getRandomColor = () => {
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};
