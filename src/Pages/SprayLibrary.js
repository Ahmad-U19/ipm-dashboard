import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./sprayLibrary.css";

// Sample spray data based on the image provided
const SAMPLE_SPRAYS = [
    {
        id: 1,
        productName: "Abode essential oil",
        abbreviation: "ABE",
        activeIngredient: "Citurs Aurantifolia, Litsea Cubeba, Cinnamomum Cassia, Eucalyptus Citriodora, Melaleuca Alterrnifolia, Thuja Plicata, Eucalyptus Kochii, Coriandrum Sativum. Lavendin, Lemon Myrtle",
        code: "",
        type: "Fungicide",
        productLabel: "Search Health Canada"
    },
    {
        id: 2,
        productName: "Acadian",
        abbreviation: "ACA",
        activeIngredient: "Seaweed + Microelement",
        code: "",
        type: "Fungicide",
        productLabel: "Search Health Canada"
    },
    {
        id: 3,
        productName: "Acari Out 70 EC",
        abbreviation: "ACR",
        activeIngredient: "Monolaureato de Propilenglicol",
        code: "",
        type: "Insecticide",
        productLabel: "Search Health Canada"
    },
    {
        id: 4,
        productName: "Acaristop 50 SC",
        abbreviation: "ACR",
        activeIngredient: "Monolaureato de Propilenglicol",
        code: "",
        type: "Insecticide",
        productLabel: "Search Health Canada"
    },
    {
        id: 5,
        productName: "Acelepryn",
        abbreviation: "AC",
        activeIngredient: "chlorantraniliprole",
        code: "",
        type: "Insecticide",
        productLabel: "Search Health Canada"
    },
    {
        id: 6,
        productName: "Acrimite",
        abbreviation: "ACR",
        activeIngredient: "Fenbutatin Oxide",
        code: "",
        type: "Insecticide",
        productLabel: "Search Health Canada"
    },
    {
        id: 7,
        productName: "Acrobat",
        abbreviation: "ACB",
        activeIngredient: "Dimethomorph + Mancozeb",
        code: "",
        type: "Fungicide",
        productLabel: "Search Health Canada"
    },
    {
        id: 8,
        productName: "Acrobat 50 WP",
        abbreviation: "AD",
        activeIngredient: "dimethomorph",
        code: "",
        type: "Fungicide",
        productLabel: "Search Health Canada"
    },
    {
        id: 9,
        productName: "Acrobat CT",
        abbreviation: "ACR",
        activeIngredient: "Dimethomorph + Chlorothalonil",
        code: "",
        type: "Fungicide",
        productLabel: "Search Health Canada"
    },
    {
        id: 10,
        productName: "Actara",
        abbreviation: "ACT",
        activeIngredient: "Thiametoxam",
        code: "",
        type: "Insecticide",
        productLabel: "Search Health Canada"
    }
];

export default function SprayLibrary() {
    const [sprays, setSprays] = useState(SAMPLE_SPRAYS);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        productName: "",
        abbreviation: "",
        activeIngredient: "",
        code: "",
        type: "",
        productLabel: "Search Health Canada"
    });
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        document.title = "Spray Library | IPM Scoutek";
    }, []);

    // Filter sprays based on search and tab
    const filteredSprays = useMemo(() => {
        let filtered = sprays;

        // Filter by tab
        if (activeTab === "your") {
            // For now, show last 1 as "your sprays" - replace with actual user filter
            filtered = sprays.slice(-1);
        }

        // Filter by search
        if (search.trim()) {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(
                (spray) =>
                    spray.productName.toLowerCase().includes(term) ||
                    spray.abbreviation.toLowerCase().includes(term) ||
                    spray.activeIngredient.toLowerCase().includes(term) ||
                    spray.type.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [sprays, activeTab, search]);

    // Pagination
    const totalPages = Math.ceil(filteredSprays.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSprays = filteredSprays.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const allSpraysCount = 828; // Hardcoded to match image, though our sample is smaller
    const yourSpraysCount = 1; // Hardcoded to match image

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
        setFormData({
            productName: "",
            abbreviation: "",
            activeIngredient: "",
            code: "",
            type: "",
            productLabel: "Search Health Canada"
        });
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setFormData({
            productName: "",
            abbreviation: "",
            activeIngredient: "",
            code: "",
            type: "",
            productLabel: "Search Health Canada"
        });
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
        if (!formData.productName.trim()) {
            errors.productName = "Product Name is required";
        }
        if (!formData.abbreviation.trim()) {
            errors.abbreviation = "Abbreviation is required";
        }
        if (!formData.activeIngredient.trim()) {
            errors.activeIngredient = "Active Ingredient is required";
        }
        if (!formData.type.trim()) {
            errors.type = "Type is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Create new spray
        const newSpray = {
            id: Date.now(),
            productName: formData.productName.trim(),
            abbreviation: formData.abbreviation.trim().toUpperCase(),
            activeIngredient: formData.activeIngredient.trim(),
            code: formData.code.trim(),
            type: formData.type.trim(),
            productLabel: formData.productLabel.trim()
        };

        // Add to sprays list
        setSprays((prev) => [newSpray, ...prev]);

        // Reset form and close modal
        handleCloseModal();

        // Reset to first page to show the new spray
        setCurrentPage(1);
    };

    return (
        <div className="spray-library-page">
            <div className="heading">
                <div className="heading-left">
                    <img className="heading-icon" src={librarypic} alt="Spray Library" />
                    <h4>Spray Library</h4>
                </div>
                <button
                    className="primary-circle-btn"
                    aria-label="Add spray"
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
                            All Sprays <span className="tab-count">{allSpraysCount}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === "your" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("your");
                                setCurrentPage(1);
                            }}
                        >
                            Your Sprays <span className="tab-count">{yourSpraysCount}</span>
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
                    {loading && <p className="muted">Loading sprays...</p>}
                    {!loading && filteredSprays.length === 0 && (
                        <p className="muted">No sprays found.</p>
                    )}

                    {!loading && paginatedSprays.length > 0 && (
                        <table className="spray-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Product Name</th>
                                    <th>Abbreviation</th>
                                    <th>Active Ingredient Name</th>
                                    <th>Code</th>
                                    <th>Type</th>
                                    <th>Product Label</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSprays.map((spray) => (
                                    <tr key={spray.id}>
                                        <td>
                                            <div className="spray-icon-container">
                                                <div className="spray-icon-circle">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#2dc55f">
                                                        <path d="M19,8V7H17V8H19M13,8V7H11V8H13M7,8V7H5V8H7M21,10V20H3V10H21M21,8H19V4H17V8H15V4H13V8H11V4H9V8H7V4H5V8H3V22H21V8Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{spray.productName}</td>
                                        <td>{spray.abbreviation}</td>
                                        <td className="active-ingredient-cell">{spray.activeIngredient}</td>
                                        <td>{spray.code}</td>
                                        <td>{spray.type}</td>
                                        <td>
                                            <a href="#" className="label-link" onClick={(e) => e.preventDefault()}>
                                                {spray.productLabel}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="table-footer">
                    <span className="muted">
                        Page {currentPage} of {totalPages || 83}
                    </span>
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ←
                        </button>
                        {[1, 2, 3, '...', totalPages || 83].map((page, index) => (
                            <button
                                key={index}
                                className={`page-btn ${currentPage === page ? "active" : ""}`}
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={currentPage === page || typeof page !== 'number'}
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
                                max={totalPages || 83}
                                value={currentPage}
                                onChange={handleGoToPage}
                                className="page-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Spray Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Spray</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="productName">
                                    Product Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Abode essential oil"
                                    className={formErrors.productName ? "error-input" : ""}
                                />
                                {formErrors.productName && (
                                    <span className="error-message">{formErrors.productName}</span>
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
                                    placeholder="e.g., ABE"
                                    className={formErrors.abbreviation ? "error-input" : ""}
                                />
                                {formErrors.abbreviation && (
                                    <span className="error-message">{formErrors.abbreviation}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="activeIngredient">
                                    Active Ingredient <span className="required">*</span>
                                </label>
                                <textarea
                                    id="activeIngredient"
                                    name="activeIngredient"
                                    value={formData.activeIngredient}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Citurs Aurantifolia..."
                                    className={formErrors.activeIngredient ? "error-input" : ""}
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                                {formErrors.activeIngredient && (
                                    <span className="error-message">{formErrors.activeIngredient}</span>
                                )}
                            </div>

                            <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="code">Code</label>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g., C-123"
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="type">
                                        Type <span className="required">*</span>
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className={formErrors.type ? "error-input" : ""}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Fungicide">Fungicide</option>
                                        <option value="Insecticide">Insecticide</option>
                                        <option value="Herbicide">Herbicide</option>
                                        <option value="Fertilizer">Fertilizer</option>
                                    </select>
                                    {formErrors.type && (
                                        <span className="error-message">{formErrors.type}</span>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Spray
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
