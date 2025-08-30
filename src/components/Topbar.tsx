'use client';

import Image from "next/image";
import { useUserProfile } from "@/hooks/userProfile";
import { useRef, useState, useEffect } from "react";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { MenuButton, MenuItems, MenuItem, Menu, Transition } from "@headlessui/react";


export default function Topbar() {
  const { user, loading, refetch } = useUserProfile();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, [user]);

  const handlePhotoClick = () => {
    if (!uploading) {
      inputFileRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large (max 2MB).");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post(
        "/api/auth/upload-profile-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile photo updated");
      await refetch();
      setCacheBuster(`?t=${Date.now()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const BACKEND_URL = "http://localhost:8080";
  const photoSrc =
    user && user.profilePhotoUrl
      ? `${BACKEND_URL}${user.profilePhotoUrl}${cacheBuster}`
      : "/assets/images/default-admin.png";

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        {/* can add a logo or app name here if needed */}
      </div>

      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="animate-pulse flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
      ) : (
        <Menu as="div" className="relative">
          <MenuButton as="button" className="flex items-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 rounded-full">
            <div className="relative">
              <div className={`w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-200 transition-all ${uploading ? "cursor-wait" : "cursor-pointer"}`} onClick={handlePhotoClick}>
                <Image
                  src={photoSrc}
                  alt="Profile"
                  width={36}
                  height={36}
                  unoptimized
                  className="object-cover w-full h-full"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs text-gray-500 capitalize">{user?.role || "Role"}</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </MenuButton>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.role || "User"}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.email || user?.role || "Role"}</p>
              </div>
              <div className="py-1">
                <MenuItem
                  as="button"
                  className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => router.push("/admin/profiles")}
                >
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-blue-500" />
                  My Profile
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem
                  as="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-red-500" />
                  Sign out
                </MenuItem>

              </div>
            </MenuItems>
          </Transition>
        </Menu>
      )}
    </div>
  );
}