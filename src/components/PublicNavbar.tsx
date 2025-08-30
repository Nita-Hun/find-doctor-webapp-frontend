'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'react-feather';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Specializations', href: '/public/specializations' },
    { name: 'About', href: '/public/about' },
    { name: 'Contact', href: '/public/contact' },
  ];

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            <div className="flex items-center gap-6">
              {/* Desktop Navigation */}
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
                      {/* Active underline */}
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

              {/* Desktop Auth Buttons */}
              {!isAuthenticated && (
                <div className="hidden md:flex gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-lg font-medium text-sm text-pink-600 hover:bg-pink-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-md transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
            <div className="px-6 py-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-pink-600 py-2 px-4 rounded-lg hover:bg-gray-50 active:bg-transparent focus:bg-transparent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {!isAuthenticated && (
                  <div className="flex gap-3 mt-2">
                    <Link
                      href="/login"
                      className="flex-1 text-center px-4 py-2 rounded-lg font-medium text-sm text-pink-600 hover:bg-pink-50 active:bg-transparent focus:bg-transparent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-md active:bg-gradient-to-r focus:bg-gradient-to-r transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Padding for fixed navbar */}
      <div className="pt-16"></div>
    </>
  );
}
