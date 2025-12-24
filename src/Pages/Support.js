import React from "react";
import { useEffect } from "react";
import "./Support.css"
import supportIMG from "../Data/support-64.png"

function Support() {
  useEffect(() => {
    document.title = "Support | IPM Scoutek";
  }, []);

  return (
    <div>
      <div className="support">
        <img src={supportIMG} alt="support" />
        <h1>Support</h1>
      </div>

      <div className="help">
        <p className="heading">We're here to Help</p>
        <p className="team">Our Support staff is always happy to hear from you, and always happy to help</p>
      </div>
      <br />
      <div className="contact">
        <p className="team">If you need immediate help please contact us</p>
        <div className="contactUS">
        <div className="sect">
          <p>Phone:</p>  
          <a href="tel:+18664128883">1.866.412.8883 Ext 2</a>
        </div>
        <div className="sect">
          <p>Email:</p>  
          <a href="mailto:support@ipmscoutek.com">support@ipmscoutek.com</a>
        </div>
        </div>
      </div>
    </div>
  );
}
export default Support;