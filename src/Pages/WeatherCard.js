import React, { useEffect, useState } from "react";

export default function WeatherCard() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "9def2c789b0c1372dfc03aa46aad69c1";
    const DEFAULT_CITY = "Ontario";

    // 🚨 Spelling Fix Map
    const CITY_NAME_CORRECTIONS = {
        "Lahor": "Lahore",
        "Lahor Cantonment": "Lahore Cantt",
        "Raiwand": "Raiwind",
        "Ontario": "Ontario"
    };

    // ✨ Format & Correct City Name
    const formatCity = (name) => {
        if (!name) return DEFAULT_CITY;
        const corrected = CITY_NAME_CORRECTIONS[name] || name;
        return corrected
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    // 🌍 Fetch weather by city
    const fetchWeatherByCity = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data?.main && data?.weather) setWeather(data);
            else setError("Weather data not available");
        } catch {
            setError("Failed to fetch weather");
        } finally {
            setLoading(false);
        }
    };

    // 📍 Auto detect location + correct city name
    useEffect(() => {
        const getWeather = async (lat, lon) => {
            try {
                // 1️⃣ Use reverse geo for display name
                const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();
                const realCity = geoData[0]?.name || DEFAULT_CITY;

                // 2️⃣ Fetch weather by COORDINATES (more reliable)
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                if (!weatherData || !weatherData.main) {
                    setError("Weather data not available");
                } else {
                    // store both city+data
                    weatherData.name = realCity;
                    setWeather(weatherData);
                }
            } catch {
                fetchWeatherByCity(DEFAULT_CITY);
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeatherByCity(DEFAULT_CITY)
            );
        } else {
            fetchWeatherByCity(DEFAULT_CITY);
        }
    }, []);


    if (loading) return <p>Loading weather...</p>;
    if (error) return <p>{error}</p>;

    const cityName = formatCity(weather.name);

    return (
        <div
            style={{
                background: "rgb(255, 255, 255)",
                padding: "15px",
                borderRadius: "20px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                width: "240px",
                marginLeft: "13px",
            }}
        >
            <h3>Weather</h3>
            <h2>{cityName}</h2>
            <p>🌡 Temperature: {weather.main?.temp ?? "-"} °C</p>
            <p>🌧 Condition: {weather.weather?.[0]?.description ?? "-"}</p>
            <p>💨 Wind: {weather.wind?.speed ?? "-"} m/s</p>
            <p>💧 Humidity: {weather.main?.humidity ?? "-"}%</p>
        </div>

    );
}
