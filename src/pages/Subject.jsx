// src/pages/admin/Subject.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher_id: '',
    category: '',
    difficulty: 'Beginner',
  });

  // Fetch subjects and teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch subjects
        const subjectsRes = await axios.get('/api/subjects/getall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubjects(subjectsRes.data);
        setFilteredSubjects(subjectsRes.data);
        
        // Fetch teachers
        const teachersRes = await axios.get('/api/teachers/getall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeachers(teachersRes.data);
        
        setLoading(false);
        toast.success('Subjects loaded successfully');
      } catch (err) {
        toast.error('Failed to load subject data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSubjects(subjects);
    } else {
      const filtered = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [searchTerm, subjects]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for adding a new subject
  const openAddModal = () => {
    setCurrentSubject(null);
    setFormData({
      name: '',
      description: '',
      teacher_id: teachers.length > 0 ? teachers[0].teacher_id : '',
      category: '',
      difficulty: 'Beginner',
    });
    setShowModal(true);
  };

  // Open modal for editing a subject
  const openEditModal = (subject) => {
    setCurrentSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      teacher_id: subject.teacher_id,
      category: subject.category,
      difficulty: subject.difficulty || 'Beginner',
    });
    setShowModal(true);
  };

  // Submit form to create or update subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = currentSubject 
        ? `/api/subjects/${currentSubject.subject_id}` 
        : '/api/subjects/create';
      
      const method = currentSubject ? 'put' : 'post';
      
      const payload = { ...formData };
      
      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (currentSubject) {
        // Update existing subject in state
        setSubjects(subjects.map(s => 
          s.subject_id === currentSubject.subject_id ? response.data : s
        ));
        toast.success('Subject updated successfully');
      } else {
        // Add new subject to state
        setSubjects([...subjects, response.data]);
        toast.success('Subject added successfully');
      }
      
      setShowModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
    }
  };

  // Delete a subject
  const handleDelete = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject? Classes associated with it will be affected.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubjects(subjects.filter(subject => subject.subject_id !== subjectId));
      toast.success('Subject deleted successfully');
    } catch (err) {
      toast.error('Failed to delete subject. Make sure no classes are associated with it.');
    }
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.teacher_id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Subjects</h2>
          <p className="text-gray-600">All subjects offered in your institution</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add Subject
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Teacher
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <tr key={subject.subject_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{subject.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {subject.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        subject.difficulty === 'Beginner' ? 'bg-green-500' :
                        subject.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">{subject.difficulty}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTeacherName(subject.teacher_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(subject)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject.subject_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  {subjects.length === 0 
                    ? 'No subjects found. Add your first subject!' 
                    : 'No matching subjects found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentSubject ? 'Edit Subject' : 'Add New Subject'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter subject name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Describe the subject content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Teacher</label>
                <select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.name} ({teacher.subject_specialty})
                    </option>
                  ))}
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
                  {currentSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}