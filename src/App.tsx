import "maplibre-gl/dist/maplibre-gl.css";
import { INIT_CORDS } from "./constant";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import type { CircleLayer } from "react-map-gl/maplibre";
import { useState } from "react";
import type { FeatureCollection, Feature } from "geojson";
import { generateCircleCordinates } from "./utils";

const [INITIAL_LONGITUDE, INITIAL_LATITUDE] = INIT_CORDS;

const layerStyle: CircleLayer = {
	id: "point",
	type: "circle",
	paint: {
		"circle-opacity": 1,
		"circle-color": "#007cbf",
	},
	source: "my-data",
};

export default function App() {
	const [features, setFeatures] = useState<Array<Feature>>([]);

	const geojson: FeatureCollection = {
		type: "FeatureCollection",
		features,
	};

	return (
		<Map
			onClick={(e) => {
				const cords = e.lngLat;
				const positions = generateCircleCordinates(cords);
				setFeatures((prev) => [
					...prev,
					{
						type: "Feature",
						properties: {},
						id: Math.random().toString(),
						geometry: {
							type: "Polygon",
							coordinates: [positions],
						},
					},
				]);
			}}
			initialViewState={{
				longitude: INITIAL_LONGITUDE,
				latitude: INITIAL_LATITUDE,
				zoom: 5,
			}}
			style={{ width: "100vw", height: "80vh" }}
			mapStyle="https://demotiles.maplibre.org/style.json"
		>
			<NavigationControl />
			<Source id={`my-data`} type="geojson" data={geojson}>
				<Layer {...layerStyle} />
			</Source>
		</Map>
	);
}
