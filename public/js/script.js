document.addEventListener("DOMContentLoaded", async function () {
    // Initialize Map
    var map = L.map("map").setView([20, 80], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Fetch and Display Locations with Flags
    async function loadLocations() {
        const response = await fetch("/api/locations");
        const locations = await response.json();

        // Reverse locations to draw the path from oldest to newest
        const orderedLocations = locations.reverse();

        // Array to store coordinates for the polyline
        const pathCoordinates = orderedLocations.map(loc => [loc.lat, loc.lng]);

        // Draw a blue polyline connecting the locations
        if (pathCoordinates.length > 1) {
            L.polyline(pathCoordinates, {
                color: "blue",
                weight: 3,
                opacity: 0.7
            }).addTo(map);
        }

        // Add markers with flag icons for each location
        orderedLocations.forEach(loc => {
            const flagIcon = L.icon({
                iconUrl: loc.flagUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            L.marker([loc.lat, loc.lng], { icon: flagIcon })
                .addTo(map)
                .bindPopup(`
                    <b>${loc.city}, ${loc.country}</b><br>
                    <img src="${loc.flagUrl}" width="50">
                `);
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
            const response = await fetch("/api/track");
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Tracking failed");
            console.log("Tracked Location:", data);
            const flagIcon = L.icon({
                iconUrl: data.flagUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            L.marker([data.lat, data.lng], { icon: flagIcon })
                .addTo(map)
                .bindPopup(`<b>${data.city}, ${data.country}</b><br><img src="${data.flagUrl}" width="50">`)
                .openPopup();
            map.setView([data.lat, data.lng], 13);
        } catch (error) {
            console.error("Error tracking location:", error.message);
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
            const response = await fetch("/api/track/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, country, lat, lng })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Manual tracking failed");
            const flagIcon = L.icon({
                iconUrl: data.flagUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            L.marker([data.lat, data.lng], { icon: flagIcon })
                .addTo(map)
                .bindPopup(`<b>${data.city}, ${data.country}</b><br><img src="${data.flagUrl}" width="50">`)
                .openPopup();
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

        await fetch("/api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: comment })
        });

        document.getElementById("userComment").value = "";
        location.reload();
    }

    window.postComment = postComment;
});