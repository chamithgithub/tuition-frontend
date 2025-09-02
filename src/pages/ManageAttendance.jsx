// src/pages/admin/ManageAttendance.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ManageAttendance() {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    attendance_id: '',
    student_id: '',
    date: new Date(),
    status: 'Present'
  });

  // Fetch attendances and students from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch attendances
        const attendanceResponse = await axios.get('http://localhost:5000/api/attendance/getall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttendances(attendanceResponse.data);
        setFilteredAttendances(attendanceResponse.data);
        
        // Fetch students for dropdown
        const studentResponse = await axios.get('http://localhost:5000/api/students/getall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(studentResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        toast.error('Failed to load attendance data');
      }
    };

    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredAttendances(attendances);
    } else {
      const filtered = attendances.filter(attendance => 
        attendance.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.attendance_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(attendance.date).toLocaleDateString().includes(searchTerm)
      );
      setFilteredAttendances(filtered);
    }
  }, [searchTerm, attendances]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
  };

  // Open modal for adding a new attendance
  const openAddModal = () => {
    setCurrentAttendance(null);
    setFormData({
      attendance_id: '',
      student_id: students.length > 0 ? students[0].student_id : '',
      date: new Date(),
      status: 'Present'
    });
    setShowModal(true);
  };

  // Open modal for editing an attendance
  const openEditModal = (attendance) => {
    setCurrentAttendance(attendance);
    setFormData({
      attendance_id: attendance.attendance_id,
      student_id: attendance.student_id,
      date: new Date(attendance.date),
      status: attendance.status
    });
    setShowModal(true);
  };

  // Submit form to create or update attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = currentAttendance 
        ? `http://localhost:5000/api/attendance/${currentAttendance.attendance_id}` 
        : 'http://localhost:5000/api/attendance/create';
      
      const method = currentAttendance ? 'put' : 'post';
      
      // Format date for submission
      const payload = {
        ...formData,
        date: formData.date.toISOString()
      };
      
      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (currentAttendance) {
        // Update existing attendance in state
        setAttendances(attendances.map(a => 
          a.attendance_id === currentAttendance.attendance_id ? response.data : a
        ));
        toast.success('Attendance updated successfully');
      } else {
        // Add new attendance to state
        setAttendances([...attendances, response.data]);
        toast.success('Attendance added successfully');
      }
      
      setShowModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
    }
  };

  // Delete an attendance
  const handleDelete = async (attendanceId) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/attendance/${attendanceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAttendances(attendances.filter(attendance => attendance.attendance_id !== attendanceId));
      toast.success('Attendance deleted successfully');
    } catch (err) {
      toast.error('Failed to delete attendance');
    }
  };

  // Filter by date
  const filterByDate = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredAttendances(attendances);
    } else {
      const filtered = attendances.filter(attendance => 
        new Date(attendance.date).toDateString() === date.toDateString()
      );
      setFilteredAttendances(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Attendance</h2>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search attendance..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center">
            <DatePicker
              selected={selectedDate}
              onChange={filterByDate}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholderText="Filter by date"
            />
            <button
              onClick={() => filterByDate(null)}
              className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add Attendance
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendances.length > 0 ? (
              filteredAttendances.map((attendance) => {
                const student = students.find(s => s.student_id === attendance.student_id);
                return (
                  <tr key={attendance.attendance_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attendance.attendance_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student ? student.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance.status === 'Present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(attendance)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(attendance.attendance_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentAttendance ? 'Edit Attendance' : 'Add New Attendance'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {!currentAttendance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendance ID</label>
                  <input
                    type="text"
                    name="attendance_id"
                    value={formData.attendance_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter unique ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {students.map(student => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.name} ({student.student_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {currentAttendance ? 'Update Attendance' : 'Add Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}