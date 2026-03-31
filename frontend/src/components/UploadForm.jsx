import React, { useState } from "react";

export default function UploadForm({ canUpload, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState("");

  const captureDuration = (nextFile) => {
    if (!nextFile) {
      setDurationSeconds("");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      setDurationSeconds(String(Math.round(video.duration || 0)));
    };
    video.src = URL.createObjectURL(nextFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("durationSeconds", durationSeconds || "0");
    formData.append("video", file);
    onSubmit(formData);
  };

  return (
    <form className="panel upload-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Editor and admin roles only</p>
        <h2>Upload a video</h2>
      </div>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        Description
        <textarea
          rows="3"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Category
        <input value={category} onChange={(event) => setCategory(event.target.value)} />
      </label>
      <label>
        Duration (auto-detected seconds)
        <input value={durationSeconds} readOnly />
      </label>
      <label>
        Video file
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] || null;
            setFile(nextFile);
            captureDuration(nextFile);
          }}
        />
      </label>
      <button disabled={!canUpload || isSubmitting}>
        {isSubmitting ? "Uploading..." : canUpload ? "Upload and process" : "Viewer access only"}
      </button>
    </form>
  );
}
