import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./pestLibrary.css";

// Sample pest data - replace with actual API/database call
const SAMPLE_PESTS = [
    {
        id: 1,
        icon: "🐜",
        name: "Ants",
        abbreviation: "ANT",
        species: "Solenopsis Invicta",
    },
    {
        id: 2,
        icon: "🪲",
        name: "Aphids",
        abbreviation: "APH",
        species: "Aphidoidea",
    },
    {
        id: 3,
        icon: "🐚",
        name: "Armored Scale",
        abbreviation: "AS",
        species: "Diaspididae",
    },
    {
        id: 4,
        icon: "🐛",
        name: "Armyworm",
        abbreviation: "AW",
        species: "Mythimna unipuncta",
    },
    {
        id: 5,
        icon: "🦋",
        name: "Banana Moth",
        abbreviation: "BN",
        species: "Opogona sacchari",
    },
    {
        id: 6,
        icon: "🦟",
        name: "Banded Whitefly",
        abbreviation: "BF",
        species: "Trialeurodes abutiloneus",
    },
    {
        id: 7,
        icon: "🐛",
        name: "Black Cutworm",
        abbreviation: "BCW",
        species: "Agrotis ipsilon Hufnagel",
    },
    {
        id: 8,
        icon: "🪲",
        name: "Black Vine Weevil",
        abbreviation: "BVW",
        species: "Otiorhynchus Sulcatus",
    },
    {
        id: 9,
        icon: "🪰",
        name: "Blow Fly",
        abbreviation: "BLF",
        species: "Calliphoridae",
    },
    {
        id: 10,
        icon: "🦋",
        name: "Box Tree Moth",
        abbreviation: "BTM",
        species: "Cydalima Perspectalis",
    },
];

export default function PestLibrary() {
    const [pests, setPests] = useState(SAMPLE_PESTS);
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
        document.title = "Pest Library | IPM Scoutek";
    }, []);

    // Filter pests based on search and tab
    const filteredPests = useMemo(() => {
        let filtered = pests;

        // Filter by tab
        if (activeTab === "your") {
            // For now, show last 2 as "your pests" - replace with actual user filter
            filtered = pests.slice(-2);
        }

        // Filter by search
        if (search.trim()) {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(
                (pest) =>
                    pest.name.toLowerCase().includes(term) ||
                    pest.abbreviation.toLowerCase().includes(term) ||
                    pest.species.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [pests, activeTab, search]);

    // Pagination
    const totalPages = Math.ceil(filteredPests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPests = filteredPests.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const allPestsCount = pests.length;
    const yourPestsCount = pests.slice(-2).length; // Replace with actual count

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

        // Create new pest
        const newPest = {
            id: Date.now(),
            icon: formData.icon.trim(),
            name: formData.name.trim(),
            abbreviation: formData.abbreviation.trim().toUpperCase(),
            species: formData.species.trim(),
        };

        // Add to pests list
        setPests((prev) => [newPest, ...prev]);

        // Reset form and close modal
        handleCloseModal();

        // Reset to first page to show the new pest
        setCurrentPage(1);
    };

    return (
        <div className="pest-library-page">
            <div className="heading">
                <div className="heading-left">
                    <img className="heading-icon" src={librarypic} alt="Pest Library" />
                    <h4>Pest Library</h4>
                </div>
                <button
                    className="primary-circle-btn"
                    aria-label="Add pest"
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
                            All Pests <span className="tab-count">{allPestsCount}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === "your" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("your");
                                setCurrentPage(1);
                            }}
                        >
                            Your Pests <span className="tab-count">{yourPestsCount}</span>
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
                    {loading && <p className="muted">Loading pests...</p>}
                    {!loading && filteredPests.length === 0 && (
                        <p className="muted">No pests found.</p>
                    )}

                    {!loading && paginatedPests.length > 0 && (
                        <table className="pest-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Name</th>
                                    <th>Abbreviation</th>
                                    <th>Species</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPests.map((pest) => (
                                    <tr key={pest.id}>
                                        <td>
                                            <span className="pest-icon">{pest.icon}</span>
                                        </td>
                                        <td>{pest.name}</td>
                                        <td>{pest.abbreviation}</td>
                                        <td>{pest.species}</td>
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

            {/* Add Pest Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Pest</h3>
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
                                    placeholder="e.g., 🐜"
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
                                    placeholder="e.g., Ants"
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
                                    placeholder="e.g., ANT"
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
                                    placeholder="e.g., Solenopsis Invicta"
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
                                    Add Pest
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
