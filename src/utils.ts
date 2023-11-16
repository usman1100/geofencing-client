import { LngLat } from "maplibre-gl";
import { colors } from "./constant";

export const generateCircleCordinates = (center: LngLat, radius: number) => {
	return Array.from({ length: 360 }, (_, i) => [
		center.lng + radius * Math.cos(i),
		center.lat + radius * Math.sin(i),
	]);
};

export const getRandomColor = () => {
	return colors[0]
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};
