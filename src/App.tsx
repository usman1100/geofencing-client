import { LngLat, LngLatLike, Map } from "maplibre-gl";
import { useEffect, useState } from "react";
import { circleData } from "./data";

const BOX_SIZE = "800px";
const INIT_CORDS = [69.84381016559087, 31.26276045549733];

const generateCircleCordinates = (center: LngLat, radius: number) => {
	const coords = [];
	for (let i = 0; i < 360; i++) {
		coords.push([
			center.lng + radius * Math.cos(i),
			center.lat + radius * Math.sin(i),
		]);
	}
	return coords;
};

function App() {
	const [map, setMap] = useState<Map | undefined>();

	useEffect(() => {
		setMap(
			new Map({
				container: "map",
				style: "https://demotiles.maplibre.org/style.json", // stylesheet location
				center: INIT_CORDS as LngLatLike, // starting position [lng, lat]
				zoom: 5, // starting zoom
			})
		);
	}, []);

	const drawCircle = (cords: LngLat) => {
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
					"fill-color": "#088",
					"fill-opacity": 0.8,
				},
			});
		} catch (error) {
			console.log(error);

			map.removeSource(cordId);
			map.removeLayer(cordId);
		} finally {
			map.redraw();
		}
	};

	useEffect(() => {
		if (!map) return;

		map?.on("load", () => {
			map.addSource("circle", {
				type: "geojson",
				data: circleData,
			});
			map.addLayer({
				id: "circle",
				type: "fill",
				source: "circle",
				layout: {},
				paint: {
					"fill-color": "#088",
					"fill-opacity": 0.8,
				},
			});
		});

		map?.on("click", (e) => {
			const cords = e.lngLat;
			console.log(cords);
			drawCircle(cords);
		});
	}, [map]);

	return (
		<div>
			<div
				id="map"
				style={{ width: BOX_SIZE, height: BOX_SIZE, margin: "100px" }}
			></div>
		</div>
	);
}

export default App;
