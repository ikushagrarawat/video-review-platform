import React from "react";

export default function VideoCard({ video, selectedVideoId, onSelect }) {
  return (
    <button
      className={`video-card ${selectedVideoId === video._id ? "video-card--active" : ""}`}
      onClick={() => onSelect(video._id)}
    >
      <div className="video-card__header">
        <div>
          <h3>{video.title}</h3>
          <p>{video.category}</p>
        </div>
        <span className={`status-pill status-pill--${video.status}`}>{video.status}</span>
      </div>
      <div className="video-card__meta">
        <span>Sensitivity: {video.sensitivity}</span>
        <span>Progress: {video.progress}%</span>
      </div>
      <div className="video-card__meta">
        <span>{Math.round((video.sizeInBytes || 0) / 1024)} KB</span>
        <span>{video.durationSeconds || 0}s</span>
      </div>
    </button>
  );
}
