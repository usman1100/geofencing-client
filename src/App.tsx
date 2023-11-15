import { LngLatLike, Map } from "maplibre-gl";
import { useEffect, useState } from "react";

const BOX_SIZE = "800px";
const INIT_CORDS = [69.84381016559087, 31.26276045549733];

function App() {
	const [map, setMap] = useState<Map | undefined>();
	const [cords, setCords] = useState<{
		lng: number;
		lat: number;
	}>({
		lat: INIT_CORDS[0],
		lng: INIT_CORDS[1],
	});

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

	map?.on("move", () => {
		const center = map?.getCenter ? map?.getCenter() : null;

		if (center) {
			setCords(center);
		}
	});

	return (
		<div>
			<div id="map" style={{ width: BOX_SIZE, height: BOX_SIZE }}></div>
			<pre>{JSON.stringify(cords, null, 2)}</pre>
		</div>
	);
}

export default App;
