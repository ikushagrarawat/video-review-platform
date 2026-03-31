import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Full Stack Assignment MVP</p>
        <h1>Video Sensitivity Dashboard</h1>
      </div>
      <div className="topbar__user">
        <div>
          <strong>{user.name}</strong>
          <p>
            {user.role} · {user.organizationId}
          </p>
        </div>
        <button className="ghost-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
