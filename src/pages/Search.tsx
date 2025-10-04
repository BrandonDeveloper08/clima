import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar as CalendarIcon, Cloud } from "lucide-react";
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
import { cn } from "@/lib/utils";
import ParameterToggle from "@/components/ParameterToggle";

const Search = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateText, setDateText] = useState(""); // texto del input
  const [selectedParams, setSelectedParams] = useState<string[]>([
    "TEMPERATURA",
  ]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const parameters = ["TEMPERATURA", "HUMEDAD", "PRECIPITACIONES", "VIENTO"];

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
    // No actualizar el campo de ubicación aquí, solo centrar el mapa
    
    // Centrar el mapa en el distrito seleccionado
    if (window.google && window.google.maps && district && mapRef.current) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${district}, Perú` }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          // Usar la referencia del mapa para hacer zoom programáticamente
          mapRef.current.panTo(location);
          mapRef.current.setZoom(12);
        }
      });
    }
  };

  const handleLocationSearch = () => {
    if (location && window.google && window.google.maps && mapRef.current) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${location}, Perú` }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const locationResult = results[0].geometry.location;
          // Usar la referencia del mapa para hacer zoom programáticamente
          mapRef.current.panTo(locationResult);
          mapRef.current.setZoom(12);
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
      navigate(`/results?${searchParams.toString()}`);
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

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    };
    setSelectedPosition(newPosition);
    
    // Método simple y directo
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK' && results[0]) {
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
    <div className="min-h-screen bg-gradient-primary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Cloud className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">SkyCast</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Consulta el pronóstico del clima con precisión
          </p>
        </div>

        {/* Location Input */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <div className="flex gap-4">
            {/* Campo de texto para ubicación */}
            <Input
              placeholder="Escribe tu ubicación aquí"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleLocationKeyPress}
              className="flex-1 text-center text-lg h-14 bg-secondary border-0 placeholder:text-muted-foreground"
            />
            
            {/* Lista desplegable de distritos */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              className="flex-1 h-14 px-4 text-center text-base bg-secondary border-0 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar distrito</option>
              {peruDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <APIProvider apiKey={"AIzaSyArLVHe9xh3ITcIVLz8_ibHpz3w_Oa7HIQ"}>
            <Map
              onLoad={handleMapLoad}
              style={{ width: "100%", height: "400px" }}
              defaultCenter={{ lat: -12.0464, lng: -77.0428 }}
              defaultZoom={7}
              gestureHandling="greedy"
              disableDefaultUI
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
        </div>

        {/* Date Selection */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <div className="flex gap-4">
            {/* Caja de texto con formato automático */}
            <Input
              type="text"
              placeholder="Ingrese la fecha (dd/mm/aaaa)"
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
                  className="h-14 px-8 bg-secondary border-0 hover:bg-accent"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  CALENDARIO
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {parameters.map((param) => (
              <ParameterToggle
                key={param}
                parameter={param}
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
          className="w-full h-14 text-lg font-medium bg-muted hover:bg-accent text-foreground disabled:opacity-50 rounded-2xl"
        >
          Consultar Pronóstico
        </Button>
      </div>
    </div>
  );
};


export default Search;
