import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Mapa = () => {
  const hotelPosition = [21.477435, -101.197547]; // Ubicación del hotel
  const mapCenter = [21.477435, -101.207547]; // Centro desplazado para mostrar mejor la ciudad

  return (
    <div>
      <MapContainer center={mapCenter} zoom={14} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={hotelPosition}>
          <Popup>
            <div>
              <strong>Hotel Suspiro</strong><br />

              {/* 🕐 5 min del centro en auto<br /><br /> */}

              <a
                href="https://www.google.com/maps?q=21.477435,-101.197547"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", marginBottom: "8px", textDecoration: "none", color: "#000" }}
              >
                <img
                  src="https://w7.pngwing.com/pngs/807/270/png-transparent-google-maps-logo-google-maps-icon-with-pinpoint-marker-thumbnail.png"
                  alt="Google Maps"
                  width="20"
                  height="20"
                  style={{ marginRight: "8px" }}
                />
                Abrir en Google Maps
              </a>

              <a
                href="https://waze.com/ul?ll=21.477435,-101.197547&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#000" }}
              >
                <img
                  src="https://brandlogos.net/wp-content/uploads/2025/05/waze_app_icon-logo_brandlogos.net_l82da.png"
                  alt="Waze"
                  width="20"
                  height="20"
                  style={{ marginRight: "8px" }}
                />
                Abrir en Waze
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Mapa;
