import React from "react";

export default function VideoCard({
  video,
  selectedVideoId,
  onSelect,
  canDelete,
  onDelete,
  isDeleting
}) {
  return (
    <div className={`video-card-shell ${selectedVideoId === video._id ? "video-card--active" : ""}`}>
      <button className="video-card" onClick={() => onSelect(video._id)}>
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
      {canDelete ? (
        <button
          className="ghost-button delete-button"
          disabled={isDeleting}
          onClick={() => onDelete(video._id)}
          type="button"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      ) : null}
      {video.status === "failed" ? (
        <p className="error-text">Processing failed. Upload again or delete this record.</p>
      ) : null}
      {video.status === "ready" && !video.processedPath && !video.uploadPath ? (
        <p className="error-text">This record has no playable file path.</p>
      ) : null}
    </div>
  );
}
