import React, { useEffect, useState } from "react";
import { supabase } from "../DataBase/supabaseClient";
import "./assignment.css";
import WeatherCard from "./WeatherCard.js";
import ASSIGNMENT from "../Data/assignment.png";

export default function Assignment() {
    const [globalMessage, setGlobalMessage] = useState("");
    const [fouadMessage, setFouadMessage] = useState("");
    const [javedMessage, setJavedMessage] = useState("");
    const [rashidMessage, setRashidMessage] = useState("");
    const [jamieMessage, setJamieMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        document.title = "Assignment | IPM Scoutek";
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            // Fetch global message
            const { data: globalData } = await supabase
                .from('global_settings')
                .select('key, value')
                .eq('key', 'global_assignment_message')
                .single();
            if (globalData) setGlobalMessage(globalData.value);

            // Fetch user specific assignments from a generic 'assignments' table if it exists, 
            // or use global_settings keys for simplicity in this demo environment
            const { data: userData } = await supabase
                .from('global_settings')
                .select('key, value')
                .in('key', ['msg_fouad', 'msg_javed', 'msg_rashid', 'msg_jamie']);

            if (userData) {
                userData.forEach(item => {
                    if (item.key === 'msg_fouad') setFouadMessage(item.value);
                    if (item.key === 'msg_javed') setJavedMessage(item.value);
                    if (item.key === 'msg_rashid') setRashidMessage(item.value);
                    if (item.key === 'msg_jamie') setJamieMessage(item.value);
                });
            }
        } catch (err) {
            console.error("Error fetching assignments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = [
                { key: 'global_assignment_message', value: globalMessage },
                { key: 'msg_fouad', value: fouadMessage },
                { key: 'msg_javed', value: javedMessage },
                { key: 'msg_rashid', value: rashidMessage },
                { key: 'msg_jamie', value: jamieMessage },
            ];

            const { error } = await supabase
                .from('global_settings')
                .upsert(updates, { onConflict: 'key' });

            if (error) throw error;
            alert("Assignments saved successfully!");
        } catch (err) {
            alert("Error saving assignments: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="assignment-layout">Loading...</div>;

    return (
        <div className="assignment-layout">

            {/* Weather Section */}
            <div className="weather-panel">
                <div className="assig">
                    <img className="assignment-icon" src={ASSIGNMENT} alt="Assignment" />
                    <h2>Assignment</h2>
                </div>
                <WeatherCard />
            </div>

            {/* Assignments Content */}
            <div className="assignment-content">
                <div className="message-section">
                    <label className="label-assign" htmlFor="message">Message to all Users</label>
                    <textarea
                        className="area"
                        name="message"
                        id="message"
                        placeholder="Type a message for all users..."
                        value={globalMessage}
                        onChange={(e) => setGlobalMessage(e.target.value)}
                    ></textarea>
                </div>

                <div className="full-access">
                    <label className="full">Full Access</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="fouad">Fouad Charafeddine</label>
                            <textarea
                                className="area-1"
                                name="fouad"
                                id="fouad"
                                placeholder="Assign tasks..."
                                value={fouadMessage}
                                onChange={(e) => setFouadMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="javed">Muhammad Javed</label>
                            <textarea
                                className="area-1"
                                name="javed"
                                id="javed"
                                placeholder="Assign tasks..."
                                value={javedMessage}
                                onChange={(e) => setJavedMessage(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="full-access">
                    <label className="full">Owners</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="rashid">Rashid Idrees</label>
                            <textarea
                                className="area-1"
                                name="rashid"
                                id="rashid"
                                placeholder="Assign tasks..."
                                value={rashidMessage}
                                onChange={(e) => setRashidMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="jamie">Jamie D'alimonte</label>
                            <textarea
                                className="area-1"
                                name="jamie"
                                id="jamie"
                                placeholder="Assign tasks..."
                                value={jamieMessage}
                                onChange={(e) => setJamieMessage(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <button className="done-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>

        </div>
    );
}

