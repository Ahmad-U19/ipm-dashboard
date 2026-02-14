import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Pages/DashboardLayout.js";
import Login from "./Pages/Login";
import Greenhouse from "./Pages/Greenhouse";
import Support223 from "./Pages/Support.js";
import Assignment from "./Pages/Assignment.js";
import User from "./Pages/User.js";
import Libraries from "./Pages/Libraries.js";
import Reports from "./Pages/Reports.js";
import Settings from "./Pages/Settings.js";
import BusinessSettings from "./Pages/BusinessSettings.js";
import GreenhouseSettings from "./Pages/GreenhouseSettings.js";
import GreenhouseApplications from "./Pages/GreenhouseApplications.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Greenhouse />} />
        <Route path="/greenhouses" element={<Greenhouse />} />
        <Route path="/greenhouses/:id/settings" element={<GreenhouseSettings />} />
        <Route path="/greenhouses/:id/applications" element={<GreenhouseApplications />} />
        <Route path="/reports/*" element={<Reports />} />
        <Route path="/support" element={<Support223 />} />
        <Route path="/user" element={<User />} />
        <Route path="/assignments" element={<Assignment />} />
        <Route path="/libraries/*" element={<Libraries />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/business-settings" element={<BusinessSettings />} />
      </Route>
    </Routes>
  );
}
