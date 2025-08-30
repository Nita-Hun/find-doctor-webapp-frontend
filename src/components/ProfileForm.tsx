'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { UserDto } from "@/dto/userDto";

interface Props {
  user: UserDto;
  refetch: () => Promise<void>;
}

export default function ProfileForm({ user, refetch }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const updateRes = await apiClient.put(
        "/api/auth/update-profile",
        {
          email: user.email,
          password: newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (updateRes.data.accessToken) {
        localStorage.setItem("token", updateRes.data.accessToken);
      }

      toast.success("Profile updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      await refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Update Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
