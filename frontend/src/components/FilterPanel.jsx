import React from "react";

export default function FilterPanel({ filters, onChange, onReset, categories }) {
  return (
    <section className="panel filter-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Metadata filtering</p>
          <h2>Search and refine</h2>
        </div>
        <button className="ghost-button" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="filter-grid">
        <label>
          Search
          <input
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="title, description, category"
          />
        </label>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="">all</option>
            <option value="processing">processing</option>
            <option value="ready">ready</option>
            <option value="failed">failed</option>
          </select>
        </label>
        <label>
          Sensitivity
          <select
            value={filters.sensitivity}
            onChange={(event) => onChange("sensitivity", event.target.value)}
          >
            <option value="">all</option>
            <option value="pending">pending</option>
            <option value="safe">safe</option>
            <option value="flagged">flagged</option>
          </select>
        </label>
        <label>
          Category
          <select
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
          >
            <option value="">all</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date from
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange("dateFrom", event.target.value)}
          />
        </label>
        <label>
          Date to
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange("dateTo", event.target.value)}
          />
        </label>
        <label>
          Min size (bytes)
          <input
            type="number"
            value={filters.minSize}
            onChange={(event) => onChange("minSize", event.target.value)}
          />
        </label>
        <label>
          Max size (bytes)
          <input
            type="number"
            value={filters.maxSize}
            onChange={(event) => onChange("maxSize", event.target.value)}
          />
        </label>
        <label>
          Min duration (sec)
          <input
            type="number"
            value={filters.minDuration}
            onChange={(event) => onChange("minDuration", event.target.value)}
          />
        </label>
        <label>
          Max duration (sec)
          <input
            type="number"
            value={filters.maxDuration}
            onChange={(event) => onChange("maxDuration", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
