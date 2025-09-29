import React from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award, 
  CheckCircle, 
  Clock, 
  Users,
  Target 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Activity, Badge } from '../../types';
import { storage } from '../../utils/storage';

interface StudentDashboardProps {
  user: User;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const students = storage.getStudents();
  const activities = storage.getActivities();
  const badges = storage.getBadges();
  
  const student = students.find(s => s.id === user.id);
  const studentActivities = activities.filter(a => a.studentId === user.id);
  
  if (!student) return null;

  const approvedActivities = studentActivities.filter(a => a.status === 'approved');
  const pendingActivities = studentActivities.filter(a => a.status === 'pending');

  // Mock data for charts
  const gradeData = [
    { subject: 'DS', grade: 9 },
    { subject: 'DB', grade: 8 },
    { subject: 'Web', grade: 9 },
    { subject: 'ML', grade: 8.5 },
    { subject: 'SE', grade: 8 }
  ];

  const activityData = [
    { name: 'Conferences', value: 33 },
    { name: 'Certifications', value: 33 },
    { name: 'Leadership', value: 24 },
    { name: 'Competitions', value: 10 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Calculate earned badges
  const earnedBadges = badges.filter(badge => {
    switch (badge.id) {
      case '1': // Conference Speaker
        return approvedActivities.some(a => a.category === 'conference');
      case '2': // Certification Master  
        return approvedActivities.filter(a => a.category === 'certification').length >= 3;
      case '3': // Leadership Excellence
        return approvedActivities.some(a => a.category === 'leadership');
      case '4': // Academic Excellence
        return student.cgpa >= 8.5;
      case '5': // Community Champion
        return approvedActivities.filter(a => a.category === 'community').length >= 5;
      default:
        return false;
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {student.name}!</h1>
        <p className="text-blue-100 text-sm sm:text-base">Here's your academic overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CGPA</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{student.cgpa}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Above average</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.attendance}%</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${student.attendance}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.totalCredits}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Out of 20 required
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{approvedActivities.length}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pendingActivities.length} pending
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="grade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {studentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'approved' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {activity.category} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                {activity.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {activity.status === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Badges ({earnedBadges.length}/{badges.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {badges.map((badge) => {
              const isEarned = earnedBadges.some(b => b.id === badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isEarned 
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p className={`font-medium text-sm ${
                      isEarned ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};