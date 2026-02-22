import React, { useEffect } from "react";
import "./assignment.css"; // we will create this
import WeatherCard from "./WeatherCard.js";
import ASSIGNMENT from "../Data/assignment.png";

// ^ You will create this next

export default function Assignment() {
    useEffect(() => {
        document.title = "Assignment | IPM Scoutek";
    }, []);
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
                    <textarea className="area" name="message" id="message" placeholder="Type a message for all users..."></textarea>
                </div>

                <div className="full-access">
                    <label className="full">Full Access</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="fouad">Fouad Charafeddine</label>
                            <textarea className="area-1" name="fouad" id="fouad" placeholder="Assign tasks..."></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="javed">Muhammad Javed</label>
                            <textarea className="area-1" name="javed" id="javed" placeholder="Assign tasks..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="full-access">
                    <label className="full">Owners</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="rashid">Rashid Idrees</label>
                            <textarea className="area-1" name="rashid" id="rashid" placeholder="Assign tasks..."></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="jamie">Jamie D'alimonte</label>
                            <textarea className="area-1" name="jamie" id="jamie" placeholder="Assign tasks..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

