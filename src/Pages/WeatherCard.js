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
            if (!API_KEY) {
                setError("API key not configured. Please set REACT_APP_OPENWEATHER_API_KEY in your .env file.");
                setLoading(false);
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            const res = await fetch(url);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    setError("Invalid API key. Please check your OpenWeather API key.");
                } else if (res.status === 404) {
                    setError(`City "${city}" not found.`);
                } else {
                    setError(`Failed to fetch weather: ${errorData.message || res.statusText}`);
                }
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (data?.main && data?.weather) {
                setWeather(data);
            } else {
                setError("Weather data not available");
            }
        } catch (err) {
            setError(`Failed to fetch weather: ${err.message || "Network error"}`);
        } finally {
            setLoading(false);
        }
    };

    // 📍 Auto detect location + correct city name
    useEffect(() => {
        if (!API_KEY) {
            setError("API key not configured. Please set REACT_APP_OPENWEATHER_API_KEY in your .env file.");
            setLoading(false);
            return;
        }

        const getWeather = async (lat, lon) => {
            try {
                const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
                const geoRes = await fetch(geoUrl);
                
                if (!geoRes.ok) {
                    throw new Error("Failed to get location");
                }

                const geoData = await geoRes.json();

                if (!geoData || !geoData[0]) {
                    throw new Error("Location data not available");
                }

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
                
                if (!weatherRes.ok) {
                    throw new Error("Failed to get weather data");
                }

                const weatherData = await weatherRes.json();

                if (!weatherData.main) {
                    setError("Weather data not available");
                } else {
                    weatherData.name = finalCityName;
                    setWeather(weatherData);
                }
            } catch (err) {
                console.error("Error fetching weather by location:", err);
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
    if (error) return <p style={{ color: "red", padding: "10px" }}>{error}</p>;
    if (!weather) return <p>No weather data available</p>;

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
