import "maplibre-gl/dist/maplibre-gl.css";
import { INIT_CORDS } from "./constant";
import Map, { Layer, Source } from "react-map-gl/maplibre";
import type { CircleLayer, LngLat } from "react-map-gl/maplibre";
import { useState } from "react";
import type { FeatureCollection } from "geojson";

const [INITIAL_LONGITUDE, INITIAL_LATITUDE] = INIT_CORDS;
const geojson: FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			geometry: { type: "Point", coordinates: INIT_CORDS },
			properties: {},
		},
	],
};

const layerStyle: CircleLayer = {
	id: "point",
	type: "circle",
	paint: {
		"circle-radius": 90,
		"circle-color": "#007cbf",
	},
	source: "my-data",
};

export default function App() {
	const [circles, setCircles] = useState<Array<LngLat>>([]);
	return (
		<Map
			onClick={(e) => {
				const cords = e.lngLat;
				setCircles((markers) => [...markers, cords]);
			}}
			initialViewState={{
				longitude: INITIAL_LONGITUDE,
				latitude: INITIAL_LATITUDE,
				zoom: 5,
			}}
			style={{ width: "100vw", height: "80vh" }}
			mapStyle="https://demotiles.maplibre.org/style.json"
		>
			{circles.map((cords) => (
				<Source
					id={`my-data-${cords.lat}-${cords.lng}`}
					type="geojson"
					data={geojson}
				>
					<Layer {...layerStyle} />
				</Source>
			))}
		</Map>
	);
}
