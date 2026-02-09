import React, { useEffect, useState } from "react";

export default function WeatherCard() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

    const fetchWeatherByCoords = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setWeather(data);
        } catch (err) {
            setError("Could not get local weather");
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
                (err) => {
                    setError("Location permission denied.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation not supported");
            setLoading(false);
        }
    };

    // 📍 Auto detect location on initial load
    useEffect(() => {
        requestLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getWeatherIcon = (temp) => {
        if (temp > 25) return "☀️";
        if (temp > 15) return "⛅";
        return "☁️";
    };

    return (
        <div
            style={{
                background: "#ffffff",
                color: "#333333",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                width: "240px",
                margin: "10px 0",
                fontFamily: "inherit"
            }}
        >
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "600", textAlign: "center", opacity: "0.9" }}>
                Weather Forecast
            </h3>

            <div style={{ textAlign: "center", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {loading ? (
                    <div className="loader" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>Updating...</div>
                ) : error ? (
                    <div style={{ background: "rgba(255,0,0,0.2)", padding: "10px", borderRadius: "10px", fontSize: "0.85rem" }}>
                        ⚠️ {error}
                    </div>
                ) : weather ? (
                    <>
                        <h2 style={{ margin: "0", fontSize: "1.6rem", fontWeight: "700" }}>{weather.name}</h2>
                        <div style={{ fontSize: "3.5rem", margin: "10px 0", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                            {getWeatherIcon(weather.main.temp)}
                        </div>
                        <div style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "15px" }}>
                            {Math.round(weather.main?.temp)}°C
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem" }}>
                            <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "12px" }}>
                                <span style={{ opacity: 0.7 }}>Humidity</span><br />
                                <strong>{weather.main?.humidity}%</strong>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "12px" }}>
                                <span style={{ opacity: 0.7 }}>Wind</span><br />
                                <strong>{Math.round(weather.wind?.speed)} m/s</strong>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "12px", gridColumn: "span 2" }}>
                                <span style={{ opacity: 0.7 }}>Condition</span><br />
                                <strong style={{ textTransform: "capitalize" }}>{weather.weather?.[0]?.description}</strong>
                            </div>
                        </div>
                    </>
                ) : (
                    <p style={{ opacity: 0.6 }}>No data available</p>
                )}
            </div>
        </div>
    );
}
