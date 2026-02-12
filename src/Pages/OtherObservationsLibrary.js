import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./otherObservationsLibrary.css";

// Sample observation data from the image
const SAMPLE_OBSERVATIONS = [
    { id: 1, icon: "🧪", name: "Acidity", abbreviation: "PH", averageOrSum: "Average" },
    { id: 2, icon: "🍇", name: "Beneficial Plant", abbreviation: "BENP", averageOrSum: "Sum" },
    { id: 3, icon: "🤖", name: "Electrical Conductivity", abbreviation: "EC", averageOrSum: "Average" },
    { id: 4, icon: "🐞", name: "Indicator Plant", abbreviation: "INDP", averageOrSum: "Sum" },
    { id: 5, icon: "🚿", name: "Leach Percentage", abbreviation: "LP", averageOrSum: "Average" },
    { id: 6, icon: "🌱", name: "Plant Height", abbreviation: "PLH", averageOrSum: "Average" },
    { id: 7, icon: "🐝", name: "Pollination", abbreviation: "POL", averageOrSum: "Sum" },
    { id: 8, icon: "🛠️", name: "Repair", abbreviation: "REP", averageOrSum: "Sum" },
];

export default function OtherObservationsLibrary() {
    const [observations, setObservations] = useState(SAMPLE_OBSERVATIONS);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        icon: "",
        name: "",
        abbreviation: "",
        averageOrSum: "Average",
    });
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        document.title = "Other Observations Library | IPM Scoutek";
    }, []);

    const filteredObservations = useMemo(() => {
        let filtered = observations;

        if (activeTab === "your") {
            // Mocking "your observations"
            filtered = observations.filter(obs => obs.id % 2 === 0);
        }

        if (search.trim()) {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(
                (obs) =>
                    obs.name.toLowerCase().includes(term) ||
                    obs.abbreviation.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [observations, activeTab, search]);

    const totalPages = Math.ceil(filteredObservations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedObservations = filteredObservations.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const allCount = observations.length;
    const yourCount = observations.filter(obs => obs.id % 2 === 0).length;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleGoToPage = (e) => {
        const page = parseInt(e.target.value);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenModal = () => {
        setShowAddModal(true);
        setFormData({ icon: "", name: "", abbreviation: "", averageOrSum: "Average" });
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.abbreviation.trim()) errors.abbreviation = "Abbreviation is required";
        if (!formData.icon.trim()) errors.icon = "Icon is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newObservation = {
            id: Date.now(),
            ...formData,
        };

        setObservations((prev) => [newObservation, ...prev]);
        handleCloseModal();
        setCurrentPage(1);
    };

    return (
        <div className="observation-library-page">
            <div className="heading">
                <div className="heading-left">
                    <img className="heading-icon" src={librarypic} alt="Library" />
                    <h4>Other Observations Library</h4>
                </div>
                <button className="primary-circle-btn" onClick={handleOpenModal}>
                    +
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("all");
                                setCurrentPage(1);
                            }}
                        >
                            All Other Observations <span className="tab-count">{allCount}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === "your" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("your");
                                setCurrentPage(1);
                            }}
                        >
                            Your Other Observations <span className="tab-count">{yourCount}</span>
                        </button>
                    </div>

                    <div className="actions">
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                className="search-input"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <p className="muted">Loading...</p>
                    ) : filteredObservations.length === 0 ? (
                        <p className="muted">No observations found.</p>
                    ) : (
                        <table className="observation-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>
                                        Name <span className="sort-icon">▲</span>
                                    </th>
                                    <th>
                                        Abbreviation <span className="sort-icon">⇅</span>
                                    </th>
                                    <th>
                                        Average or Sum <span className="sort-icon">⇅</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedObservations.map((obs) => (
                                    <tr key={obs.id}>
                                        <td>
                                            <span className="observation-icon">{obs.icon}</span>
                                        </td>
                                        <td>{obs.name}</td>
                                        <td>{obs.abbreviation}</td>
                                        <td>{obs.averageOrSum}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="table-footer">
                    <span className="muted">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ←
                        </button>
                        <button className={`page-btn active`}>{currentPage}</button>
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            →
                        </button>
                        <div className="goto-page">
                            <span className="muted">Go To Page:</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages || 1}
                                value={currentPage}
                                onChange={handleGoToPage}
                                className="page-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Observation</h3>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Icon *</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 🧪"
                                    className={formErrors.icon ? "error-input" : ""}
                                />
                            </div>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Acidity"
                                    className={formErrors.name ? "error-input" : ""}
                                />
                            </div>
                            <div className="form-group">
                                <label>Abbreviation *</label>
                                <input
                                    type="text"
                                    name="abbreviation"
                                    value={formData.abbreviation}
                                    onChange={handleInputChange}
                                    placeholder="e.g., PH"
                                    className={formErrors.abbreviation ? "error-input" : ""}
                                />
                            </div>
                            <div className="form-group">
                                <label>Average or Sum</label>
                                <select
                                    name="averageOrSum"
                                    value={formData.averageOrSum}
                                    onChange={handleInputChange}
                                >
                                    <option value="Average">Average</option>
                                    <option value="Sum">Sum</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-submit">Add Observation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
