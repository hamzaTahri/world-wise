import styles from "./Map.module.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {useCities} from "../context/CitiesContext.jsx";
import Button from "./Button.jsx";
import {useGeolocation} from "../hooks/useGeoLocation.js";
import {useUrlPosition} from "../hooks/useUrlPosition.js";

function Map() {
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const {cities} = useCities();
    const {isLoading: isLoadingPosition, position: geoPosition, getPosition} = useGeolocation();
    const [lat, lng] = useUrlPosition();

    useEffect(() => {
        if (lat && lng) setMapPosition([lat, lng])
    }, [lat, lng]);

    useEffect(() => {
        if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng])
    }, [geoPosition]);

    return <div className={styles.mapContainer}>
        {!geoPosition && <Button type="position"
                                 onClick={getPosition}>{isLoadingPosition ? "Loading" : "Use Your Current Location"}</Button>}
        <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />

            {cities.map(city => <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                <Popup>
                    <span>{city.emoji}</span><span>{city.cityName}</span>
                </Popup>
            </Marker>)}
            <ChangeCenter position={mapPosition}/>
            <DetectClick/>
        </MapContainer>
    </div>
}

function ChangeCenter({position}) {
    const map = useMap();
    map.setView(position)
    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: e => {
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
    })
}

export default Map
