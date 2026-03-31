import React, { useState } from "react";

export default function AuthForm({ mode, onSubmit, isLoading, error }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    name: "",
    email: "editor@acme.test",
    password: "password123",
    organizationId: "acme",
    role: "viewer"
  });

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="panel form-panel"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div>
        <p className="eyebrow">
          {isRegister ? "Create a tenant-scoped account" : "Demo credentials prefilled"}
        </p>
        <h1>{isRegister ? "Create your account" : "Sign in to continue"}</h1>
      </div>

      {isRegister ? (
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
      ) : null}

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

      {isRegister ? (
        <>
          <label>
            Organization
            <input
              value={form.organizationId}
              onChange={(event) => updateField("organizationId", event.target.value)}
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
            </select>
          </label>
        </>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      <button disabled={isLoading}>
        {isLoading
          ? isRegister
            ? "Creating account..."
            : "Signing in..."
          : isRegister
            ? "Register"
            : "Login"}
      </button>
    </form>
  );
}
