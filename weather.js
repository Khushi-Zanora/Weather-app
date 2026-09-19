const loader = document.getElementById("loader");

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

function getWeather(locationFromGeo = null) {
    const locationInput = document.getElementById("locationInput");
    const location = locationFromGeo || locationInput.value;

    if (!location) {
        alert("Please enter a location!");
        return;
    }

    showLoader();

    document.getElementById("weatherResult").innerHTML = "";
    document.getElementById("forecast").innerHTML = "";
    document.getElementById("forecastTitle").innerText = "";

    const apiKey = "b7a689788fc34df4a08111305261201";
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            hideLoader();

            document.getElementById("weatherResult").innerHTML = `
                <h2>${locationInput.value}</h2>
                <img src="https:${data.current.condition.icon}" alt="icon"><br>
                <strong>${data.current.temp_c}°C</strong><br>
                ${data.current.condition.text}
            `;

            document.getElementById("forecastTitle").innerText =
                "📅 7-Day Forecast";

            const forecastDiv = document.getElementById("forecast");
            forecastDiv.innerHTML = "";

            data.forecast.forecastday.forEach(day => {
                forecastDiv.innerHTML += `
                    <div class="forecast-card">
                        <strong>${day.date}</strong><br><br>
                        <img src="https:${day.day.condition.icon}" alt="icon"><br>
                        ${day.day.avgtemp_c}°C<br>
                        ${day.day.condition.text}
                    </div>
                `;
            });
        })
        .catch(() => {
            hideLoader();
            document.getElementById("weatherResult").innerText =
                "❌ Location not found!";
        });
}

/* 🌙 Dark mode */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("modeBtn");
    btn.innerText = document.body.classList.contains("dark-mode")
        ? "☀ Light Mode"
        : "🌙 Dark Mode";
}

/* ⌨ ENTER key */
document.getElementById("locationInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            getWeather();
        }
    });

/* 📍 AUTO-DETECT LOCATION */
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(`${lat},${lon}`);
        });
    }
};
