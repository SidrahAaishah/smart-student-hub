import React, { useState } from 'react';
import { Download, FileSpreadsheet, TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateAnalyticsReport } from '../../utils/pdfGenerator';
import { storage } from '../../utils/storage';

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('6months');
  const [reportType, setReportType] = useState('comprehensive');

  const students = storage.getStudents();
  const activities = storage.getActivities();

  // Calculate comprehensive analytics
  const totalStudents = students.length;
  const totalActivities = activities.length;
  const approvedActivities = activities.filter(a => a.status === 'approved').length;
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const avgCGPA = totalStudents > 0 ? Number((students.reduce((acc, s) => acc + s.cgpa, 0) / totalStudents).toFixed(2)) : 0;

  // Department performance data
  const departmentPerformance = students.reduce((acc, student) => {
    if (!acc[student.department]) {
      acc[student.department] = {
        name: student.department,
        students: 0,
        avgCGPA: 0,
        totalCGPA: 0,
        activities: 0
      };
    }
    acc[student.department].students += 1;
    acc[student.department].totalCGPA += student.cgpa;
    acc[student.department].activities += activities.filter(a => 
      a.studentId === student.id && a.status === 'approved'
    ).length;
    return acc;
  }, {} as Record<string, any>);

  Object.values(departmentPerformance).forEach((dept: any) => {
    dept.avgCGPA = Number((dept.totalCGPA / dept.students).toFixed(2));
  });

  const departmentChartData = Object.values(departmentPerformance);

  // NAAC/AICTE style metrics
  const naacMetrics = [
    { metric: 'Academic Excellence', value: (avgCGPA / 10) * 100, fullMark: 100 },
    { metric: 'Student Activities', value: (approvedActivities / totalStudents) * 20, fullMark: 100 },
    { metric: 'Research & Innovation', value: 75, fullMark: 100 },
    { metric: 'Industry Collaboration', value: 65, fullMark: 100 },
    { metric: 'Social Responsibility', value: 80, fullMark: 100 },
    { metric: 'Governance', value: 85, fullMark: 100 }
  ];

  // Activity trends over time
  const activityTrends = [
    { month: 'Jul 2023', conferences: 3, certifications: 8, leadership: 2, competitions: 5 },
    { month: 'Aug 2023', conferences: 2, certifications: 12, leadership: 3, competitions: 7 },
    { month: 'Sep 2023', conferences: 4, certifications: 10, leadership: 1, competitions: 6 },
    { month: 'Oct 2023', conferences: 1, certifications: 15, leadership: 4, competitions: 9 },
    { month: 'Nov 2023', conferences: 3, certifications: 9, leadership: 2, competitions: 4 },
    { month: 'Dec 2023', conferences: 2, certifications: 11, leadership: 3, competitions: 8 }
  ];

  // Student engagement levels
  const engagementData = [
    { level: 'High Achievers', count: Math.floor(totalStudents * 0.2), percentage: 20 },
    { level: 'Active Students', count: Math.floor(totalStudents * 0.5), percentage: 50 },
    { level: 'Moderate Participation', count: Math.floor(totalStudents * 0.2), percentage: 20 },
    { level: 'Low Engagement', count: Math.floor(totalStudents * 0.1), percentage: 10 }
  ];

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

  const handleExportPDF = () => {
    const data = {
      totalStudents,
      totalActivities,
      approvedActivities,
      pendingActivities,
      avgCGPA: avgCGPA.toString()
    };
    const pdf = generateAnalyticsReport(data);
    pdf.save('IIIT_Nagpur_Analytics_Report.pdf');
  };

  const handleExportExcel = () => {
    // Mock Excel export - in real implementation, use a library like xlsx
    const csvData = [
      ['Metric', 'Value'],
      ['Total Students', totalStudents],
      ['Total Activities', totalActivities],
      ['Approved Activities', approvedActivities],
      ['Average CGPA', avgCGPA],
      ['Approval Rate', `${((approvedActivities / totalActivities) * 100).toFixed(1)}%`]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IIIT_Nagpur_Analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive institutional analytics for NAAC, AICTE, and NIRF assessments
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="comprehensive">Comprehensive</option>
              <option value="naac">NAAC Assessment</option>
              <option value="aicte">AICTE Report</option>
              <option value="nirf">NIRF Ranking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Student Enrollment</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
              <p className="text-blue-100 text-sm">Active students</p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Activity Rate</p>
              <p className="text-3xl font-bold">{((approvedActivities / totalStudents) * 100).toFixed(0)}%</p>
              <p className="text-green-100 text-sm">Engagement level</p>
            </div>
            <Award className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Academic Excellence</p>
              <p className="text-3xl font-bold">{avgCGPA}</p>
              <p className="text-purple-100 text-sm">Average CGPA</p>
            </div>
            <BookOpen className="w-10 h-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Growth Rate</p>
              <p className="text-3xl font-bold">+{Math.round((approvedActivities / totalActivities) * 100)}%</p>
              <p className="text-orange-100 text-sm">YoY improvement</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* NAAC/AICTE Performance Radar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          NAAC Assessment Metrics
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={naacMetrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Performance & Activity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Department Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgCGPA" fill="#3B82F6" name="Avg CGPA" />
              <Bar dataKey="activities" fill="#10B981" name="Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="conferences" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="certifications" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="leadership" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="competitions" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Engagement Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Student Engagement Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="percentage"
                label={({ level, percentage }) => `${level}: ${percentage}%`}
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Engagement Levels</h4>
            {engagementData.map((level, index) => (
              <div key={level.level} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: COLORS[index] + '20'}}>
                <span className="font-medium text-gray-900 dark:text-white">{level.level}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{level.count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{level.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Rankings Projection */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8">
        <h3 className="text-xl font-semibold mb-4">Institutional Rankings Projection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Band A</div>
            <div className="text-indigo-100">NAAC Grade</div>
            <div className="text-sm text-indigo-200 mt-1">Based on current metrics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">75-100</div>
            <div className="text-indigo-100">NIRF Ranking Range</div>
            <div className="text-sm text-indigo-200 mt-1">Engineering category</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Approved</div>
            <div className="text-indigo-100">AICTE Status</div>
            <div className="text-sm text-indigo-200 mt-1">All programs accredited</div>
          </div>
        </div>
      </div>
    </div>
  );
};