// map.js
document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapContainer');
    const locationSelect = document.getElementById('locationSelect'); 
    let map;
    let currentLayer;
    let markersLayer;

    // --- FUNCTION TO CLOSE/HIDE MAP ---
    window.closeMapSection = function() {
        if (mapContainer) mapContainer.style.display = 'none';
        
        const mapControls = document.getElementById('map-controls');
        if (mapControls) mapControls.style.display = 'none';

        console.log("Map closed, but analytics remain visible.");
    };

    window.handleLocationChange = function() {
        if (!locationSelect || !locationSelect.value) return;
        
        // 1. Get the Raw ID from the dropdown (e.g., "2")
        const projectID = locationSelect.value.trim(); 

        // 2. TRANSLATE ID TO NAME (For MAPS and PROJECT_MARKERS coordinate lookup)
        // We use the ID for the database, but the Name for the Map Image and Pins coordinates.
        let projectKey = projectID;
        if (projectID === "2") {
            projectKey = "PADRE GARCIA";
        }

        const projectData = (typeof MAPS !== 'undefined') ? MAPS[projectKey] : null;

        if (!projectData) {
            console.error("Project Key not found in MAPS:", projectKey);
            if (typeof MAPS !== 'undefined') {
                console.log("Available keys in MAPS object:", Object.keys(MAPS));
            }
            alert(`Map data not found for "${projectKey}". Please check your MAPS configuration.`);
            return;
        }

        // --- SHOW UI ELEMENTS ---
        if (mapContainer) mapContainer.style.display = 'block';

        const mapControls = document.getElementById('map-controls');
        if (mapControls) mapControls.style.display = 'flex';

        const analyticsBox = document.getElementById('project-analytics-box');
        if (analyticsBox) analyticsBox.style.display = 'block';

        // Initialize Map if it doesn't exist
        if (!map && mapContainer) {
            map = L.map('mapContainer', { 
                crs: L.CRS.Simple, 
                minZoom: -1, 
                maxZoom: 2,
                zoomControl: true 
            });
            
            map.on('click', function(e) {
                console.log("Coordinates for marker.js:", [Math.round(e.latlng.lat), Math.round(e.latlng.lng)]);
            });
        }

        // Clear previous layers to prevent overlap
        if (currentLayer && map) map.removeLayer(currentLayer);
        if (markersLayer && map) map.removeLayer(markersLayer);

        // Add Image Overlay
        const bounds = [[0, 0], [projectData.size[1], projectData.size[0]]];
        currentLayer = L.imageOverlay(projectData.image, bounds).addTo(map);
        map.fitBounds(bounds);

        // Update Charts (Using the Name key)
        if (typeof window.updateProjectCharts === "function") {
            window.updateProjectCharts(projectKey);
        }

        // Create new Layer Group for markers
        markersLayer = L.layerGroup().addTo(map);
        
        // Load Markers using the Name key (e.g., "PADRE GARCIA")
        const projectMarkers = (typeof PROJECT_MARKERS !== 'undefined') ? PROJECT_MARKERS[projectKey] || [] : [];
        console.log(`Found ${projectMarkers.length} markers for ${projectKey}`);

        projectMarkers.forEach(markerData => {
            const lotNum = String(markerData.lot).trim(); 
            const blockNum = String(markerData.block).trim();
            
            // --- RESIDENT LOOKUP (Using projectID: 2) ---
            // This ensures it matches the subdivision_id in your SQL database
            const resident = (typeof window.getResidentByLotBlock === "function")
                ? window.getResidentByLotBlock(lotNum, blockNum, projectID) 
                : null;

            // COLOR LOGIC
            let pinClass = "vacant-lot"; // Default: Orange
            let statusText = "Vacant";

            if (resident) {
                const status = String(resident.resident_status || "").toLowerCase().trim();
                
                if (status === "active") {
                    pinClass = "active-resident"; // Green
                    statusText = "Occupied (Active)";
                } else {
                    pinClass = "inactive-resident"; // Red
                    statusText = `Occupied (${resident.resident_status})`;
                }
            }

            // Create the Pin Icon
            const icon = L.divIcon({
                className: `custom-pin ${pinClass}`,
                html: `<div class="pin"></div>`, 
                iconSize: [20, 20],
                iconAnchor: [10, 10] 
            });

            // Add Marker to Map
            const marker = L.marker(markerData.pos, { icon });
            
            // Build Tooltip
            const buyerName = resident ? `<br><b>${resident.buyer_name}</b>` : "";
            marker.bindTooltip(`Block ${blockNum} Lot ${lotNum} ${buyerName} <br> ${statusText}`);
            
            marker.on('click', (e) => {
                L.DomEvent.stopPropagation(e); 
                if (typeof window.openLotModal === "function") {
                    // CRITICAL: Pass projectID (2) so the modal knows how to find the resident again
                    window.openLotModal(projectID, blockNum, lotNum);
                }
            });
            
            markersLayer.addLayer(marker);
        });

        // Smooth scroll to map
        if (mapContainer) {
            mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
});