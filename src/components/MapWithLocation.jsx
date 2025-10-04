import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function MapWithLocation() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_VITE_GOOGLE_MAPS_API_KEY, // usa tu .env
  });

  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación: ", error);
          // Posición por defecto si falla la geolocalización
          setPosition({
            lat: 40.4168,
            lng: -3.7038,
          });
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización");
      // Posición por defecto si no hay soporte de geolocalización
      setPosition({
        lat: 40.4168,
        lng: -3.7038,
      });
    }
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (!position) return <div>Obteniendo ubicación...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
    >
      <Marker position={position} />
    </GoogleMap>
  );
}

export default MapWithLocation;
