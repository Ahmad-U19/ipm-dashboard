import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Pages/DashboardLayout.js";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Support223 from "./Pages/Support.js";
import Assignment from "./Pages/Assignment.js";
import User from "./Pages/User.js";

export default function App() {
  return (
    <Routes>

      {/* Login page (NO sidebar) */}
      <Route path="/" element={<Login />} />

      {/* Pages WITH sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Support223 />} />
        <Route path="/user" element={<User />} />
        <Route path="/assignments" element={<Assignment />} />
      </Route>

    </Routes>
  );
}
