// src/pages/admin/AdminDashboard.jsx
import MainDashboard from './MainDashboard';
import DashboardStats from './DashboardStats';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,248', change: '+12%', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Active Teachers', value: '42', change: '+5%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Pending Payments', value: '78,450', change: '-3%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'New Messages', value: '12', change: '+20%', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return (
    <MainDashboard>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Registrations</h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </button>
          </div>
          {/* Recent registrations list would go here */}
          <div className="text-center py-8 text-gray-500">
            <p>Recent registrations will appear here</p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Classes</h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Calendar
            </button>
          </div>
          {/* Upcoming classes list would go here */}
          <div className="text-center py-8 text-gray-500">
            <p>Upcoming classes will appear here</p>
          </div>
        </div>
      </div>
    </MainDashboard>
  );
}