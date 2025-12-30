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
                <label className="label-assign" htmlFor="">Message to all Users</label>
                <textarea className="area" name="" id="" rows="3"></textarea>
                <br /><br /><br />
                <div className="full-access">
                    <label className="full" htmlFor="">Full Access</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="">Fouad Charafeddine</label>
                            <textarea className="area-1" name="" rows="3" cols="100" id=""></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="">Muhammad Javed</label>
                            <textarea className="area-1" name="" rows="3" cols="100" id=""></textarea>
                        </div>
                    </div>
                </div>
                <br /><br />                
                <div className="full-access">
                    <label className="full" htmlFor="">Owners</label>
                    <div className="full-acess1">
                        <div className="person">
                            <label className="full-acess12" htmlFor="">Rashid Idrees</label>
                            <textarea className="area-1" name="" rows="3" cols="100" id=""></textarea>
                        </div>
                        <div className="person">
                            <label className="full-acess12" htmlFor="">Jamie D'alimonte</label>
                            <textarea className="area-1" name="" rows="3" cols="100" id=""></textarea>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
