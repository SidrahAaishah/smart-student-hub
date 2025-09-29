import { User, Activity, Student, Announcement, Badge } from '../types';

const STORAGE_KEYS = {
  USER: 'iiit_nagpur_user',
  ACTIVITIES: 'iiit_nagpur_activities',
  STUDENTS: 'iiit_nagpur_students',
  ANNOUNCEMENTS: 'iiit_nagpur_announcements',
  BADGES: 'iiit_nagpur_badges',
  THEME: 'iiit_nagpur_theme',
  NOTIFICATIONS: 'iiit_nagpur_notifications'
};

export const storage = {
  // User management
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Activities
  getActivities: (): Activity[] => {
    const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return activities ? JSON.parse(activities) : [];
  },
  
  saveActivities: (activities: Activity[]) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },
  
  addActivity: (activity: Activity) => {
    const activities = storage.getActivities();
    activities.push(activity);
    storage.saveActivities(activities);
  },
  
  updateActivity: (activityId: string, updates: Partial<Activity>) => {
    const activities = storage.getActivities();
    const index = activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      const oldActivity = activities[index];
      activities[index] = { ...oldActivity, ...updates, updatedAt: new Date().toISOString() };
      storage.saveActivities(activities);
      
      // Create notification when status changes
      if (updates.status && updates.status !== oldActivity.status) {
        const notification = {
          id: `activity-${updates.status}-${activityId}-${Date.now()}`,
          userId: oldActivity.studentId,
          type: 'activity',
          title: updates.status === 'approved' ? 'Activity Approved' : 'Activity Rejected',
          message: updates.status === 'approved' 
            ? `Your activity "${oldActivity.title}" has been approved by ${updates.approvedBy || 'faculty'}` 
            : `Your activity "${oldActivity.title}" was rejected. Please review and resubmit.`,
          timestamp: new Date().toISOString(),
          read: false
        };
        storage.addNotification(notification);
      }
    }
  },

  // Students
  getStudents: (): Student[] => {
    const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return students ? JSON.parse(students) : [];
  },
  
  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Announcements
  getAnnouncements: (): Announcement[] => {
    const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return announcements ? JSON.parse(announcements) : [];
  },
  
  saveAnnouncements: (announcements: Announcement[]) => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },
  
  addAnnouncement: (announcement: Announcement) => {
    const announcements = storage.getAnnouncements();
    announcements.unshift(announcement);
    storage.saveAnnouncements(announcements);
  },

  // Badges
  getBadges: (): Badge[] => {
    const badges = localStorage.getItem(STORAGE_KEYS.BADGES);
    return badges ? JSON.parse(badges) : [];
  },
  
  saveBadges: (badges: Badge[]) => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  },

  // Theme
  getTheme: (): 'light' | 'dark' => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  },
  
  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Notifications
  getNotifications: (): any[] => {
    const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return notifications ? JSON.parse(notifications) : [];
  },
  
  saveNotifications: (notifications: any[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  
  addNotification: (notification: any) => {
    const notifications = storage.getNotifications();
    notifications.unshift(notification);
    storage.saveNotifications(notifications);
  }
};