import React, { useState } from 'react';
import { User, Lock, LogIn, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../utils/auth';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = role && username.trim() && password.trim();

  const handleLogin = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = await auth.login(role, username, password);
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="font-bold text-xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 dark:from-slate-100 dark:to-blue-200 bg-clip-text text-transparent mb-2">
                Student Hub
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                IIIT Nagpur - Academic Portal
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
              {/* Role Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Select Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 appearance-none min-h-[52px] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400"
                    required
                  >
                    <option value="">Choose your role...</option>
                    <option value="student">🎓 Student</option>
                    <option value="faculty">👨‍🏫 Faculty</option>
                    <option value="admin">⚙️ Admin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                </div>
              </div>

              {/* Username */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 min-h-[52px] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 min-h-[52px] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 text-center">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 min-h-[56px] shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                  isFormValid && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-300/50 dark:shadow-blue-900/50'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-slate-200 dark:shadow-slate-800 transform-none'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                <span className="text-lg">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">Demo Credentials</p>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">🎓 Student:</span>
                  <span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded">student / password</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">👨‍🏫 Faculty:</span>
                  <span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded">faculty / password</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">⚙️ Admin:</span>
                  <span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded">admin / admin123</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleTheme}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export const demoCredentials = {
  student: { username: 'student', password: 'password' },
  faculty: { username: 'faculty', password: 'password' },
  admin: { username: 'admin', password: 'admin123' }
};