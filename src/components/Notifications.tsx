import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle, Megaphone, X } from 'lucide-react';
import { storage } from '../utils/storage';

interface Notification {
  id: string;
  type: 'activity' | 'announcement' | 'grade' | 'attendance';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  userId: string;
  userRole: string;
}

export const Notifications: React.FC<NotificationsProps> = ({ userId, userRole }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userId, userRole]);

  const loadNotifications = () => {
    try {
      const userNotifications: Notification[] = [];
      const storedNotifications = storage.getNotifications() || [];
      const announcements = storage.getAnnouncements() || [];
      const activities = storage.getActivities() || [];
      const students = storage.getStudents() || [];
      
      if (userRole === 'student') {
        const student = students.find(s => s.id === userId);

        // Get stored notifications for this user
        const studentStoredNotifications = storedNotifications.filter(n => n.userId === userId);
        studentStoredNotifications.forEach(notification => {
          userNotifications.push({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            timestamp: new Date(notification.timestamp),
            read: notification.read
          });
        });

        // College Announcements for students
        announcements.forEach(announcement => {
          userNotifications.push({
            id: `announcement-${announcement.id}`,
            type: 'announcement',
            title: announcement.title,
            message: announcement.content,
            timestamp: new Date(announcement.createdAt),
            read: false
          });
        });

        // Grade Updates (Mock data)
        if (student) {
          userNotifications.push({
            id: `grade-update-${userId}`,
            type: 'grade',
            title: 'New Grade Posted',
            message: `Your grade for Data Structures has been updated. Current CGPA: ${student.cgpa}`,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: false
          });

          // Attendance Alert
          if (student.attendance < 75) {
            userNotifications.push({
              id: `attendance-alert-${userId}`,
              type: 'attendance',
              title: 'Low Attendance Alert',
              message: `Your attendance is ${student.attendance}%. Minimum required is 75%.`,
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              read: false
            });
          }
        }
      } else if (userRole === 'faculty') {
        // New activity submissions for faculty
        const pendingActivities = activities.filter(a => a.status === 'pending');
        pendingActivities.forEach(activity => {
          const student = students.find(s => s.id === activity.studentId);
          userNotifications.push({
            id: `pending-activity-${activity.id}`,
            type: 'activity',
            title: 'New Activity Submission',
            message: `${student?.name || 'Student'} submitted "${activity.title}" for approval`,
            timestamp: new Date(activity.createdAt),
            read: false
          });
        });

        // All activities needing review (not just pending)
        const allActivities = activities.filter(a => a.status === 'pending' || a.status === 'approved' || a.status === 'rejected');
        if (allActivities.length > 0) {
          userNotifications.push({
            id: `faculty-workload-${userId}`,
            type: 'activity',
            title: 'Activity Review Summary',
            message: `You have ${pendingActivities.length} pending activities to review`,
            timestamp: new Date(),
            read: false
          });
        }

        // Faculty announcements
        userNotifications.push({
          id: `faculty-meeting-${userId}`,
          type: 'announcement',
          title: 'Faculty Meeting Reminder',
          message: 'Monthly faculty meeting scheduled for tomorrow at 3 PM in Conference Room A',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: false
        });

        userNotifications.push({
          id: `faculty-deadline-${userId}`,
          type: 'announcement',
          title: 'Grade Submission Deadline',
          message: 'Reminder: Final grades must be submitted by Friday, 5 PM',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          read: false
        });

        // Student performance alerts
        const lowAttendanceStudents = students.filter(s => s.attendance < 75);
        if (lowAttendanceStudents.length > 0) {
          userNotifications.push({
            id: `faculty-attendance-alert-${userId}`,
            type: 'attendance',
            title: 'Low Attendance Alert',
            message: `${lowAttendanceStudents.length} students have attendance below 75%`,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: false
          });
        }
      } else if (userRole === 'admin') {
        // System overview for admin
        const totalStudents = students.length;
        const totalActivities = activities.length;
        const pendingActivities = activities.filter(a => a.status === 'pending').length;
        const approvedActivities = activities.filter(a => a.status === 'approved').length;
        
        userNotifications.push({
          id: `admin-system-overview-${userId}`,
          type: 'announcement',
          title: 'System Overview',
          message: `${totalStudents} students, ${totalActivities} total activities (${pendingActivities} pending, ${approvedActivities} approved)`,
          timestamp: new Date(),
          read: false
        });

        // Low attendance system alert
        const lowAttendanceStudents = students.filter(s => s.attendance < 75);
        if (lowAttendanceStudents.length > 0) {
          userNotifications.push({
            id: `admin-attendance-system-${userId}`,
            type: 'attendance',
            title: 'System Alert: Low Attendance',
            message: `${lowAttendanceStudents.length} students have attendance below 75%. Immediate attention required.`,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: false
          });
        }

        // Faculty workload alert
        if (pendingActivities > 10) {
          userNotifications.push({
            id: `admin-faculty-workload-${userId}`,
            type: 'activity',
            title: 'Faculty Workload Alert',
            message: `High number of pending activities (${pendingActivities}). Consider faculty workload distribution.`,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false
          });
        }

        // System maintenance notifications
        userNotifications.push({
          id: `admin-maintenance-${userId}`,
          type: 'announcement',
          title: 'Scheduled Maintenance',
          message: 'System maintenance scheduled for Sunday 2 AM - 4 AM. Please inform users.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: false
        });

        // New announcements published
        if (announcements.length > 0) {
          userNotifications.push({
            id: `admin-announcements-${userId}`,
            type: 'announcement',
            title: 'Announcements Published',
            message: `${announcements.length} announcements are currently active and visible to students`,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: false
          });
        }
      }

      // Sort by timestamp (newest first)
      userNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const markAsRead = (notificationId: string) => {
    // Update local state
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    
    // Update stored notifications
    const storedNotifications = storage.getNotifications();
    const updatedNotifications = storedNotifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    storage.saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    // Update local state
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    
    // Update stored notifications for this user
    const storedNotifications = storage.getNotifications();
    const updatedNotifications = storedNotifications.map(notif => 
      notif.userId === userId ? { ...notif, read: true } : notif
    );
    storage.saveNotifications(updatedNotifications);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-500" />;
      case 'grade':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'attendance':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;



  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium leading-tight ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span className="hidden sm:inline">
                          {notification.timestamp.toLocaleDateString()} at{' '}
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className="sm:hidden">
                          {notification.timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};