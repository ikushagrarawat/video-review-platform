import React, { useState } from "react";

export default function CategoryManager({
  categories,
  canManage,
  onCreateCategory,
  isCreating,
  error
}) {
  const [name, setName] = useState("");

  return (
    <section className="panel admin-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Custom categories</p>
          <h2>Tenant category library</h2>
        </div>
      </div>

      {canManage ? (
        <form
          className="admin-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await onCreateCategory(name);
            setName("");
          }}
        >
          <label>
            New category
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button disabled={isCreating}>{isCreating ? "Creating..." : "Add category"}</button>
        </form>
      ) : null}

      <div className="chip-list">
        {categories.map((category) => (
          <span className="chip" key={category.id || category.name}>
            {category.name}
          </span>
        ))}
      </div>
    </section>
  );
}
