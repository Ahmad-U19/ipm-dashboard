import React, { useEffect } from "react";
import ReportsPIC from "../Data/report.png";
import "./observationStatusReport.css";

export default function AdvancedReport() {
  useEffect(() => {
    document.title = "Advanced Report | IPM Scoutek";
  }, []);

  return (
    <div className="observation-status-report">
      <div className="report-header">
        <div className="report-header-left">
          <img className="report-header-icon" src={ReportsPIC} alt="Report" />
          <div>
            <h2 className="report-title">Advanced Report</h2>
          </div>
        </div>
      </div>
      <div className="report-results">
        <div className="no-results-container">
          <div className="no-results-illustration">📈</div>
          <div className="no-results-box">
            <p className="no-results-text">Advanced Report - Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

