// src/pages/teacher/TeacherDashboard.jsx
import MainDashboard from './MainDashboard';
import DashboardStats from './DashboardStats';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    // Fetch teacher's name from localStorage
    const name = localStorage.getItem('name') || 'Teacher';
    setTeacherName(name);
    
    // Mock data - in a real app, this would come from an API
    setUpcomingClasses([
      { id: 1, subject: 'Mathematics', time: '10:00 AM - 11:30 AM', date: 'Mon, 15 May', class: 'Grade 10' },
      { id: 2, subject: 'Physics', time: '2:00 PM - 3:30 PM', date: 'Tue, 16 May', class: 'Grade 11' },
      { id: 3, subject: 'Advanced Calculus', time: '4:00 PM - 5:30 PM', date: 'Wed, 17 May', class: 'Grade 12' }
    ]);
    
    setRecentAssignments([
      { id: 1, title: 'Trigonometry Problems', subject: 'Mathematics', dueDate: 'May 20, 2023', submissions: 24, totalStudents: 30 },
      { id: 2, title: 'Newton\'s Laws Worksheet', subject: 'Physics', dueDate: 'May 18, 2023', submissions: 18, totalStudents: 30 },
      { id: 3, title: 'Integration Practice', subject: 'Mathematics', dueDate: 'May 15, 2023', submissions: 28, totalStudents: 30 }
    ]);
  }, []);

  const stats = [
    { label: 'Total Classes', value: '8', icon: 'M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4' },
    { label: 'Students', value: '142', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Pending Grading', value: '24', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'Attendance Rate', value: '92%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <MainDashboard>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {teacherName}!</h1>
        <p className="text-gray-600">Here's what's happening with your classes today</p>
      </div>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Classes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming Classes
            </h2>
          </div>
          <div className="divide-y">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{classItem.subject}</h3>
                    <p className="text-sm text-gray-600">{classItem.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{classItem.time}</p>
                    <p className="text-sm text-gray-600">{classItem.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                    View Roster
                  </button>
                  <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                    Start Class
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center w-full">
              View Full Schedule
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Recent Assignments */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Recent Assignments
            </h2>
          </div>
          <div className="divide-y">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      new Date(assignment.dueDate) > new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Submissions: {assignment.submissions}/{assignment.totalStudents}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                    Grade Assignments
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center w-full">
              Create New Assignment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Take Attendance</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Upload Materials</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Create Assignment</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Send Announcement</span>
          </button>
        </div>
      </div>
    </MainDashboard>
  );
}