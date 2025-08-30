'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  AreaChart, Area,
} from 'recharts';
import { FaUserMd, FaClinicMedical, FaRegCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { IoMdPulse } from 'react-icons/io';
import { BsActivity, BsArrowUpRight, BsArrowDownRight } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    specializations: 0,
  });
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          countsRes,
          revenueRes,
          statsRes,
          upcomingRes,
          weeklyRes,
          recentRes
        ] = await Promise.all([
          apiClient.get('/api/dashboards/counts'),
          apiClient.get('/api/dashboards/revenue'),
          apiClient.get('/api/dashboards/stats'),
          apiClient.get('/api/dashboards/appointments/upcoming'),
          apiClient.get('/api/dashboards/appointments/weekly'),
          apiClient.get('/api/dashboards/activity/recent')
        ]);

        setCounts(countsRes.data);
        setRevenueData(revenueRes.data);
        setStats(statsRes.data);
        setUpcomingAppointments(upcomingRes.data);
        setWeeklyAppointments(weeklyRes.data);
        setRecentActivities(recentRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </motion.div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-6 bg-white rounded-xl shadow-sm max-w-md text-center border border-gray-100"
      >
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
        >
          Retry
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            icon={<FaUserMd size={20} className="text-indigo-600" />} 
            label="Doctors" 
            value={counts.doctors} 
            trend="up"
            trendValue="12%"
            color="indigo"
          />
          <SummaryCard 
            icon={<FiUsers size={20} className="text-emerald-600" />} 
            label="Patients" 
            value={counts.patients} 
            trend="up"
            trendValue="24%"
            color="emerald"
          />
          <SummaryCard 
            icon={<FiCalendar size={20} className="text-amber-600" />} 
            label="Appointments" 
            value={counts.appointments} 
            trend="down"
            trendValue="8%"
            color="amber"
          />
          <SummaryCard 
            icon={<FaClinicMedical size={20} className="text-violet-600" />} 
            label="Specializations" 
            value={counts.specializations} 
            trend="neutral"
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard 
            title="Revenue Trend" 
            icon={<FiDollarSign size={20} className="text-emerald-500" />}
            subtitle="Last 12 months"
            action={() => console.log('View revenue report')}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `$${value}k`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`$${value}k`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                  activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#FFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="Weekly Activity" 
            icon={<BsActivity size={20} className="text-indigo-500" />}
            subtitle="Current week"
            action={() => console.log('View weekly report')}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar 
                  dataKey="appointments" 
                  name="Appointments" 
                  fill="#6366F1" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UpcomingAppointments appointments={upcomingAppointments} />
          <RecentActivity activities={recentActivities} />
          <StatsCard stats={stats} />
        </div>
      </div>
    </div>
  );
}



// Components
function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg shadow-xs border border-gray-100">
        <FiClock className="text-gray-400" size={18} />
        <span className="text-sm font-medium text-gray-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, trend, trendValue, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'indigo' | 'emerald' | 'amber' | 'violet';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
    violet: 'bg-violet-50'
  };

  const trendClasses = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-white shadow-xs">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
        
        {trend && (
          <div className={`text-xs font-medium flex items-center gap-1 ${trendClasses[trend]}`}>
            {trend === 'up' ? (
              <BsArrowUpRight size={14} />
            ) : trend === 'down' ? (
              <BsArrowDownRight size={14} />
            ) : (
              <span>→</span>
            )}
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, icon, children, action }: { 
  title: string; 
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: () => void;
}) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-gray-50 rounded-lg">
              {icon}
            </div>
          )}
          {action && (
            <button 
              onClick={action}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View report <FaChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function UpcomingAppointments({ appointments }: { appointments: any[] }) {
  const router = useRouter(); 
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
        <button
          onClick={() => router.push('/admin/appointments')}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <FaChevronRight size={12} />
        </button>
      </div>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <FaRegCalendarAlt className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        ) : (
          appointments.slice(0, 5).map(appt => (
            <motion.div 
              whileHover={{ x: 2 }}
              key={appt.id} 
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/appointments/${appt.id}`)}
            >
              <div className={`p-2.5 rounded-lg ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <FiCalendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800 truncate">{appt.patientName}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{appt.typeName}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-gray-400">With</span>
                  <span className="text-xs font-medium text-indigo-600">{appt.doctorName}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          View All <FaChevronRight size={12} />
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <IoMdPulse className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex gap-3 group">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function StatsCard({ stats }: { stats: any }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-6">Clinic Stats</h2>
      
      <div className="space-y-5">
        {[
          {
            icon: <FiDollarSign size={18} className="text-indigo-600" />,
            title: "Total Revenue",
            value: `$${stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString() : '0'}`,
            trend: "up",
            trendValue: "12%",
            trendColor: "text-emerald-600"
          },
          {
            icon: <FiCalendar size={18} className="text-emerald-600" />,
            title: "Avg. Appointments",
            value: `${stats?.avgAppointments || '0'}/day`,
            trend: "up",
            trendValue: "5%",
            trendColor: "text-emerald-600"
          },
          {
            icon: <FaUserMd size={18} className="text-amber-600" />,
            title: "Patient Growth",
            value: `${stats?.patientGrowth || '0'}%`,
            trend: "down",
            trendValue: "2%",
            trendColor: "text-red-600"
          }
        ].map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-50">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-lg font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium flex items-center gap-1 ${stat.trendColor}`}>
              {stat.trend === "up" ? (
                <BsArrowUpRight size={14} />
              ) : (
                <BsArrowDownRight size={14} />
              )}
              {stat.trendValue}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}