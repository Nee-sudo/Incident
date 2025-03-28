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
            const response = await fetch("/api/locations");
            if (!response.ok) throw new Error("Failed to fetch locations");
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
                        <b>${loc.actualCity}, ${loc.actualCountry}</b><br>
                        ${loc.intendedCountry ? `Intended: ${loc.intendedCity ? loc.intendedCity + ", " : ""}${loc.intendedCountry}<br>` : ""}
                        <img src="${loc.flagUrl}" width="50">
                    `);
                markers.push(marker);
            });

            // Center the map on the most recent location
            if (locations.length > 0) {
                const latestLocation = locations[0];
                map.setView([latestLocation.lat, latestLocation.lng], 5);
            }
        } catch (error) {
            console.error("Error loading locations:", error.message);
        }
    }
    loadLocations();

    // Auto Track User Location
    async function trackLocation() {
        try {
            // Fetch the user's IP address using ipify.org
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            console.log("Fetched IP:", ipData.ip);
            const ipAddress = ipData.ip;

            // Fetch current locations to find the most recent one
            const currentResponse = await fetch("/api/locations");
            console.log("Current locations response:", currentResponse);
            if (!currentResponse.ok) throw new Error("Failed to fetch current locations");
            const currentLocations = await currentResponse.json();
            console.log("Current locations:", currentLocations);
            // Find the most recent location from the current locations
            let mostRecentLocation = null;
            if (currentLocations.length > 0) {
                mostRecentLocation = currentLocations[0];
                console.log("Most recent location:", mostRecentLocation);
            }

            // Add the new location by sending the IP address to the backend
            const response = await fetch("/api/track", {
                method: "POST", // Changed to POST to send the IP address
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ipAddress }) // Use the fetched IP address here
            });
            const data = await response.json();
            console.log("Track location response:", data);
            // Check if the response is ok and handle errors
            if (!response.ok) throw new Error(data.error || "Tracking failed");
            console.log("Tracked Location:", data);

            // Add marker for the new location
            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`
                    <b>${data.actualCity}, ${data.actualCountry}</b><br>
                    ${data.intendedCountry ? `Intended: ${data.intendedCity ? data.intendedCity + ", " : ""}${data.intendedCountry}<br>` : ""}
                    <img src="${data.flagUrl}" width="50">
                `)
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
    // Call trackLocation immediately when the page loads
    trackLocation();

    // Manual Location Input
    document.getElementById("manualTrackForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        try {
            // Fetch the user's IP address using ipify.org
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;

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
                body: JSON.stringify({ city, country, ipAddress })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Manual tracking failed");

            // Add marker for the new location
            const flagMarker = createFlagMarker(data.flagUrl);
            const newMarker = L.marker([data.lat, data.lng], { icon: flagMarker })
                .addTo(map)
                .bindPopup(`
                    <b>${data.actualCity}, ${data.actualCountry}</b><br>
                    ${data.intendedCountry ? `Intended: ${data.intendedCity ? data.intendedCity + ", " : ""}${data.intendedCountry}<br>` : ""}
                    <img src="${data.flagUrl}" width="50">
                `)
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
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;
            const response = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment,ipAddress: ipData.ip }) // Include the IP address in the comment
            });
            const data = await response.json();
            console.log("Post comment response:", data);
            console.log("flagUrl:", data.flagUrl); // Log the flag URL for debugging    
            console.log("country:", data.country); // Log the country for debugging
            // Check if the response is ok and handle errors
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