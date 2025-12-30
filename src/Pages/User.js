import userIMG from "../Data/group.png"
import React,{useEffect} from "react";
import "./user.css";

export default function User() {
  useEffect(() => {
    document.title = "Users | IPM Scoutek";
  }, []);
  return (
    <div>
      <div className="heading">
        <img className="heading-icon" src={userIMG} alt="User" />
        <h4>Users</h4>
      </div>
      <br /><br />
      <div className="users">
        <h2>This feature is coming soon...</h2>
      </div>
    </div>
  );
}