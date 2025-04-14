const openRouteServiceAPIKey = "5b3ce3597851110001cf6248deb25f5cf5bd44a39794376f00acae6a";

let map = null;
let routeLayer = null;

document.addEventListener("DOMContentLoaded", function () {
    const walletButton = document.getElementById("walletButton");
    const walletPopup = document.getElementById("walletPopup");
    const walletBalance = document.getElementById("walletBalance");
    const transactionHistory = document.getElementById("transactionHistory");
    const amountInput = document.getElementById("amountInput");
    const addMoneyButton = document.getElementById("addMoneyButton");

    // Load Wallet Data from Local Storage
    let balance = localStorage.getItem("walletBalance") ? parseInt(localStorage.getItem("walletBalance")) : 1000;
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Update UI
    walletBalance.textContent = balance;
    updateTransactionHistory();

    // Toggle Wallet Popup
    walletButton.addEventListener("click", function () {
        walletPopup.style.display = walletPopup.style.display === "block" ? "none" : "block";
    });

    // Function to Update Transaction History
    function updateTransactionHistory() {
        transactionHistory.innerHTML = "";
        transactions.forEach((tx) => {
            let li = document.createElement("li");
            li.textContent = `${tx.date} - ₹${tx.amount} (${tx.type})`;
            transactionHistory.appendChild(li);
        });
    }

    // Function to Add Money
    addMoneyButton.addEventListener("click", function () {
        let amount = parseInt(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            balance += amount;
            transactions.unshift({ date: new Date().toLocaleString(), amount, type: "Added to Wallet" });

            // Save to Local Storage
            localStorage.setItem("walletBalance", balance);
            localStorage.setItem("transactions", JSON.stringify(transactions));

            // Update UI
            walletBalance.textContent = balance;
            updateTransactionHistory();
            amountInput.value = "";
            alert(`₹${amount} added successfully!`);
        } else {
            alert("Please enter a valid amount!");
        }
    });

    // Simulate Toll Payment
    function makePayment(amount) {
        if (balance >= amount) {
            balance -= amount;
            transactions.unshift({ date: new Date().toLocaleString(), amount, type: "Toll Paid" });

            // Save to Local Storage
            localStorage.setItem("walletBalance", balance);
            localStorage.setItem("transactions", JSON.stringify(transactions));

            // Update UI
            walletBalance.textContent = balance;
            updateTransactionHistory();
            alert(`Payment of ₹${amount} successful!`);
        } else {
            alert("Insufficient balance!");
        }
    }

    // Simulating Payment after 5 seconds (For Testing)
    //setTimeout(() => makePayment(800), 2000);//(For Demoonstration)
});

// Add event listener to the form
document.getElementById('tollpay-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const vehicleType = document.getElementById('vehicle-type').value;

    if (source && destination && vehicleType) {
        // Simulate toll price calculation
        const basePrice = Math.floor(Math.random() * 100) + 50; // Random base price
        const vehicleMultiplier = {
            car: 1,
            bike: 0.5,
            bus: 2,
            truck: 2.5
        };
        const tollPrice = (basePrice * vehicleMultiplier[vehicleType]).toFixed(2);

        // Store toll price in localStorage
        localStorage.setItem('tollPrice', tollPrice);

        // Display the toll price
        document.getElementById('toll-price').innerHTML = `Toll Price: <span>₹${tollPrice}</span>`;
        document.getElementById('map-container').style.display = 'block';

        document.getElementById('goToPay').addEventListener('click', function () {
            window.location.href = "/payment"; // Redirect to payment page
        });

        // Display the map and route
        displayMapAndRoute(source, destination);
    } else {
        alert('Please fill out all fields!');
    }
});

async function displayMapAndRoute(source, destination) {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = "";

    if (map) {
        map.remove();
    }
    map = L.map(mapDiv).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    try {
        const [sourceCoords, destinationCoords] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/search?q=${source}&format=json`).then(res => res.json()),
            fetch(`https://nominatim.openstreetmap.org/search?q=${destination}&format=json`).then(res => res.json())
        ]);

        if (sourceCoords.length == 0 || destinationCoords.length == 0) {
            alert('Could not find locations. Please check your input.');
            return;
        }

        const sourceLatLng = [parseFloat(sourceCoords[0].lat), parseFloat(sourceCoords[0].lon)];
        const destinationLatLng = [parseFloat(destinationCoords[0].lat), parseFloat(destinationCoords[0].lon)];

        L.marker(sourceLatLng).addTo(map).bindPopup(`Source: ${source}`).openPopup();
        L.marker(destinationLatLng).addTo(map).bindPopup(`Destination: ${destination}`).openPopup();

        map.fitBounds([sourceLatLng, destinationLatLng]);

        const routeData = await fetchRoute(sourceLatLng, destinationLatLng);
        if (routeData) {
            if (routeLayer) {
                routeLayer.clearLayers();
            }
            const routeCoordinates = routeData.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            routeLayer = L.polyline(routeCoordinates, { color: 'blue', weight: 4 }).addTo(map);
        }

    } catch (error) {
        alert('Error fetching location data. Please try again.');
        console.error(error);
    }
}

async function fetchRoute(sourceLatLng, destinationLatLng) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceAPIKey}&start=${sourceLatLng[1]},${sourceLatLng[0]}&end=${destinationLatLng[1]},${destinationLatLng[0]}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error('Error fetching route:', response.statusText);
        return null;
    }
}