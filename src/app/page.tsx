'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Cloud } from "lucide-react";
import ColourfulText from "@/components/ui/colourful-text";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ParameterToggle from "@/components/ParameterToggle";
import { WeatherBackground } from "@/components/WeatherBackground";

const Search = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateText, setDateText] = useState(""); // texto del input
  const [selectedParams, setSelectedParams] = useState<string[]>([
    "TEMPERATURA",
  ]);
  const [currentWeather, setCurrentWeather] = useState({
    TEMPERATURA: "22°C",
    HUMEDAD: "75%",
    PRECIPITACIONES: "0 mm",
    VIENTO: "10 km/h",
  });
  const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
  const [mapZoom, setMapZoom] = useState(7);

  const parameters = ["TEMPERATURA", "HUMEDAD", "PRECIPITACIONES", "VIENTO"];

  useEffect(() => {
    // Función para obtener el clima actual.
    const fetchCurrentWeather = (lat: number, lon: number) => {
      // --- SIMULACIÓN DE LLAMADA A API ---
      // Aquí harías una llamada a tu API del clima con las coordenadas (lat, lon).
      // Ejemplo: `fetch(https://api.weather.com?lat=${lat}&lon=${lon})`
      // Por ahora, usaremos datos de ejemplo.
      console.log(`Simulando fetch de clima para: ${lat}, ${lon}`);
      const mockWeatherData = {
        TEMPERATURA: `${Math.floor(Math.random() * 10 + 15)}°C`, // Temp entre 15 y 25
        HUMEDAD: `${Math.floor(Math.random() * 30 + 60)}%`, // Humedad entre 60 y 90
        PRECIPITACIONES: `${(Math.random() * 2).toFixed(1)} mm`,
        VIENTO: `${Math.floor(Math.random() * 15 + 5)} km/h`,
      };
      setCurrentWeather(mockWeatherData);
      // --- FIN DE SIMULACIÓN ---
    };

    // Obtener la ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentWeather(latitude, longitude);
        },
        () => {
          // Si el usuario no da permiso, usar la ubicación por defecto (Lima)
          fetchCurrentWeather(mapCenter.lat, mapCenter.lng);
        }
      );
    } else {
      // Si el navegador no soporta geolocalización, usar la ubicación por defecto
      fetchCurrentWeather(mapCenter.lat, mapCenter.lng);
    }
  }, [mapCenter.lat, mapCenter.lng]);

  // Lista de distritos principales de Perú
  const peruDistricts = [
    "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Chimbote",
    "Huancayo", "Tacna", "Ica", "Juliaca", "Sullana", "Chincha Alta", "Huaraz", "Ayacucho",
    "Cajamarca", "Pucallpa", "Tumbes", "Huaral", "Cerro de Pasco", "Huánuco", "Abancay",
    "Moquegua", "Puno", "Puerto Maldonado", "Talara", "Chosica", "Huaraz", "Barranca",
    "Miraflores", "San Isidro", "Surco", "La Molina", "San Borja", "Pueblo Libre", "Magdalena",
    "Jesús María", "Lince", "Breña", "Rímac", "San Miguel", "Callao", "Bellavista", "Carmen de la Legua",
    "Ventanilla", "La Perla", "La Punta", "Independencia", "Comas", "San Martín de Porres",
    "Los Olivos", "Pachacámac", "Lurín", "Punta Hermosa", "Punta Negra", "San Bartolo",
    "Santa María del Mar", "Pucusana", "Chorrillos", "Villa El Salvador", "Villa María del Triunfo",
    "San Juan de Miraflores", "Lurigancho", "Chaclacayo", "Cieneguilla", "Santa Eulalia",
    "San Antonio", "San Luis", "El Agustino", "Santa Anita", "Ate", "La Victoria", "Cercado de Lima"
  ];

  const handleToggleParam = (param: string) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    // También actualizamos el campo de ubicación con el distrito seleccionado
    setLocation(district);

    // Centrar el mapa en el distrito seleccionado
    if (typeof window !== 'undefined' && window.google && window.google.maps && district) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${district}, Perú` }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          setMapCenter({
            lat: location.lat(),
            lng: location.lng()
          });
          setMapZoom(12); // Zoom más cercano para distritos
        }
      });
    }
  };

  const handleLocationSearch = () => {
    if (location && typeof window !== 'undefined' && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${location}, Perú` }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const locationResult = results[0].geometry.location;
          setMapCenter({
            lat: locationResult.lat(),
            lng: locationResult.lng()
          });
          setMapZoom(12); // Zoom más cercano para ubicaciones específicas
        }
      });
    }
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  const handleSearch = () => {
    if (location && date && selectedParams.length > 0) {
      const searchParams = new URLSearchParams({
        location,
        date: format(date, "dd/MM/yyyy"),
        params: selectedParams.join(","),
      });
      router.push(`/results?${searchParams.toString()}`);
    }
  };

  // función para formatear automáticamente "dd/mm/aa"
  const handleDateInput = (value: string) => {
    // Eliminar todo lo que no sea número
    let cleaned = value.replace(/\D/g, "");

    // Insertar automáticamente las barras
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
        4,
        8
      )}`;
    }
  
    setDateText(cleaned);

    // Intentar crear la fecha solo cuando haya al menos día/mes/año
    if (cleaned.length === 10) {
      const [day, month, year] = cleaned.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  };

  const handleMapClick = (event: any) => {
    const newPosition = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    };
    setSelectedPosition(newPosition);
  
    // Método simple y directo
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          // Usar directamente la dirección formateada de Google
          const formattedAddress = results[0].formatted_address;

          // Extraer solo la parte relevante (sin país)
          const parts = formattedAddress.split(', ');
          if (parts.length >= 2) {
            // Tomar las primeras 2 partes (lugar + distrito/ciudad)
            const locationText = parts.slice(0, 2).join(', ');
            setLocation(locationText);
          } else {
            setLocation(formattedAddress);
          }
        } else {
          setLocation("Ubicación seleccionada");
        }
      });
    } else {
      setLocation("Ubicación seleccionada");
    }
  };

  return (
    <>
      <WeatherBackground />
      <main className="relative min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-4 text-center mb-8 w-[750px] h-[140px] mx-auto backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Cloud className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              <ColourfulText text="Sky Cast" />
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Consulta el pronóstico del clima con precisión
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Location and Map */}
          <div className="flex flex-col gap-6">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Seleccione su ubicación</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Campo de texto para ubicación */}
                <Input
                  placeholder="Escribe mi ubicación aquí"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleLocationKeyPress}
                  className="sm:flex-[2] flex-1 text-center text-lg h-14 bg-secondary border-0 placeholder:text-muted-foreground"
                />

                {/* Lista desplegable de distritos */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictSelect(e.target.value)}
                  className="flex-1 h-14 px-4 text-center text-base bg-secondary border-0 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">seleccione distrito</option>
                  {peruDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="relative">
                <APIProvider apiKey={"AIzaSyArLVHe9xh3ITcIVLz8_ibHpz3w_Oa7HIQ"}>
                  <Map
                    style={{ width: "100%", height: "400px" }}
                    center={mapCenter}
                    zoom={mapZoom}
                    gestureHandling="cooperative"
                    scrollwheel={false}
                    disableDefaultUI={true}
                    onClick={handleMapClick}
                  >
                    {/* Marcador del punto seleccionado */}
                    {selectedPosition && (
                      <Marker
                        position={selectedPosition}
                        title="Ubicación seleccionada"
                      />
                    )}
                  </Map>
                </APIProvider>

                {/* Custom Zoom Controls */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.min(21, z + 1))}
                    className="h-10 w-10 rounded-lg bg-secondary text-foreground shadow-card border border-border hover:bg-accent"
                    aria-label="Acercar"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.max(3, z - 1))}
                    className="h-10 w-10 rounded-lg bg-secondary text-foreground shadow-card border border-border hover:bg-accent"
                    aria-label="Alejar"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Date, Parameters, and Search */}
          <div className="flex flex-col gap-6">
            {/* Date Selection */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Ingrese la fecha</h3>
              <div className="flex gap-4">
                {/* Caja de texto con formato automático */}
                <Input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={dateText}
                  maxLength={10}
                  onChange={(e) => handleDateInput(e.target.value)}
                  className="flex-1 h-14 text-center text-base bg-secondary border-0 placeholder:text-muted-foreground"
                />

                {/* Botón para abrir calendario */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-14 px-6 bg-secondary border-0 hover:bg-accent"
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 hide-caption-labels" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        if (d) setDateText(format(d, "dd/MM/yyyy"));
                      }}
                      initialFocus
                      locale={es}
                      className="pointer-events-auto"
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear()}
                      toYear={2100}
                      classNames={{ caption_label: "hidden" }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Parameter Selection */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Parámetros del clima</h3>
              <div className="grid grid-cols-2 gap-3">
                {parameters.map((param) => (
                  <ParameterToggle
                    key={param}
                    parameter={param}
                    value={currentWeather[param as keyof typeof currentWeather]}
                    isSelected={selectedParams.includes(param)}
                    onToggle={() => handleToggleParam(param)}
                  />
                ))}
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!location || !date || selectedParams.length === 0}
              className="mt-auto h-16 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md"
            >
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
              <span>Consultar Pronóstico</span>
            </Button>
          </div>
        </div>
      </div>
      </main>
    </>
  );
};

export default Search;
