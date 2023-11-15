import { LngLat, LngLatLike, Map } from "maplibre-gl";
import { useEffect, useState } from "react";
import { circleData } from "./data";

const BOX_SIZE = "800px";
const INIT_CORDS = [69.84381016559087, 31.26276045549733];

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
		map.addSource("circle2", {
			type: "geojson",
			// draw a 200km radius circle around the point
			// cords = {lng, lat}
			data: {
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: [
						[
							[cords.lng, cords.lat + 0.1],
							[cords.lng + 0.1, cords.lat],
							[cords.lng, cords.lat - 0.1],
							[cords.lng - 0.1, cords.lat],
							[cords.lng, cords.lat + 0.1],
							[cords.lng + 0.1, cords.lat],
						],
					],
				},
			},
		});
		map.addLayer({
			id: "circle2",
			type: "fill",
			source: "circle2",
			layout: {},
			paint: {
				"fill-color": "#088",
				"fill-opacity": 0.8,
			},
		});
		map.redraw();
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
