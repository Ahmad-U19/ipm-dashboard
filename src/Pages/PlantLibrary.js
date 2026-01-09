import React, { useEffect, useMemo, useState } from "react";
import librarypic from "../Data/book.png";
import "./plantLibrary.css";

// Sample plant data - replace with actual API/database call
const SAMPLE_PLANTS = [
  {
    id: 1,
    icon: "🌱",
    name: "Beans",
    abbreviation: "Be",
    category: "Beans",
  },
  {
    id: 2,
    icon: "🍅",
    name: "Beefsteak",
    abbreviation: "BF",
    category: "Tomato",
  },
  {
    id: 3,
    icon: "🥬",
    name: "Cabbage",
    abbreviation: "Cb",
    category: "Cabbage",
  },
  {
    id: 4,
    icon: "🌿",
    name: "Cannabis",
    abbreviation: "Ca",
    category: "Cannabis",
  },
  {
    id: 5,
    icon: "🍊",
    name: "Citrus Fruit",
    abbreviation: "Cf",
    category: "Citrus Fruit",
  },
  {
    id: 6,
    icon: "🍅",
    name: "Cocktail",
    abbreviation: "CT",
    category: "Tomato",
  },
  {
    id: 7,
    icon: "🥒",
    name: "Cucumber",
    abbreviation: "Cu",
    category: "Cucumber",
  },
  {
    id: 8,
    icon: "🍆",
    name: "Eggplant",
    abbreviation: "Eg",
    category: "Eggplant",
  },
  {
    id: 9,
    icon: "🌿",
    name: "Garden Plant",
    abbreviation: "Gp",
    category: "Garden Plant",
  },
  {
    id: 10,
    icon: "🌸",
    name: "Ground Flower",
    abbreviation: "Gf",
    category: "Ground Flower",
  },
  {
    id: 11,
    icon: "🌱",
    name: "Lettuce",
    abbreviation: "Le",
    category: "Lettuce",
  },
  {
    id: 12,
    icon: "🌶️",
    name: "Pepper",
    abbreviation: "Pe",
    category: "Pepper",
  },
  {
    id: 13,
    icon: "🥔",
    name: "Potato",
    abbreviation: "Po",
    category: "Potato",
  },
  {
    id: 14,
    icon: "🍅",
    name: "Roma",
    abbreviation: "Ro",
    category: "Tomato",
  },
  {
    id: 15,
    icon: "🌿",
    name: "Spinach",
    abbreviation: "Sp",
    category: "Spinach",
  },
  {
    id: 16,
    icon: "🍓",
    name: "Strawberry",
    abbreviation: "St",
    category: "Strawberry",
  },
  {
    id: 17,
    icon: "🍅",
    name: "Tomato",
    abbreviation: "To",
    category: "Tomato",
  },
  {
    id: 18,
    icon: "🥕",
    name: "Carrot",
    abbreviation: "Ca",
    category: "Root Vegetable",
  },
  {
    id: 19,
    icon: "🥦",
    name: "Broccoli",
    abbreviation: "Br",
    category: "Brassica",
  },
  {
    id: 20,
    icon: "🌽",
    name: "Corn",
    abbreviation: "Co",
    category: "Grain",
  },
];

export default function PlantLibrary() {
  const [plants, setPlants] = useState(SAMPLE_PLANTS);
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
    document.title = "Plant Library | IPM Scoutek";
  }, []);

  // Filter plants based on search and tab
  const filteredPlants = useMemo(() => {
    let filtered = plants;

    // Filter by tab
    if (activeTab === "your") {
      // For now, show first 4 as "your plants" - replace with actual user filter
      filtered = plants.slice(0, 4);
    }

    // Filter by search
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(term) ||
          plant.abbreviation.toLowerCase().includes(term) ||
          plant.category.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [plants, activeTab, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlants = filteredPlants.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const allPlantsCount = plants.length;
  const yourPlantsCount = 4; // Replace with actual count

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
    } else if (formData.abbreviation.length > 10) {
      errors.abbreviation = "Abbreviation must be 10 characters or less";
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

    // Create new plant
    const newPlant = {
      id: Date.now(), // Simple ID generation - replace with proper ID from API
      icon: formData.icon.trim(),
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim().toUpperCase(),
      category: formData.category.trim(),
    };

    // Add to plants list
    setPlants((prev) => [newPlant, ...prev]);
    
    // Reset form and close modal
    handleCloseModal();
    
    // Reset to first page to show the new plant
    setCurrentPage(1);
  };

  return (
    <div className="plant-library-page">
      <div className="heading">
        <div className="heading-left">
          <img className="heading-icon" src={librarypic} alt="Plant Library" />
          <h4>Plant Library</h4>
        </div>
        <button 
          className="primary-circle-btn" 
          aria-label="Add plant"
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
              All Plants <span className="tab-count">{allPlantsCount}</span>
            </button>
            <button
              className={`tab ${activeTab === "your" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("your");
                setCurrentPage(1);
              }}
            >
              Your Plants <span className="tab-count">{yourPlantsCount}</span>
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
          {loading && <p className="muted">Loading plants...</p>}
          {!loading && filteredPlants.length === 0 && (
            <p className="muted">No plants found.</p>
          )}

          {!loading && paginatedPlants.length > 0 && (
            <table className="plant-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Abbreviation</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlants.map((plant) => (
                  <tr key={plant.id}>
                    <td>
                      <span className="plant-icon">{plant.icon}</span>
                    </td>
                    <td>{plant.name}</td>
                    <td>{plant.abbreviation}</td>
                    <td>{plant.category}</td>
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

      {/* Add Plant Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Plant</h3>
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
                  placeholder="e.g., 🌱"
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
                  placeholder="e.g., Tomato"
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
                  placeholder="e.g., To"
                  maxLength="10"
                  className={formErrors.abbreviation ? "error-input" : ""}
                />
                {formErrors.abbreviation && (
                  <span className="error-message">{formErrors.abbreviation}</span>
                )}
                <small className="form-hint">Maximum 10 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Tomato"
                  className={formErrors.category ? "error-input" : ""}
                />
                {formErrors.category && (
                  <span className="error-message">{formErrors.category}</span>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
