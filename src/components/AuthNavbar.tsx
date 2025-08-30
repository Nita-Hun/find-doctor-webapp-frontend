'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X } from 'react-feather';
import { ChevronDownIcon, UserIcon} from '@heroicons/react/24/outline';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { useUserProfile } from '@/hooks/userProfile'; 

export default function AuthNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, refetch } = useUserProfile();
  const pathname = usePathname(); 

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState('');
  const router = useRouter();

  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');
    router.push('/login');
  };

  const handlePhotoClick = () => {
    if (!uploading) inputFileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) return toast.error('File too large (max 2MB).');
    if (!file.type.startsWith('image/')) return toast.error('Invalid file type.');

    const token = localStorage.getItem('token');
    if (!token) return toast.error('You must be logged in.');

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiClient.post('/api/auth/upload-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      toast.success('Profile photo updated');
      await refetch();
      setCacheBuster(`?t=${Date.now()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
      if (inputFileRef.current) inputFileRef.current.value = '';
    }
  };

  const BACKEND_URL = 'http://localhost:8080';
  const photoSrc =
    user && user.profilePhotoUrl
      ? `${BACKEND_URL}${user.profilePhotoUrl}${cacheBuster}`
      : '/assets/images/avatar-placeholder.png';

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Specializations', href: '/public/specializations' },
    { name: 'About', href: '/public/about' },
    { name: 'Contact', href: '/public/contact' },
    { name: 'My Appointments', href: '/public/myAppointment' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            <div className="flex items-center gap-6">
              {/* Desktop Nav */}
              <div className="hidden md:flex gap-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative font-medium text-md transition-colors ${
                        isActive ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                      <motion.span
                        layout
                        initial={false}
                        animate={{ width: isActive ? '100%' : 0 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-blue-700"
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Hidden file input */}
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* User Dropdown */}
              {!loading && user && (
                <Menu as="div" className="relative hidden md:block">
                  <MenuButton className="flex items-center space-x-2 group focus:outline-none rounded-full">
                    <div
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-200 transition-all ${
                        uploading ? 'cursor-wait' : 'cursor-pointer'
                      }`}
                      onClick={handlePhotoClick}
                    >
                      <Image
                        src={photoSrc}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition" />
                  </MenuButton>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user.role}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user.email || 'No email'}</p>
                      </div>
                      <div className="py-1">
                        <MenuItem>
                          <MenuItem
                              as="button"
                              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                              onClick={() => router.push("/admin/profiles")}
                            >
                              <UserIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-blue-500" />
                              My Profile
                            </MenuItem>
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

              {/* Mobile Toggle */}
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      isActive ? 'text-blue-700 font-medium' : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {user && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <img
                    src={photoSrc}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="text-sm text-gray-600">{user.role}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      <div className="pt-16"></div>
    </>
  );
}
