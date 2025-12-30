import React, { useEffect, useState } from "react";

export default function WeatherCard() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
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
                const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                let rawName = geoData[0]?.name || DEFAULT_CITY;
                const state = geoData[0]?.state || "";

                const BAD_KEYWORDS = ["Town", "Cantt", "Cantonment", "Tehsil", "City", "District"];
                BAD_KEYWORDS.forEach(k => {
                    if (rawName.includes(k)) rawName = rawName.replace(k, "").trim();
                });

                if (rawName.length < 3 || BAD_KEYWORDS.some(k => rawName.includes(k))) {
                    rawName = state || DEFAULT_CITY;
                }

                const finalCityName = formatCity(rawName);

                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                if (!weatherData.main) {
                    setError("Weather data not available");
                } else {
                    weatherData.name = finalCityName;
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
                pos => getWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeatherByCity(DEFAULT_CITY)
            );
        } else {
            fetchWeatherByCity(DEFAULT_CITY);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
