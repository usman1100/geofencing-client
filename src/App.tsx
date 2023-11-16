import { LngLat, LngLatLike, Map, NavigationControl } from "maplibre-gl";
import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const BOX_SIZE = "800px";
const INIT_CORDS: LngLatLike = [69.84381016559087, 31.26276045549733];

const generateCircleCordinates = (center: LngLat, radius: number) => {
	return Array.from({ length: 360 }, (_, i) => [
		center.lng + radius * Math.cos(i),
		center.lat + radius * Math.sin(i),
	]);
};

const colors = [
	"#FF5733",
	"#4CAF50",
	"#FFD700",
	"#8A2BE2",
	"#FF4500",
	"#00FFFF",
	"#FF1493",
	"#32CD32",
	"#9932CC",
	"#FF8C00",
	"#008080",
	"#8B008B",
	"#FF69B4",
	"#7CFC00",
	"#00FA9A",
	"#FF00FF",
	"#ADFF2F",
	"#FF00FF",
];

const getRandomColor = () => {
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};

function App() {
	const mapContainer = useRef<Map | null>(null);

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
			drawCircle(cords);
		});
	}, [mapContainer]);

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
