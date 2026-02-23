import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./diseaseLibrary.css";


export const SAMPLE_DISEASES = [
    {
        id: 1,
        icon: "🦠",
        name: "Bacteria",
        abbreviation: "BA",
        category: "Bacteria",
    },
    {
        id: 2,
        icon: "🍂",
        name: "Bacterial Canker",
        abbreviation: "BC",
        category: "Bacterial Canker",
    },
    {
        id: 3,
        icon: "🥀",
        name: "Bacterial Wilt",
        abbreviation: "BW",
        category: "Bacterial Wilt",
    },
    {
        id: 4,
        icon: "🍅",
        name: "Blossom End ROT",
        abbreviation: "BER",
        category: "Blossom End ROT",
    },
    {
        id: 5,
        icon: "🍃",
        name: "Blotchy Ripening",
        abbreviation: "BLR",
        category: "Blotchy Ripening",
    },
    {
        id: 6,
        icon: "🍄",
        name: "Botrytis Grey Mould",
        abbreviation: "GM",
        category: "Botrytis Grey Mould",
    },
    {
        id: 7,
        icon: "📉",
        name: "Discolouring",
        abbreviation: "DC",
        category: "Discolouring",
    },
    {
        id: 8,
        icon: "🍂",
        name: "Distortion",
        abbreviation: "DT",
        category: "Distortion",
    },
    {
        id: 9,
        icon: "🌫️",
        name: "Downy Mildew",
        abbreviation: "DM",
        category: "Downy Mildew",
    },
    {
        id: 10,
        icon: "🍄",
        name: "Fungi / Mold / Mildew",
        abbreviation: "FM",
        category: "Fungi / Mold / Mildew",
    },
];

export default function DiseaseLibrary() {
    const [diseases, setDiseases] = useState(SAMPLE_DISEASES);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        icon: "",
        name: "",
        abbreviation: "",
        category: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        document.title = "Disease Library | IPM Scoutek";
    }, []);


    const filteredDiseases = useMemo(() => {
        let filtered = diseases;


        if (activeTab === "your") {

            filtered = diseases.slice(0, 5);
        }


        if (search.trim()) {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(
                (disease) =>
                    disease.name.toLowerCase().includes(term) ||
                    disease.abbreviation.toLowerCase().includes(term) ||
                    disease.category.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [diseases, activeTab, search]);


    const totalPages = Math.ceil(filteredDiseases.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDiseases = filteredDiseases.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const allDiseasesCount = diseases.length;
    const yourDiseasesCount = 5; // Replace with actual count

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
        setFormData({ icon: "", name: "", abbreviation: "", category: "" });
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setFormData({ icon: "", name: "", abbreviation: "", category: "" });
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
        }
        if (!formData.category.trim()) {
            errors.category = "Category is required";
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

        const newDisease = {
            id: Date.now(),
            icon: formData.icon.trim(),
            name: formData.name.trim(),
            abbreviation: formData.abbreviation.trim().toUpperCase(),
            category: formData.category.trim(),
        };

        setDiseases((prev) => [newDisease, ...prev]);
        handleCloseModal();
        setCurrentPage(1);
    };

    return (
        <div className="disease-library-page">
            <div className="heading">
                <div className="heading-left">
                    <img className="heading-icon" src={librarypic} alt="Disease Library" />
                    <h4>Disease Library</h4>
                </div>
                <button
                    className="primary-circle-btn"
                    aria-label="Add disease"
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
                            All Diseases <span className="tab-count">{allDiseasesCount}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === "your" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("your");
                                setCurrentPage(1);
                            }}
                        >
                            Your Diseases <span className="tab-count">{yourDiseasesCount}</span>
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
                    {loading && <p className="muted">Loading diseases...</p>}
                    {!loading && filteredDiseases.length === 0 && (
                        <p className="muted">No diseases found.</p>
                    )}

                    {!loading && paginatedDiseases.length > 0 && (
                        <table className="disease-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Name</th>
                                    <th>Abbreviation</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDiseases.map((disease) => (
                                    <tr key={disease.id}>
                                        <td>
                                            <span className="disease-icon">{disease.icon}</span>
                                        </td>
                                        <td>{disease.name}</td>
                                        <td>{disease.abbreviation}</td>
                                        <td>{disease.category}</td>
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

            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Disease</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="icon">Icon <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="icon"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 🦠"
                                    maxLength="2"
                                    className={formErrors.icon ? "error-input" : ""}
                                />
                                {formErrors.icon && <span className="error-message">{formErrors.icon}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bacteria"
                                    className={formErrors.name ? "error-input" : ""}
                                />
                                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="abbreviation">Abbreviation <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="abbreviation"
                                    name="abbreviation"
                                    value={formData.abbreviation}
                                    onChange={handleInputChange}
                                    placeholder="e.g., BA"
                                    maxLength="10"
                                    className={formErrors.abbreviation ? "error-input" : ""}
                                />
                                {formErrors.abbreviation && <span className="error-message">{formErrors.abbreviation}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bacteria"
                                    className={formErrors.category ? "error-input" : ""}
                                />
                                {formErrors.category && <span className="error-message">{formErrors.category}</span>}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-submit">Add Disease</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
