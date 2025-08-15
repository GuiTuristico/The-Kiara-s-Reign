// ===== MAPA DINÁMICO CON GOOGLE MAPS =====

let map;
let userMarker;
let masterdMarker;

// Ubicación de MasterD Madrid
const MASTERD_LOCATION = {
    lat: 40.4378698,
    lng: -3.7037902,
    address: "C. de Alonso Cano, 44, 46, 28003 Madrid, España"
};

// Inicializar mapa
function initMap( ) {
    // Mapa centrado en MasterD por defecto
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: MASTERD_LOCATION,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#F5F5F5"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#D4B28C"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#7FB069"}]
            }
        ]
    });

    // Marcador de MasterD (siempre visible)
    masterdMarker = new google.maps.Marker({
        position: MASTERD_LOCATION,
        map: map,
        title: "MasterD Madrid - Kiaras Reign",
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#4A2C00" stroke="#FEFEFE" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="#FEFEFE" font-size="16" font-weight="bold">🏢</text>
                </svg>
            ` ),
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Info window para MasterD
    const masterdInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: 'Inter', sans-serif;">
                <h6 style="color: #4A2C00; margin-bottom: 8px; font-weight: bold;">
                    🏢 Kiaras Reign - MasterD Madrid
                </h6>
                <p style="margin: 4px 0; color: #8B8B8B; font-size: 14px;">
                    📍 ${MASTERD_LOCATION.address}
                </p>
                <p style="margin: 4px 0; color: #8B8B8B; font-size: 14px;">
                    📞 +34 91 123 4567
                </p>
                <p style="margin: 4px 0; color: #8B8B8B; font-size: 14px;">
                    ⏰ Lun-Vie: 9:00-18:00
                </p>
            </div>
        `
    });

    masterdMarker.addListener("click", () => {
        masterdInfoWindow.open(map, masterdMarker);
    });

    // Intentar obtener ubicación del usuario
    getUserLocation();
    
    console.log('🗺️ Mapa de Google Maps cargado correctamente');
}

// Obtener ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        // Mostrar mensaje de carga
        showLocationStatus("Obteniendo tu ubicación...", "info");
        
        navigator.geolocation.getCurrentPosition(
            // Éxito: usuario dio permisos
            function(position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                showUserLocation(userLocation);
                showLocationStatus("📍 Mostrando tu ubicación actual", "success");
            },
            // Error: usuario no dio permisos o error
            function(error) {
                console.log("Error de geolocalización:", error.message);
                showLocationStatus("📍 Mostrando ubicación de MasterD Madrid", "warning");
                // El mapa ya está centrado en MasterD por defecto
            },
            // Opciones
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutos
            }
        );
    } else {
        // Navegador no soporta geolocalización
        showLocationStatus("📍 Mostrando ubicación de MasterD Madrid", "warning");
    }
}

// Mostrar ubicación del usuario en el mapa
function showUserLocation(userLocation) {
    // Crear marcador del usuario
    userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación",
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#E09A4F" stroke="#FEFEFE" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="#FEFEFE" font-size="16" font-weight="bold">📍</text>
                </svg>
            ` ),
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Info window para usuario
    const userInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: 'Inter', sans-serif;">
                <h6 style="color: #E09A4F; margin-bottom: 8px; font-weight: bold;">
                    📍 Tu Ubicación
                </h6>
                <p style="margin: 4px 0; color: #8B8B8B; font-size: 14px;">
                    Lat: ${userLocation.lat.toFixed(6)}
                </p>
                <p style="margin: 4px 0; color: #8B8B8B; font-size: 14px;">
                    Lng: ${userLocation.lng.toFixed(6)}
                </p>
            </div>
        `
    });

    userMarker.addListener("click", () => {
        userInfoWindow.open(map, userMarker);
    });

    // Ajustar vista para mostrar ambos marcadores
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userLocation);
    bounds.extend(MASTERD_LOCATION);
    map.fitBounds(bounds);
    
    // Asegurar zoom mínimo
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        if (map.getZoom() > 15) {
            map.setZoom(15);
        }
    });
}

// Mostrar estado de ubicación
function showLocationStatus(message, type) {
    const statusDiv = document.getElementById('location-status');
    if (statusDiv) {
        const colorClass = {
            'info': 'text-info',
            'success': 'text-success', 
            'warning': 'text-warning',
            'error': 'text-danger'
        }[type] || 'text-muted';
        
        statusDiv.innerHTML = `<small class="${colorClass}">${message}</small>`;
    }
}

// Centrar en MasterD
function centerOnMasterD() {
    map.setCenter(MASTERD_LOCATION);
    map.setZoom(15);
}

// Centrar en usuario (si existe)
function centerOnUser() {
    if (userMarker) {
        map.setCenter(userMarker.getPosition());
        map.setZoom(15);
    } else {
        showLocationStatus("No se pudo obtener tu ubicación", "error");
    }
}

// Funciones globales
window.initMap = initMap;
window.centerOnMasterD = centerOnMasterD;
window.centerOnUser = centerOnUser;
