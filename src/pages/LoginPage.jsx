import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let loginUrl = '';
    if (role === 'admin') loginUrl = 'http://localhost:5000/api/admin/login';
    else if (role === 'teacher') loginUrl = 'http://localhost:5000/api/teacher/login';
    else if (role === 'student') loginUrl = 'http://localhost:5000/api/student/login';
    else if (role === 'parent') loginUrl = 'http://localhost:5000/api/parent/login';

    try {
      const res = await axios.post(loginUrl, {
        email,
        password
      });

      const data = res.data;

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', data.name || data.admin?.name || data.teacher?.name || data.student?.name || data.parent?.name);

      // Navigate based on role
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
      else if (role === 'parent') navigate('/parent/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Role descriptions for the info card
  const roleDescriptions = {
    admin: "Administrators manage the entire tuition system, including user accounts, settings, and overall operations.",
    teacher: "Teachers can manage classes, view student progress, update attendance, and upload materials.",
    student: "Students can view their schedule, access learning materials, check assignments, and track their progress.",
    parent: "Parents can monitor their child's attendance, progress reports, fee payments, and communicate with teachers."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Illustration and Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">Tuition Management System</h1>
            <p className="text-blue-100 mb-8">Streamline your education management with our comprehensive platform</p>
          </div>
          
          <div className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-start mb-4">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                <p className="text-blue-200 text-sm">{roleDescriptions[role]}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Secure Access</h3>
                <p className="text-blue-200 text-sm">All data is encrypted and securely stored. Your privacy is our priority.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-blue-200">Trusted by thousands of educators and students worldwide</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {['admin', 'teacher', 'student', 'parent'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-lg border transition-all ${
                      role === r 
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-medium shadow-sm' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                autoComplete="current-password"
                // Password visibility toggle
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                // Eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.99-4.36M6.7 6.7A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.306 5.066M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                </svg>
                ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                )}
              </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800">
                Contact Administrator
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2023 Tuition Management System. All rights reserved.</p>
      </div>
    </div>
  );
}