'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ComponentType, SVGProps } from 'react';
import {
  UserCircleIcon,
  UsersIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import {
  FileEditIcon,
  HospitalIcon,
  LayoutDashboardIcon,
  HistoryIcon,
} from 'lucide-react';
import useCurrentUser from '@/hooks/useCurrentUser';

interface MenuItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  children?: MenuItem[];
}

const adminItems: MenuItem[] = [
  { label: 'Dashboards', icon: LayoutDashboardIcon, href: '/admin/dashboards' },
  { label: 'Doctors', icon: UserCircleIcon, href: '/admin/doctors' },
  { label: 'Patients', icon: UsersIcon, href: '/admin/patients' },
  { label: 'Appointments', icon: CalendarDaysIcon, href: '/admin/appointments' },
  { label: 'Specializations', icon: BriefcaseIcon, href: '/admin/specializations' },
  { label: 'Hospitals', icon: HospitalIcon, href: '/admin/hospitals' },
  { label: 'Feedbacks', icon: FileEditIcon, href: '/admin/feedbacks' },
  { label: 'Appointment Types', icon: ClipboardDocumentListIcon, href: '/admin/appointmentTypes' },
  {
    label: 'Transactions',
    icon: ListBulletIcon,
    children: [
      { label: 'Payments', icon: CurrencyDollarIcon, href: '/admin/payments' },
      { label: 'Payment History', icon: CalendarDaysIcon, href: '/admin/paymentViews' },
    ],
  },
  {
    label: 'Settings',
    icon: Cog6ToothIcon,
    children: [
      { label: 'Users', icon: UsersIcon, href: '/admin/users' },
      { label: 'Roles', icon: UserCircleIcon, href: '/admin/roles' },
    ],
  },
];

const doctorItems: MenuItem[] = [
  { label: 'Dashboards', icon: ClipboardDocumentListIcon, href: '/doctor/dashboards' },
  { label: 'Upcoming Appointments', icon: CalendarDaysIcon, href: '/doctor/appointments' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <nav className="p-4">
        <div className="text-sm text-gray-500">Loading menu...</div>
      </nav>
    );
  }
  if (!user || !user.role || user.role === 'PATIENT') return null;

  const menuItems = user.role === 'ADMIN' ? adminItems : doctorItems;

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.label];
    const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;
    const Icon = item.icon;

    return (
      <div key={item.label}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md text-sm ${
            isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {item.href ? (
            <Link href={item.href} className="flex flex-1 items-center gap-2">
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ) : (
            <div className="flex flex-1 items-center gap-2 cursor-default">
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </div>
          )}

          {hasChildren && (
            <button
              onClick={() => toggleMenu(item.label)}
              aria-label="Toggle Submenu"
              className="ml-auto"
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="p-4 space-y-2 overflow-y-auto">
      {menuItems.map((item) => renderMenuItem(item))}
    </nav>
  );
}
