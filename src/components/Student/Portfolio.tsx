import React from 'react';
import { Download, Share, Award, Calendar, CheckCircle } from 'lucide-react';
import { generatePortfolioPDF } from '../../utils/pdfGenerator';
import { storage } from '../../utils/storage';

interface PortfolioProps {
  userId: string;
}

export const Portfolio: React.FC<PortfolioProps> = ({ userId }) => {
  const students = storage.getStudents();
  const activities = storage.getActivities();
  
  const student = students.find(s => s.id === userId);
  const studentActivities = activities.filter(a => a.studentId === userId && a.status === 'approved');
  
  if (!student) return null;

  const handleDownloadPDF = () => {
    const pdf = generatePortfolioPDF(student, studentActivities);
    pdf.save(`${student.name}_Portfolio.pdf`);
  };

  const handleShare = () => {
    const shareData = {
      title: `${student.name}'s Portfolio - IIIT Nagpur`,
      text: `Check out ${student.name}'s academic portfolio from IIIT Nagpur`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  const groupedActivities = studentActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, typeof studentActivities>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Academic Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              A comprehensive overview of your achievements and activities
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
            <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Roll Number</p>
            <p className="font-semibold text-gray-900 dark:text-white">{student.rollNumber}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
            <p className="font-semibold text-gray-900 dark:text-white">{student.department}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
            <p className="font-semibold text-gray-900 dark:text-white">{student.cgpa}</p>
          </div>
        </div>
      </div>

      {/* Activities by Category */}
      {Object.entries(groupedActivities).length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No approved activities yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your approved activities will appear here in your portfolio
          </p>
        </div>
      ) : (
        Object.entries(groupedActivities).map(([category, categoryActivities]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              {category.replace(/([A-Z])/g, ' $1').trim()}
              <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
                {categoryActivities.length}
              </span>
            </h2>
            <div className="space-y-4">
              {categoryActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {activity.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    {activity.approvedBy && (
                      <span>Verified by: {activity.approvedBy}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{studentActivities.length}</p>
            <p className="text-blue-100">Verified Activities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{Object.keys(groupedActivities).length}</p>
            <p className="text-blue-100">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{student.cgpa}</p>
            <p className="text-blue-100">Academic Performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};