import React, { useState } from 'react';
import { User, GraduationCap, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const mockUsers: UserType[] = [
  {
    id: '1',
    email: 'student@iiit.ac.in',
    name: 'Arjun Sharma',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'IIIT2021001'
  },
  {
    id: '2',
    email: 'faculty@iiit.ac.in',
    name: 'Dr. Rajesh Kumar',
    role: 'faculty',
    department: 'Computer Science'
  },
  {
    id: '3',
    email: 'admin@iiit.ac.in',
    name: 'Prof. Sunita Sharma',
    role: 'admin'
  }
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin'>('student');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <User className="w-8 h-8" />;
      case 'faculty': return <GraduationCap className="w-8 h-8" />;
      case 'admin': return <Shield className="w-8 h-8" />;
      default: return <User className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Student Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              IIIT Nagpur
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Select Your Role
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {mockUsers.map((user) => (
                <button
                  key={user.role}
                  onClick={() => setSelectedRole(user.role)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === user.role
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      selectedRole === user.role 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium capitalize">{user.role}</div>
                      <div className="text-sm opacity-75">{user.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Continue as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            This is a prototype with mock authentication
          </p>
        </div>
      </div>
    </div>
  );
};