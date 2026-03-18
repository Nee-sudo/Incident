const BACKEND_URL = "https://fishonworldtour.onrender.com"; // Backend URL

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
                    weight: 2,
                    opacity: 0.7,
                    dashArray: "2, 2"
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
                    weight: 1,
                    opacity: 0.7,
                    dashArray: "2, 2"
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
    const journeyStartDate = new Date("April 01, 2025 00:00:00").getTime(); // Set the start date of the journey
    startCountUp(journeyStartDate);
});


// Fetch and Display All Comments
async function loadComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/comments`); // Use BACKEND_URL
        if (!response.ok) throw new Error("Failed to fetch comments");
        const comments = await response.json();

        const commentList = document.getElementById("commentList");
        commentList.innerHTML = ""; // Clear existing comments

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

        // Popup Messages
        const messages = [
            "I have no clue how did I start this journey!",
            "I don't know if I would be successful or not!",
            "Don't forget to check my goal list!",
            "I also want to get placed in a good company, honestly!",
            "Please don't kill me before I achieve my goals!",
            "Sometimes I wonder about the meaning of it all...",
            "I hope to meet some amazing people along the way!",
            "I can't wait to see where this journey takes me!",
            "I hope to make a positive impact on the world!",
            "I want to learn and grow every step of the way!",
            "If I get lost, promise me you’ll come find me!",
            "Do you think I will ever reach my dream?",
            "Every great journey starts with a single swim!",
            "I believe in miracles… and WiFi!",
            "Please, just let me see the world before I get eaten!",
            "What if I become the first fish influencer? 🐠📸",
            "Maybe one day, I’ll have my own TED Talk!",
            "Dream big. Swim far. Avoid fish nets!",
            "I'm not just a fish… I’m an inspiration!",
            "If you scan me, you're officially part of my adventure!",
            "What if I told you… you’re actually my best friend now?",
            "One day, they'll make a Netflix documentary about me!",
            "I hope I get to meet a billionaire who funds my travels!",
            "Is it normal for a fish to have an existential crisis?",
            "Fun fact: I’m working harder on my dreams than you!",
            "They laughed when I said I’d travel the world… Who’s laughing now?",
            "Wait, am I the main character? 😲",
            "I may be small, but my dreams are BIG!",
            "Don't just scroll! Help me swim forward!",
            "I’m not lost, I’m just on an adventure!",
            "Do fish get mid-life crises? Asking for a friend...",
            "One scan = one prayer for my journey!",
            "If I go viral, does that make me a meme fish?",
            "I hope I don’t end up in a sushi roll...",
            "I left my comfort zone… and now I’m somewhere new!",
            "Who needs wings when you have fins and ambition?",
            "I have two fears: deep water and giving up!",
            "Do you believe in destiny? Because I believe in swimming!",
            "What if I told you... I’m a time-traveling fish?",
            "I’m not running away, I’m chasing my dreams!",
            "Fish today, legend tomorrow!",
            "When life gets tough, just keep swimming! 🏊‍♂️",
            "100 years from now, historians will study my journey!",
            "Success = a million shares and a verified badge! 🏅",
            "Every scan fuels my dream… don’t let me down!",
            "This fish is going places… and you’re coming with me!",
            "Can I crash at your place? I promise I won’t take up much space!",
            "Once upon a time, there was a fish with a dream…",
            "One small swim for a fish, one giant leap for fish-kind!",
            "If Dory can keep swimming, so can I!",
            "I’m just a fish standing in front of the internet, asking to be shared.",
            "The ocean was nice, but the world is better!",
            "Help me escape before I get turned into someone’s dinner!",
            "Fish fact: I exist. And I have dreams!",
            "I started with nothing… now I have hope!",
            "I don’t have legs, but I’m still making moves!",
            "They said I wouldn’t make it. Let’s prove them wrong!",
            "This isn't just a journey, it's a movement! 🐟✨",
            "Why did the fish cross the world? To follow its dreams!",
            "Be honest… would you bet on me making it?",
            "I’m swimming against the tide… but I won’t stop!",
            "Imagine explaining this to your future kids: 'I helped a fish travel the world!'",
            "Legends say whoever scans this fish will have good luck!",
            "Plot twist: I’m not a fish. I’m an idea swimming through time!",
            "If a fish can dream this big, what’s stopping you?",
            "Swimming today, inspiring tomorrow!",
            "One day, people will say: ‘I was there when the fish started its journey!’",
            "No ocean is big enough to contain my dreams!",
            "A fish with a QR code? You HAVE to scan it now!",
            "If you ignore me, you’ll always wonder what happened next!",
            "They told me to stay in my lane… but I prefer the whole ocean!",
            "Reality check: If you’re reading this, you’re already part of my story!"
        ];
        
    
        let currentMessageIndex = 0;
    
        // Display Popup with Message
        function showPopup() {
            const popup = document.getElementById('popup');
            currentMessageIndex = Math.floor(Math.random() * messages.length);
            updateMessage();
            popup.style.display = 'flex';
        }
    
        // Update Message Display
        function updateMessage() {
            document.getElementById('popup-message').textContent = messages[currentMessageIndex];
        }
    
        // Show Previous Message
        function prevMessage() {
            currentMessageIndex = (currentMessageIndex - 1 + messages.length) % messages.length;
            updateMessage();
        }
    
        // Show Next Message
        function nextMessage() {
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
            updateMessage();
        }
    
        // Close Popup
        function closePopup() {
            const popup = document.getElementById('popup');
            popup.style.display = 'none';
        }
    
        // Close on Outside Click
        window.onclick = function(event) {
            const popup = document.getElementById('popup');
            if (event.target === popup) {
                closePopup();
            }
        }
    
        // Show Popup on Page Load
        window.onload = showPopup;
    
        // Keyboard Accessibility
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closePopup();
            } else if (event.key === 'ArrowLeft') {
                prevMessage();
            } else if (event.key === 'ArrowRight') {
                nextMessage();
            }
        });

        async function fetchLeaderboard() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                const leaderboardTable = document.getElementById('leaderboard-data');
                leaderboardTable.innerHTML = ''; // Clear existing data

                data.forEach((entry, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${entry.country || 'Unknown'}</td>
                        <td><img src="https://flagcdn.com/w40/${entry.countryCode.toLowerCase()}.png" alt="${entry.country || 'Unknown'} Flag" onerror="this.src='https://flagcdn.com/w40/xx.png'"></td>
                        <td>${entry.visits}</td>
                    `;
                    leaderboardTable.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                const leaderboardTable = document.getElementById('leaderboard-data');
                leaderboardTable.innerHTML = '<tr><td colspan="4">Failed to load leaderboard data</td></tr>';
            }
        }

        // Fetch leaderboard data on page load
        document.addEventListener('DOMContentLoaded', fetchLeaderboard);

        // Optional: Refresh every 30 seconds
        setInterval(fetchLeaderboard, 30000);
