const BACKEND_URL = "http://localhost:3000"; // Backend URL

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
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        if (historicalPolyline) {
            map.removeLayer(historicalPolyline);
            historicalPolyline = null;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/locations`);
            if (!response.ok) throw new Error("Failed to fetch locations");
            const locations = await response.json();

            const orderedLocations = locations.reverse();
            const pathCoordinates = orderedLocations.map(loc => [loc.lat, loc.lng]);

            if (pathCoordinates.length > 1) {
                historicalPolyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "5, 5"
                }).addTo(map);
            }

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

            if (pathCoordinates.length > 0) {
                map.fitBounds(pathCoordinates, { padding: [50, 50] });
            }
        } catch (error) {
            console.error("Error loading locations:", error.message);
        }
    }
    loadLocations();

    // Auto Track User Location with Custom Popup and Detailed Geocoding
    
        // Auto Track User Location with Custom Popup and Detailed Geocoding
        async function trackLocation() {
            const popup = document.createElement("div");
            popup.id = "location-popup";
            popup.innerHTML = `
                <div style="
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    text-align: center; font-family: Arial, sans-serif; z-index: 1000;
                    max-width: 300px;">
                    <h3 style="color: #2c3e50; margin: 0 0 15px;">Fish Needs Your Location!</h3>
                    <p style="color: #7=in8c8d; margin: 0 0 20px;">To visit your place, this fish needs your exact location. Allow access?</p>
                    <button id="allow-btn" style="
                        background: #3498db; color: white; border: none; padding: 10px 20px;
                        border-radius: 5px; cursor: pointer; margin-right: 10px;">Allow</button>
                    <button id="deny-btn" style="
                        background: #e74c3c; color: white; border: none; padding: 10px 20px;
                        border-radius: 5px; cursor: pointer;">Deny</button>
                </div>
            `;
            document.body.appendChild(popup);
    
            const allowBtn = document.getElementById("allow-btn");
            const denyBtn = document.getElementById("deny-btn");
    
            return new Promise((resolve) => {
                allowBtn.onclick = async () => {
                    document.body.removeChild(popup);
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const { latitude, longitude } = position.coords;
                            try {
                                const geocodeResponse = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                                );
                                if (!geocodeResponse.ok) throw new Error("Failed to reverse geocode");
                                const geocodeData = await geocodeResponse.json();
    
                                const detailedLocation = {
                                    latitude,
                                    longitude,
                                    address: geocodeData.address || {},
                                    city: geocodeData.address.city || geocodeData.address.town || geocodeData.address.village || "",
                                    country: geocodeData.address.country || "",
                                    postalCode: geocodeData.address.postcode || "",
                                    street: geocodeData.address.road || ""
                                };
    
                                const response = await fetch(`${BACKEND_URL}/api/track`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(detailedLocation)
                                });
                                const data = await response.json();
                                if (!response.ok) throw new Error(data.error || "Tracking failed");
                                resolve(data);
                            } catch (error) {
                                console.error("Error with detailed location:", error.message);
                                resolve(await fallbackToIPTracking());
                            }
                        }, async (geoError) => {
                            console.error("Geolocation permission denied by browser:", geoError.message);
                            alert("Geolocation access denied. Falling back to IP-based tracking.");
                            resolve(await fallbackToIPTracking());
                        });
                    } else {
                        alert("Geolocation not supported by your browser. Using IP-based tracking.");
                        resolve(await fallbackToIPTracking());
                    }
                };
    
                denyBtn.onclick = async () => {
                    document.body.removeChild(popup);
                    alert("Location access denied. Using IP-based tracking instead.");
                    resolve(await fallbackToIPTracking());
                };
            }).then(async (data) => {
                const currentResponse = await fetch(`${BACKEND_URL}/api/locations`);
                if (!currentResponse.ok) throw new Error("Failed to fetch current locations");
                const currentLocations = await currentResponse.json();
    
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
            }).catch(error => {
                console.error("Final tracking error:", error.message);
                alert(`Tracking failed: ${error.message}. Please try again later.`);
            });
        }
    
        // Fallback to original IP-based tracking
        async function fallbackToIPTracking() {
            try {
                const ipResponse = await fetch("https://api.ipify.org?format=json");
                if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
                const ipData = await ipResponse.json();
                const ipAddress = ipData.ip;
    
                const response = await fetch(`${BACKEND_URL}/api/track`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ipAddress })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "IP-based tracking failed");
                return data;
            } catch (error) {
                throw new Error(`IP tracking error: ${error.message}`);
            }
        }
    
     
    
        // ... (rest of the code remains unchanged) ...

    // Fallback to original IP-based tracking
    async function fallbackToIPTracking() {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        const response = await fetch(`${BACKEND_URL}/api/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ipAddress })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Tracking failed");
        return data;
    }

    trackLocation();

    // Post a New Comment
    async function postComment() {
        let comment = document.getElementById("userComment").value;
        if (comment.trim() === "") return alert("Please write something!");

        try {
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            if (!ipResponse.ok) throw new Error("Failed to fetch IP address");
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;
            const response = await fetch(`${BACKEND_URL}/api/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment, ipAddress: ipData.ip })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to post comment");

            const commentList = document.getElementById("commentList");
            const newComment = document.createElement("p");
            newComment.innerHTML = `
                ${data.flagUrl ? `<img src="${data.flagUrl}" alt="${data.country} flag" class="comment-flag">` : ""}
                ${comment} - <small>${new Date().toLocaleString()}</small>
            `;
            commentList.prepend(newComment);

            document.getElementById("userComment").value = "";
        } catch (error) {
            console.error("Error posting comment:", error.message);
            alert("Failed to post comment. Please try again.");
        }
    }
    
    window.postComment = postComment;
});

// Function to count up from the fish's journey start date
function startCountUp(startDate) {
    function updateTimer() {
        const now = new Date().getTime();
        const timeElapsed = now - startDate;

        const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Automatically start counting up when the page loads
document.addEventListener("DOMContentLoaded", function () {
    const journeyStartDate = new Date("April 01, 2025 00:00:00").getTime();
    startCountUp(journeyStartDate);
});

// Fetch and Display All Comments
async function loadComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const comments = await response.json();

        const commentList = document.getElementById("commentList");
        commentList.innerHTML = "";

        comments.forEach(comment => {
            const commentElement = document.createElement("p");
            commentElement.innerHTML = `
                ${comment.flagUrl ? `<img src="${comment.flagUrl}" alt="${comment.country} flag" class="comment-flag">` : ""}
                ${comment.text} - <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            commentList.appendChild(commentElement);
        });
    } catch (error) {
        console.error("Error loading comments:", error.message);
        alert("Failed to load comments. Please try again.");
    }
}

// Automatically load comments when the page loads
document.addEventListener("DOMContentLoaded", loadComments);