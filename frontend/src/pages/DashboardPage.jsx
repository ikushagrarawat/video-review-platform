import React, { useEffect, useState } from "react";
import api from "../api/client";
import AdminPanel from "../components/AdminPanel.jsx";
import CategoryManager from "../components/CategoryManager.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import Header from "../components/Header";
import UploadForm from "../components/UploadForm";
import VideoCard from "../components/VideoCard";
import VideoPlayerPanel from "../components/VideoPlayerPanel";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../hooks/useSocket";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const emptyFilters = {
  search: "",
  status: "",
  sensitivity: "",
  category: "",
  dateFrom: "",
  dateTo: "",
  minSize: "",
  maxSize: "",
  minDuration: "",
  maxDuration: ""
};

export default function DashboardPage() {
  const { logout, token, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState("");
  const [retryingVideoId, setRetryingVideoId] = useState("");

  if (!user) {
    return null;
  }

  const selectedVideo =
    videos.find((video) => video._id === selectedVideoId) || null;

  const loadVideos = async (activeFilters = filters) => {
    try {
      const response = await api.get("/videos", {
        params: Object.fromEntries(
          Object.entries(activeFilters).filter(([, value]) => value !== "")
        )
      });
      setVideos(response.data.videos);
      setSelectedVideoId((current) => current || response.data.videos[0]?._id || null);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load videos");
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await api.get("/videos/categories/options");
      setCategories(response.data.categories);
    };

    const loadUsers = async () => {
      if (user.role !== "admin") {
        return;
      }

      const response = await api.get("/users");
      setUsers(response.data.users);
    };

    loadCategories();
    loadUsers();
  }, [user.role]);

  useSocket({
    userId: user.id,
    onProgress: (payload) => {
      setVideos((currentVideos) =>
        currentVideos.map((video) =>
          video._id === payload.videoId ? { ...video, ...payload } : video
        )
      );
    }
  });

  const handleUpload = async (formData) => {
    try {
      setIsUploading(true);
      setError("");
      const response = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setVideos((currentVideos) => [response.data.video, ...currentVideos]);
      setSelectedVideoId(response.data.video._id);
      setCategories((current) =>
        current.some((category) => category.name === response.data.video.category)
          ? current
          : [...current, { id: response.data.video.category, name: response.data.video.category }]
              .sort((left, right) => left.name.localeCompare(right.name))
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = async () => {
    await loadVideos(filters);
  };

  const resetFilters = async () => {
    setFilters(emptyFilters);
    await loadVideos(emptyFilters);
  };

  const handleCreateUser = async (payload) => {
    try {
      setIsCreatingUser(true);
      setAdminError("");
      const response = await api.post("/users", payload);
      setUsers((current) => [response.data.user, ...current]);
    } catch (requestError) {
      setAdminError(requestError.response?.data?.message || "Unable to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateCategory = async (name) => {
    if (!name.trim()) {
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryError("");
      const response = await api.post("/categories", { name });
      setCategories((current) =>
        [...current, response.data.category].sort((left, right) =>
          left.name.localeCompare(right.name)
        )
      );
    } catch (requestError) {
      setCategoryError(requestError.response?.data?.message || "Unable to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      setDeletingVideoId(videoId);
      await api.delete(`/videos/${videoId}`);
      setVideos((current) => current.filter((video) => video._id !== videoId));
      setSelectedVideoId((current) => (current === videoId ? null : current));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete video");
    } finally {
      setDeletingVideoId("");
    }
  };

  const handleRetryVideo = async (videoId) => {
    try {
      setRetryingVideoId(videoId);
      const response = await api.post(`/videos/${videoId}/reprocess`);
      setVideos((current) =>
        current.map((video) => (video._id === videoId ? response.data.video : video))
      );
      setSelectedVideoId(videoId);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to retry processing");
    } finally {
      setRetryingVideoId("");
    }
  };

  return (
    <main className="dashboard-shell">
      <Header user={user} onLogout={logout} />
      <section className="dashboard-grid">
        <div className="left-column">
          <UploadForm
            canUpload={["editor", "admin"].includes(user.role)}
            isSubmitting={isUploading}
            onSubmit={handleUpload}
            categories={categories}
          />
          <FilterPanel
            filters={filters}
            categories={categories}
            onChange={handleFilterChange}
            onReset={resetFilters}
          />
          <button className="apply-button" onClick={applyFilters}>
            Apply filters
          </button>
          <section className="panel list-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Tenant-aware library</p>
                <h2>Uploaded videos</h2>
              </div>
              <button className="ghost-button" onClick={loadVideos}>
                Refresh
              </button>
            </div>
            <div className="video-list">
              {error ? <p className="error-text">{error}</p> : null}
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  selectedVideoId={selectedVideoId}
                  onSelect={setSelectedVideoId}
                  canDelete={["editor", "admin"].includes(user.role)}
                  onDelete={handleDeleteVideo}
                  isDeleting={deletingVideoId === video._id}
                  canRetry={["editor", "admin"].includes(user.role) && video.status !== "processing"}
                  onRetry={handleRetryVideo}
                  isRetrying={retryingVideoId === video._id}
                />
              ))}
              {!videos.length ? (
                <p className="empty-copy">No videos yet. Upload one to start the pipeline.</p>
              ) : null}
            </div>
          </section>
          {user.role === "admin" ? (
            <AdminPanel
              users={users}
              onCreateUser={handleCreateUser}
              isCreating={isCreatingUser}
              error={adminError}
            />
          ) : null}
          <CategoryManager
            categories={categories}
            canManage={["editor", "admin"].includes(user.role)}
            onCreateCategory={handleCreateCategory}
            isCreating={isCreatingCategory}
            error={categoryError}
          />
        </div>
        <VideoPlayerPanel
          apiBase={apiBase}
          token={token}
          video={selectedVideo}
          canRetry={
            !!selectedVideo &&
            ["editor", "admin"].includes(user.role) &&
            selectedVideo.status !== "processing"
          }
          onRetry={handleRetryVideo}
          isRetrying={retryingVideoId === selectedVideo?._id}
        />
      </section>
    </main>
  );
}
