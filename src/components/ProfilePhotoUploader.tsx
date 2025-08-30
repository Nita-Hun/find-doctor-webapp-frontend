'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";

export default function ProfilePhotoUploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post(
        "/api/auth/users/upload-profile-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile photo updated!");
      onUploadSuccess(); 
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
