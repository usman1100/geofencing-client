import { LngLat, Map, NavigationControl } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { BOX_SIZE, INIT_CORDS } from "./constant";
import { generateCircleCordinates, getRandomColor } from "./utils";

function App() {
	const mapContainer = useRef<Map | null>(null);
	const [circles, setCircles] = useState<LngLat[]>([]);

	const drawCircle = (cords: LngLat) => {
		const map = mapContainer?.current;
		if (!map) return;

		const coordinates = generateCircleCordinates(cords, 0.5);

		const cordId = `${cords.lng}-${cords.lat}`;

		try {
			map.addSource(cordId, {
				type: "geojson",
				data: {
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [coordinates],
					},
				},
			});
			map.addLayer({
				id: cordId,
				type: "fill",
				source: cordId,
				layout: {},
				paint: {
					// purple fill
					"fill-color": getRandomColor(),
					"fill-opacity": 1,
				},
			});
		} catch (error) {
			map.removeSource(cordId);
			map.removeLayer(cordId);
		}
		map.redraw();
	};

	const clearAllLayers = () => {
		const map = mapContainer?.current;
		if (!map) return;

		const style = map.getStyle();
		style?.layers?.forEach((layer) => {
			// only remove layers that are added by us
			if (layer.type === "circle") map.removeLayer(layer.id);
		});
	};

	useEffect(() => {
		if (mapContainer.current) return;

		mapContainer.current = new Map({
			container: "map",
			style: "https://demotiles.maplibre.org/style.json", // stylesheet location
			center: INIT_CORDS,
			zoom: 5, // starting zoom
		});
	}, []);

	useEffect(() => {
		if (!mapContainer.current) return;
		mapContainer.current.on("click", (e) => {
			const cords = e.lngLat;
			setCircles((prev) => [...prev, cords]);
		});
	}, [mapContainer]);

	useEffect(() => {
		clearAllLayers();
		circles.forEach((cords) => drawCircle(cords));
	}, [circles]);

	useEffect(() => {
		if (!mapContainer.current) return;
		mapContainer.current.addControl(
			new NavigationControl({
				showCompass: true,
				showZoom: true,
				visualizePitch: true,
			}),
			"top-right"
		);
	}, [mapContainer]);

	return (
		<div>
			<div
				id="map"
				className="map"
				style={{
					width: "100vw",
					height: BOX_SIZE,
				}}
			></div>
		</div>
	);
}

export default App;
