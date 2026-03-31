import React from "react";

export default function VideoPlayerPanel({ apiBase, token, video, canRetry, onRetry, isRetrying }) {
  if (!video) {
    return (
      <section className="panel player-panel empty-state">
        <h2>Select a video</h2>
        <p>Choose a processed item from the library to review metadata and streaming.</p>
      </section>
    );
  }

  const isPlayable = video.status === "ready" && (video.processedPath || video.uploadPath);

  return (
    <section className="panel player-panel">
      <div className="player-panel__header">
        <div>
          <p className="eyebrow">Streaming + review</p>
          <h2>{video.title}</h2>
        </div>
        <div className="status-stack">
          <span className={`status-pill status-pill--${video.status}`}>{video.status}</span>
          <span className={`status-pill status-pill--${video.sensitivity}`}>{video.sensitivity}</span>
        </div>
      </div>
      {isPlayable ? (
        <video
          key={video._id}
          controls
          className="player"
          src={`${apiBase}/videos/${video._id}/stream?token=${token}`}
        />
      ) : (
        <div className="player empty-player">
          <p>
            {video.status === "failed"
              ? "This video failed during processing and is not playable."
              : "This video is still processing or the file is unavailable."}
          </p>
          {canRetry ? (
            <button className="ghost-button" disabled={isRetrying} onClick={() => onRetry(video._id)}>
              {isRetrying ? "Retrying..." : "Retry processing"}
            </button>
          ) : null}
        </div>
      )}
      <div className="detail-grid">
        <div>
          <strong>Description</strong>
          <p>{video.description || "No description provided."}</p>
        </div>
        <div>
          <strong>Owner</strong>
          <p>{video.ownerId?.name || "Unknown"}</p>
        </div>
        <div>
          <strong>Progress</strong>
          <p>{video.progress}%</p>
        </div>
        <div>
          <strong>Duration</strong>
          <p>{video.durationSeconds || 0} seconds</p>
        </div>
        <div>
          <strong>File size</strong>
          <p>{Math.round((video.sizeInBytes || 0) / 1024)} KB</p>
        </div>
        <div>
          <strong>Analysis</strong>
          <p>{video.analysisNotes || "Pending automated review"}</p>
        </div>
        <div>
          <strong>Delivery</strong>
          <p>{video.streamUrl || "Stream URL will appear once processing completes"}</p>
        </div>
      </div>
    </section>
  );
}
