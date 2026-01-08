import React, { useEffect, useMemo, useState } from "react";
import userIMG from "../Data/group.png";
import { supabase } from "../DataBase/supabaseClient";
import "./user.css";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    document.title = "Users | IPM Scoutek";
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("id, name, email, role, accessible_greenhouses, last_active")
          .order("last_active", { ascending: false });

        if (fetchError) throw fetchError;
        setUsers(data || []);
      } catch (err) {
        setError(err?.message || "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((user) => {
        const isActive = !!user?.last_active;
        if (activeTab === "active" && !isActive) return false;
        if (activeTab === "inactive" && isActive) return false;
        if (!term) return true;
        return (
          user?.name?.toLowerCase().includes(term) ||
          user?.email?.toLowerCase().includes(term) ||
          user?.role?.toLowerCase().includes(term)
        );
      })
      .map((user) => ({
        ...user,
        lastActiveLabel: formatDate(user?.last_active),
        greenhouseLabel:
          user?.accessible_greenhouses?.length > 0
            ? user.accessible_greenhouses
            : "All Greenhouses",
      }));
  }, [users, activeTab, search]);

  const activeCount = users.filter((u) => !!u?.last_active).length;
  const inactiveCount = users.length - activeCount;

  return (
    <div className="user-page">
      <div className="heading">
        <div className="heading-left">
          <img className="heading-icon" src={userIMG} alt="User" />
          <h4>Users</h4>
        </div>
        <button className="primary-circle-btn" aria-label="Add user">
          +
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active <span className="tab-count">{activeCount}</span>
            </button>
            <button
              className={`tab ${activeTab === "inactive" ? "active" : ""}`}
              onClick={() => setActiveTab("inactive")}
            >
              Inactive <span className="tab-count">{inactiveCount}</span>
            </button>
          </div>

          <div className="actions">
            <input
              className="search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {loading && <p className="muted">Loading users...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && filteredUsers.length === 0 && (
            <p className="muted">No users found.</p>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Accessible Greenhouses</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user?.name || "N/A"}</td>
                    <td>{user?.email || "N/A"}</td>
                    <td>{user?.role || "N/A"}</td>
                    <td>{user.greenhouseLabel}</td>
                    <td>{user.lastActiveLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="table-footer">
          <span className="muted">
            Page 1 of 1 • Showing {filteredUsers.length} of {users.length} users
          </span>
          <div className="pagination">
            <button disabled className="page-btn">
              1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}