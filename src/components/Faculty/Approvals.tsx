import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, MessageSquare } from 'lucide-react';
import { Activity } from '../../types';
import { storage } from '../../utils/storage';

export const Approvals: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(
    storage.getActivities().filter(a => a.status === 'pending')
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const students = storage.getStudents();

  const handleAction = (activity: Activity, action: 'approve' | 'reject') => {
    setSelectedActivity(activity);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedActivity || !actionType) return;

    const updates: Partial<Activity> = {
      status: actionType === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString()
    };

    if (actionType === 'approve') {
      updates.approvedBy = 'Dr. Rajesh Kumar'; // Mock faculty name
    } else {
      updates.rejectionReason = remarks;
    }

    storage.updateActivity(selectedActivity.id, updates);
    
    setActivities(prev => prev.filter(a => a.id !== selectedActivity.id));
    setSelectedActivity(null);
    setActionType(null);
    setRemarks('');
  };

  const getStudent = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve student activity submissions
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {activities.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
          </div>
        </div>
      </div>

      {/* Pending Activities */}
      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No pending activities to review at the moment
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activities.map((activity) => {
            const student = getStudent(activity.studentId);
            return (
              <div
                key={activity.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                        Pending Review
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Student:</strong> {student?.name} ({student?.rollNumber})
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <strong>Category:</strong> {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)} • 
                      <strong> Date:</strong> {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{activity.description}</p>

                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>Submitted {new Date(activity.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleAction(activity, 'reject')}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleAction(activity, 'approve')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedActivity && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {actionType === 'approve' ? 'Approve Activity' : 'Reject Activity'}
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Activity:</strong> {selectedActivity.title}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Student:</strong> {getStudent(selectedActivity.studentId)?.name}
              </p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for rejection
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedActivity(null);
                  setActionType(null);
                  setRemarks('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionType === 'reject' && !remarks.trim()}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                } disabled:cursor-not-allowed`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};