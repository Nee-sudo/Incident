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

        const response = await fetch("/api/locations");
        const locations = await response.json();

        // Reverse locations to draw the path from oldest to newest
        const orderedLocations = locations.reverse();

        // Array to store coordinates for the polyline
        const pathCoordinates = orderedLocations.map(loc => [loc.lat, loc.lng]);

        // Draw a solid blue polyline for the historical path
        if (pathCoordinates.length > 1) {
            historicalPolyline = L.polyline(pathCoordinates, {
                color: "blue",
                weight: 3,
                opacity: 0.7
            }).addTo(map);
        }

        // Add markers with custom flag shape for each location
        orderedLocations.forEach(loc => {
            const flagMarker = createFlagMarker(loc.flagUrl);
            const marker = L.marker([loc.lat, loc.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`
                    <b>${loc.city}, ${loc.country}</b><br>
                    <img src="${loc.flagUrl}" width="50">
                `);
            markers.push(marker);
        });

        // Center the map on the most recent location
        if (locations.length > 0) {
            const latestLocation = locations[0];
            map.setView([latestLocation.lat, latestLocation.lng], 5);
        }
    }
    loadLocations();

    // Auto Track User Location
    async function trackLocation() {
        try {
            // Fetch current locations to find the most recent one
            const currentResponse = await fetch("/api/locations");
            const currentLocations = await currentResponse.json();
            let mostRecentLocation = null;
            if (currentLocations.length > 0) {
                mostRecentLocation = currentLocations[0];
            }

            // Add the new location
            const response = await fetch("/api/track");
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Tracking failed");
            console.log("Tracked Location:", data);

            // Add marker for the new location
            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`<b>${data.city}, ${data.country}</b><br><img src="${data.flagUrl}" width="50">`)
                .openPopup();
            markers.push(newMarker);

            // Draw a dotted blue line from the most recent location to the new location
            if (mostRecentLocation) {
                const recentCoords = [mostRecentLocation.lat, mostRecentLocation.lng];
                const newCoords = [data.lat, data.lng];
                L.polyline([recentCoords, newCoords], {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 10"
                }).addTo(map);
            }

            // Update the historical path directly
            const updatedLocations = [...currentLocations, data].reverse();
            const pathCoordinates = updatedLocations.map(loc => [loc.lat, loc.lng]);
            if (historicalPolyline) {
                map.removeLayer(historicalPolyline);
            }
            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7
                }).addTo(map);
            }

            // Center the map on the new location
            map.setView([data.lat, data.lng], 13);
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
        const lat = document.getElementById("lat").value;
        const lng = document.getElementById("lng").value;
        try {
            // Fetch current locations to find the most recent one
            const currentResponse = await fetch("/api/locations");
            const currentLocations = await currentResponse.json();
            let mostRecentLocation = null;
            if (currentLocations.length > 0) {
                mostRecentLocation = currentLocations[0];
            }

            // Add the new manual location
            const response = await fetch("/api/track/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, country, lat, lng })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Manual tracking failed");

            // Add marker for the new location
            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`<b>${data.city}, ${data.country}</b><br><img src="${data.flagUrl}" width="50">`)
                .openPopup();
            markers.push(newMarker);

            // Draw a dotted blue line from the most recent location to the new location
            if (mostRecentLocation) {
                const recentCoords = [mostRecentLocation.lat, mostRecentLocation.lng];
                const newCoords = [data.lat, data.lng];
                L.polyline([recentCoords, newCoords], {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 10"
                }).addTo(map);
            }

            // Update the historical path directly
            const updatedLocations = [...currentLocations, data].reverse();
            const pathCoordinates = updatedLocations.map(loc => [loc.lat, loc.lng]);
            if (historicalPolyline) {
                map.removeLayer(historicalPolyline);
            }
            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7
                }).addTo(map);
            }

            // Center the map on the new location
            map.setView([data.lat, data.lng], 13);
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
            const response = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to post comment");

            // Add the new comment to the commentList div
            const commentList = document.getElementById("commentList");
            const newComment = document.createElement("p");
            newComment.innerHTML = `${comment} - <small>${new Date().toLocaleString()}</small>`;
            commentList.prepend(newComment); // Add to the top

            // Clear the textarea
            document.getElementById("userComment").value = "";
        } catch (error) {
            console.error("Error posting comment:", error.message);
            alert("Failed to post comment. Please try again.");
        }
    }

    window.postComment = postComment;
});