const BACKEND_URL = "https://fishonworldtour.up.railway.app"; // Backend URL

document.addEventListener("DOMContentLoaded", async function () {
    // Initialize Map
    var map = L.map("map").setView([20, 80], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Store the historical polyline and markers
    let historicalPolyline = null;
    const markers = [];

    // Function to create a custom flag marker
    function createFlagMarker(flagUrl) {
        return L.divIcon({
            className: "custom-flag-marker",
            html: `
                <div class="flag-container">
                    <div class="flag" style="background-image: url('${flagUrl}')"></div>
                    <div class="pin"></div>
                </div>
            `,
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
        });
    }

    // Fetch and Display Locations with Flags
    async function loadLocations() {
        // Clear existing markers and polyline
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        if (historicalPolyline) {
            map.removeLayer(historicalPolyline);
            historicalPolyline = null;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/locations`); // Use BACKEND_URL
            if (!response.ok) throw new Error("Failed to fetch locations");
            const locations = await response.json();

            // Reverse locations to draw the path from oldest to newest
            const orderedLocations = locations.reverse();

            // Array to store coordinates for the polyline
            const pathCoordinates = orderedLocations.map(loc => [loc.lat, loc.lng]);

            // Draw a dashed blue polyline for the historical path
            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 5"
                }).addTo(map);
            }

            // Add markers with custom flag shape for each location
            orderedLocations.forEach(loc => {
                const flagMarker = createFlagMarker(loc.flagUrl);
                const marker = L.marker([loc.lat, loc.lng], { icon: flagMarker })
                    .addTo(map)
                    .bindPopup(`
                        <b>${loc.actualCity}, ${loc.actualCountry}</b><br>
                        ${loc.intendedCountry ? `Intended: ${loc.intendedCity ? loc.intendedCity + ", " : ""}${loc.intendedCountry}<br>` : ""}
                        <img src="${loc.flagUrl}" width="50">
                    `);
                markers.push(marker);
            });

            // Fit the map to show all markers (the entire network)
            if (pathCoordinates.length > 0) {
                map.fitBounds(pathCoordinates, { padding: [50, 50] });
            }
        } catch (error) {
            console.error("Error loading locations:", error.message);
        }
    }
    loadLocations();

    // Auto Track User Location
    async function trackLocation() {
        try {
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            console.log("Fetched IP:", ipData.ip);
            const ipAddress = ipData.ip;

            const currentResponse = await fetch(`${BACKEND_URL}/api/locations`); // Use BACKEND_URL
            console.log("Current locations response:", currentResponse);
            if (!currentResponse.ok) throw new Error("Failed to fetch current locations");
            const currentLocations = await currentResponse.json();
            console.log("Current locations:", currentLocations);

            const response = await fetch(`${BACKEND_URL}/api/track`, { // Use BACKEND_URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ipAddress })
            });
            const data = await response.json();
            console.log("Track location response:", data);
            if (!response.ok) throw new Error(data.error || "Tracking failed");
            console.log("Tracked Location:", data);

            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`
                    <b>${data.actualCity}, ${data.actualCountry}</b><br>
                    ${data.intendedCountry ? `Intended: ${loc.intendedCity ? loc.intendedCity + ", " : ""}${loc.intendedCountry}<br>` : ""}
                    <img src="${data.flagUrl}" width="50">
                `)
                .openPopup();
            markers.push(newMarker);

            const updatedLocations = [...currentLocations, data].reverse();
            const pathCoordinates = updatedLocations.map(loc => [loc.lat, loc.lng]);
            if (historicalPolyline) {
                map.removeLayer(historicalPolyline);
            }
            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 5"
                }).addTo(map);
            }

            if (pathCoordinates.length > 0) {
                map.fitBounds(pathCoordinates, { padding: [50, 50] });
            }
        } catch (error) {
            console.error("Error tracking location:", error.message);
            alert("Could not track your location. Please try manual input.");
        }
    }
    trackLocation();

    // Manual Location Input
    document.getElementById("manualTrackForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        try {
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;

            const currentResponse = await fetch(`${BACKEND_URL}/api/locations`); // Use BACKEND_URL
            const currentLocations = await currentResponse.json();

            const response = await fetch(`${BACKEND_URL}/api/track/manual`, { // Use BACKEND_URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, country, ipAddress })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Manual tracking failed");

            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`
                    <b>${data.actualCity}, ${data.actualCountry}</b><br>
                    ${data.intendedCountry ? `Intended: ${loc.intendedCity ? loc.intendedCity + ", " : ""}${loc.intendedCountry}<br>` : ""}
                    <img src="${data.flagUrl}" width="50">
                `)
                .openPopup();
            markers.push(newMarker);

            const updatedLocations = [...currentLocations, data].reverse();
            const pathCoordinates = updatedLocations.map(loc => [loc.lat, loc.lng]);
            if (historicalPolyline) {
                map.removeLayer(historicalPolyline);
            }
            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 5"
                }).addTo(map);
            }

            if (pathCoordinates.length > 0) {
                map.fitBounds(pathCoordinates, { padding: [50, 50] });
            }
        } catch (error) {
            console.error("Error tracking manually:", error.message);
            alert(error.message);
        }
    });

    // Post a New Comment
    async function postComment() {
        let comment = document.getElementById("userComment").value;
        if (comment.trim() === "") return alert("Please write something!");

        try {
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;
            const response = await fetch(`${BACKEND_URL}/api/comment`, { // Use BACKEND_URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment, ipAddress: ipData.ip })
            });
            const data = await response.json();
            console.log("Post comment response:", data); // Debug: Check the response
            console.log("flagUrl:", data.flagUrl); // Debug: Ensure flagUrl is present
            console.log("country:", data.country); // Debug: Ensure country is present
            if (!response.ok) throw new Error(data.error || "Failed to post comment");

            // Add the new comment to the commentList div
            const commentList = document.getElementById("commentList");
            const newComment = document.createElement("p");
            newComment.innerHTML = `
                ${data.flagUrl ? `<img src="${data.flagUrl}" alt="${data.country} flag" class="comment-flag">` : ""}
                ${comment} - <small>${new Date().toLocaleString()}</small>
            `;
            commentList.prepend(newComment);

            // Clear the textarea
            document.getElementById("userComment").value = "";
        } catch (error) {
            console.error("Error posting comment:", error.message);
            alert("Failed to post comment. Please try again.");
        }
    }

    window.postComment = postComment;
});