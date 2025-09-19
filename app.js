let unitsActive = false;
let navUnitBtn = document.getElementById("drop-btn-unit");
let unitsDropActive = document.getElementById("units-drop-active");
const weatherPanel = document.getElementById("weather-panel");
const wpLoader = document.getElementById("loading-weather-panel");
const wpLocation = document.getElementById("wp-location");
const wpDate = document.getElementById("wp-date");
const wpTemp = document.getElementById("wp-temp");
const wpFeels = document.getElementById("wp-feelslike");
const wpHumidity = document.getElementById("wp-humidity");
const wpWind = document.getElementById("wp-wind");
const wpPreci = document.getElementById("wp-precipitation");

navUnitBtn.addEventListener("click", () => {
  console.log("clicked");
  unitsDropActive.classList.toggle("hidden");
  unitsActive = !unitsActive; //altering the value
});
const today = new Date();

const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long", // "Tuesday"
  month: "short", // "Aug"
  day: "numeric", // "5"
  year: "numeric", // "2025"
});
async function setWeather(lat, long) {
  try {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,weathercode,windspeed_10m,winddirection_10m&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Data not found");
      else if (response.status === 500) throw new Error("Server Error");
      else throw new Error("Network was not okay");
    }
    const data = await response.json();
    const current = data.current;
    wpTemp.innerHTML = `${current.temperature_2m}&deg`;
    wpFeels.innerHTML = `${current.apparent_temperature} &deg`;
    wpHumidity.innerHTML = `${current.relative_humidity_2m} %`;
    wpPreci.innerHTML = `${current.precipitation} mm`;
    wpWind.innerHTML = `${current.windspeed_10m} km/h`;
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getGeo() {
  try {
    const response = await fetch("https://ipwhois.app/json/");
    // or: https://ipwhois.io/json/
    // Check the correct base URL and response format

    if (!response.ok) {
      if (response.status === 404) throw new Error("Data not found");
      else if (response.status === 500) throw new Error("Server Error");
      else throw new Error("Network response was not OK");
    }

    const data = await response.json();
    // ipwhois.io returns success flag, etc. Modify checks as per its schema.
    if (data.success === false) {
      throw new Error(`API error: ${data.message || "Unknown error"}`);
    }

    console.log("Geo data:", data);
    await setWeather(data.latitude, data.longitude);
    weatherPanel.classList.remove("hidden");

    wpLoader.classList.add("hidden");
    wpDate.textContent = formattedDate;
    wpLocation.textContent = `${data.city}, ${data.country}`;
  } catch (err) {
    console.error("getGeo error:", err);
    return null;
  }
}

getGeo();

console.log("App Running");
