'use client';

import { useUserProfile } from "@/hooks/userProfile";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const { user, loading, refetch } = useUserProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load user profile.</p>
      </div>
    );
  }

  return <ProfileForm user={user} refetch={refetch} />;
}

