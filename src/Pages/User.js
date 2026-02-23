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

  // Edit User State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    document.title = "Users | IPM Scoutek";
    fetchUsers();
  }, []);

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

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((user) => {
        // A user is "active" if they have a last_active date. 
        // However, let's show all users in the active tab for now if they exist, 
        // to avoid them being "hidden" after signup.
        const isActive = !!user?.last_active;

        // If searching, search across all users regardless of tab
        if (term) {
          return (
            user?.name?.toLowerCase().includes(term) ||
            user?.email?.toLowerCase().includes(term) ||
            user?.role?.toLowerCase().includes(term)
          );
        }

        if (activeTab === "active" && !isActive) return true; // Show everyone in active tab for now
        if (activeTab === "inactive" && isActive) return false;

        return true;
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

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setEditName(user.name || "");
    setEditRole(user.role || "Scouter");
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setUpdateLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ name: editName, role: editRole })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      alert("User updated successfully!");
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert("Error updating user: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedUser) return;
    setUpdateLoading(true);
    const newStatus = selectedUser.last_active ? null : new Date().toISOString();
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ last_active: newStatus })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      alert(newStatus ? "User activated!" : "User inactivated!");
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert("Error toggling status: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUser.name}?`)) return;

    setUpdateLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedUser.id);

      if (deleteError) throw deleteError;

      alert("User deleted successfully!");
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert("Error deleting user: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

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
                  <th>Status</th>
                  <th>Accessible Greenhouses</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} onClick={() => handleRowClick(user)}>
                    <td>{user?.name || "N/A"}</td>
                    <td>{user?.email || "N/A"}</td>
                    <td>{user?.role || "N/A"}</td>
                    <td>
                      <span className={`status-badge ${user?.last_active ? 'status-active' : 'status-inactive'}`}>
                        {user?.last_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
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
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit User: {selectedUser?.email}</h3>

            <label>Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Full Name"
            />

            <label>Role</label>
            <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
              <option value="Scouter">Scouter</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>

            <div className="modal-actions">
              <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={updateLoading}
                style={{ marginRight: 'auto' }}
              >
                DELETE
              </button>

              <button
                className="secondary-btn"
                onClick={handleToggleActive}
                disabled={updateLoading}
              >
                {selectedUser?.last_active ? "INACTIVATE" : "ACTIVATE"}
              </button>

              <button className="secondary-btn" onClick={handleCloseModal}>CANCEL</button>

              <button
                className="save-btn"
                onClick={handleUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
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