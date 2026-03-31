import React, { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "viewer"
};

export default function AdminPanel({ users, onCreateUser, isCreating, error }) {
  const [form, setForm] = useState(initialForm);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="panel admin-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">RBAC and tenant users</p>
          <h2>Admin controls</h2>
        </div>
      </div>

      <form
        className="admin-form"
        onSubmit={async (event) => {
          event.preventDefault();
          await onCreateUser(form);
          setForm(initialForm);
        }}
      >
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label>
          Email
          <input
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </label>
        <label>
          Role
          <select
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
          >
            <option value="viewer">viewer</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button disabled={isCreating}>
          {isCreating ? "Creating..." : "Create tenant user"}
        </button>
      </form>

      <div className="user-list">
        {users.map((user) => (
          <div className="user-row" key={user._id || user.id}>
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
            </div>
            <span className="status-pill">{user.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
