import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

export default function UploadMaterials() {
  // State management
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [classes, setClasses] = useState([]); // Added classes state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/teacher/classes");
        setClasses(response.data);
      } catch (err) {
        setError("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!selectedClass) {
      setError("Please select a class");
      return;
    }

    const formData = new FormData();
    formData.append("material", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("classId", selectedClass);

    try {
      await axios.post("/api/teacher/upload-material", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      // Reset form on success
      setTitle("");
      setDescription("");
      setSelectedClass("");
      setFile(null);
      setUploadProgress(0);
      alert("Material uploaded successfully!");
      
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload New Material</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Class selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.subject}
              </option>
            ))}
          </select>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading classes...</p>}
        </div>

        {/* Title input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter material title"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Add a description for this material"
          />
        </div>

        {/* File input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select File</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, PPT, JPG, MP4 (MAX. 20MB)
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
              />
            </label>
          </div>
        </div>

        {/* Progress bar */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {/* Submit button */}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
          disabled={isLoading || uploadProgress > 0}
        >
          {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Upload Material"}
        </button>
      </form>
    </div>
  );
}