import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import UploadMaterials from './components/UploadMaterials';
import ManageTeacher from './pages/ManageTeacher';
import ManageStudent from './pages/ManageStudent';
import ManageSubject from './pages/Subject';
import ManageClasses from './pages/ManageClass';
import ManageParent from './pages/ManageParent';
import ManageAttendance from './pages/ManageAttendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-teachers" element={<ManageTeacher />} />
        <Route path="/admin/manage-students" element={<ManageStudent />} />
        <Route path="/admin/manage-classes" element={<ManageClasses />} />
        <Route path="/admin/manage-parents" element={<ManageParent />} />
        <Route path="/admin/attendance" element={<ManageAttendance />} />
        
        {/* Subject Management */}
        <Route path="/admin/subjects" element={<ManageSubject />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/materials" element={<UploadMaterials/>} />
        
        
        
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        
        
        <Route path="/parent/dashboard" element={<ParentDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

