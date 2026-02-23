import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Pages/DashboardLayout.js";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

import Greenhouse from "./Pages/Greenhouse";
import Support223 from "./Pages/Support.js";
import Assignment from "./Pages/Assignment.js";
import User from "./Pages/User.js";
import Libraries from "./Pages/Libraries.js";
import Reports from "./Pages/Reports.js";
import Settings from "./Pages/Settings.js";
import BusinessSettings from "./Pages/BusinessSettings.js";
import ViewSettings from "./Pages/ViewSettings.js";
import GreenhouseApplications from "./Pages/GreenhouseApplications.js";
import AddSpray from "./Pages/AddSpray.js";
import AddBeneficial from "./Pages/AddBeneficial.js";
import EditPlants from "./Pages/EditPlants.js";
import EditStickyCards from "./Pages/EditStickyCards.js";
import EditThresholds from "./Pages/EditThresholds.js";
import EditAreaAddress from "./Pages/EditAreaAddress.js";
import RenameHouses from "./Pages/RenameHouses.js";
import ChangeRowSettings from "./Pages/ChangeRowSettings.js";
import ChangeSectionSettings from "./Pages/ChangeSectionSettings.js";
import PlaceholderPage from "./Pages/PlaceholderPage.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />


      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Greenhouse />} />
        <Route path="/greenhouses" element={<Greenhouse />} />
        <Route path="/greenhouses/:id/settings" element={<ViewSettings />} />
        <Route path="/greenhouses/:id/settings/plants" element={<EditPlants />} />

        <Route path="/greenhouses/:id/settings/sticky-cards" element={<EditStickyCards />} />
        <Route path="/greenhouses/:id/settings/thresholds" element={<EditThresholds />} />
        <Route path="/greenhouses/:id/settings/area" element={<EditAreaAddress />} />
        <Route path="/greenhouses/:id/settings/houses" element={<RenameHouses />} />
        <Route path="/greenhouses/:id/settings/rows" element={<ChangeRowSettings />} />
        <Route path="/greenhouses/:id/settings/sections" element={<ChangeSectionSettings />} />

        <Route path="/greenhouses/:id/applications" element={<GreenhouseApplications />} />
        <Route path="/greenhouses/:id/add-spray" element={<AddSpray />} />
        <Route path="/greenhouses/:id/add-beneficial" element={<AddBeneficial />} />
        <Route path="/greenhouses/:id/add-other" element={<PlaceholderPage title="Add Other" />} />

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
