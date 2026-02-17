import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./beneficialLibrary.css";

// Sample beneficial data based on the image provided
export const SAMPLE_BENEFICIALS = [
    {
        id: 1,
        icon: "🐞",
        name: "Andersoni",
        abbreviation: "ADS",
        species: "Amblyseius andersoni",
    },
    {
        id: 2,
        icon: "🦟",
        name: "Aphelinus",
        abbreviation: "AA",
        species: "Aphelinus abdominalis",
    },
    {
        id: 3,
        icon: "🪰",
        name: "Aphidius matricariae",
        abbreviation: "AMT",
        species: "Aphidius matricariae",
    },
    {
        id: 4,
        icon: "🦟",
        name: "Aphidoletes",
        abbreviation: "ADL",
        species: "Aphidoletes aphidimyza",
    },
    {
        id: 5,
        icon: "🪰",
        name: "Appifly",
        abbreviation: "AFY",
        species: "Ophyra aenescens",
    },
    {
        id: 6,
        icon: "🪲",
        name: "Atheta",
        abbreviation: "ATH",
        species: "Atheta coriari",
    },
    {
        id: 7,
        icon: "🦋",
        name: "Brown Lacewing",
        abbreviation: "BLW",
        species: "Micromus variegatus",
    },
    {
        id: 8,
        icon: "🕷️",
        name: "Californicus",
        abbreviation: "CA",
        species: "Neoseiulus californicus",
    },
    {
        id: 9,
        icon: "🦟",
        name: "Colemani",
        abbreviation: "CO",
        species: "Aphidius colemani",
    },
    {
        id: 10,
        icon: "🕷️",
        name: "Cucumeris",
        abbreviation: "CU",
        species: "Amblyseius cucumeris",
    },
];

export default function BeneficialLibrary() {
    const [beneficials, setBeneficials] = useState(SAMPLE_BENEFICIALS);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        icon: "",
        name: "",
        abbreviation: "",
        species: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        document.title = "Beneficial Library | IPM Scoutek";
    }, []);

    // Filter beneficials based on search and tab
    const filteredBeneficials = useMemo(() => {
        let filtered = beneficials;

        // Filter by tab
        if (activeTab === "your") {
            // For now, show last 4 as "your beneficials" - replace with actual user filter
            filtered = beneficials.slice(-4);
        }

        // Filter by search
        if (search.trim()) {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(
                (beneficial) =>
                    beneficial.name.toLowerCase().includes(term) ||
                    beneficial.abbreviation.toLowerCase().includes(term) ||
                    beneficial.species.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [beneficials, activeTab, search]);

    // Pagination
    const totalPages = Math.ceil(filteredBeneficials.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBeneficials = filteredBeneficials.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const allBeneficialsCount = beneficials.length;
    const yourBeneficialsCount = beneficials.slice(-4).length; // Replace with actual count

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
        setFormData({ icon: "", name: "", abbreviation: "", species: "" });
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setFormData({ icon: "", name: "", abbreviation: "", species: "" });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }
        if (!formData.abbreviation.trim()) {
            errors.abbreviation = "Abbreviation is required";
        } else if (formData.abbreviation.length > 10) {
            errors.abbreviation = "Abbreviation must be 10 characters or less";
        }
        if (!formData.species.trim()) {
            errors.species = "Species is required";
        }
        if (!formData.icon.trim()) {
            errors.icon = "Icon is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Create new beneficial
        const newBeneficial = {
            id: Date.now(),
            icon: formData.icon.trim(),
            name: formData.name.trim(),
            abbreviation: formData.abbreviation.trim().toUpperCase(),
            species: formData.species.trim(),
        };

        // Add to beneficials list
        setBeneficials((prev) => [newBeneficial, ...prev]);

        // Reset form and close modal
        handleCloseModal();

        // Reset to first page to show the new beneficial
        setCurrentPage(1);
    };

    return (
        <div className="beneficial-library-page">
            <div className="heading">
                <div className="heading-left">
                    <img className="heading-icon" src={librarypic} alt="Beneficial Library" />
                    <h4>Beneficial Library</h4>
                </div>
                <button
                    className="primary-circle-btn"
                    aria-label="Add beneficial"
                    onClick={handleOpenModal}
                >
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
                            All Beneficials <span className="tab-count">{allBeneficialsCount}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === "your" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("your");
                                setCurrentPage(1);
                            }}
                        >
                            Your Beneficials <span className="tab-count">{yourBeneficialsCount}</span>
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
                    {loading && <p className="muted">Loading beneficials...</p>}
                    {!loading && filteredBeneficials.length === 0 && (
                        <p className="muted">No beneficials found.</p>
                    )}

                    {!loading && paginatedBeneficials.length > 0 && (
                        <table className="beneficial-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Name</th>
                                    <th>Abbreviation</th>
                                    <th>Species</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBeneficials.map((beneficial) => (
                                    <tr key={beneficial.id}>
                                        <td>
                                            <span className="beneficial-icon">{beneficial.icon}</span>
                                        </td>
                                        <td>{beneficial.name}</td>
                                        <td>{beneficial.abbreviation}</td>
                                        <td>{beneficial.species}</td>
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? "active" : ""}`}
                                onClick={() => handlePageChange(page)}
                                disabled={currentPage === page}
                            >
                                {page}
                            </button>
                        ))}
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

            {/* Add Beneficial Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Beneficial</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="icon">
                                    Icon <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="icon"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 🐞"
                                    maxLength="2"
                                    className={formErrors.icon ? "error-input" : ""}
                                />
                                {formErrors.icon && (
                                    <span className="error-message">{formErrors.icon}</span>
                                )}
                                <small className="form-hint">Enter an emoji or icon character</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">
                                    Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Andersoni"
                                    className={formErrors.name ? "error-input" : ""}
                                />
                                {formErrors.name && (
                                    <span className="error-message">{formErrors.name}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="abbreviation">
                                    Abbreviation <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="abbreviation"
                                    name="abbreviation"
                                    value={formData.abbreviation}
                                    onChange={handleInputChange}
                                    placeholder="e.g., ADS"
                                    maxLength="10"
                                    className={formErrors.abbreviation ? "error-input" : ""}
                                />
                                {formErrors.abbreviation && (
                                    <span className="error-message">{formErrors.abbreviation}</span>
                                )}
                                <small className="form-hint">Maximum 10 characters</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="species">
                                    Species <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="species"
                                    name="species"
                                    value={formData.species}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Amblyseius andersoni"
                                    className={formErrors.species ? "error-input" : ""}
                                />
                                {formErrors.species && (
                                    <span className="error-message">{formErrors.species}</span>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Beneficial
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
