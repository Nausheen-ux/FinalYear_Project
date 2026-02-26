import React from "react";

const CATEGORIES = [
  "All",
  "Part-Time Jobs",
  "City Services",
  "Cafes & Restaurants",
  "Events & Meetups",
  "Accommodation Tips",
  "Transportation",
  "Study Groups",
  "General Discussion"
];

const CITIES = [
  "All",
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune"
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostLiked", label: "Most Liked" }
];

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="row g-3">
          {/* Search */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
          </div>

          {/* Category Filter */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="col-md-2">
            <label className="form-label fw-bold">City</label>
            <select
              className="form-select"
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Sort By</label>
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}