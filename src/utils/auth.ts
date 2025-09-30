import { User } from '../types';

// Mock credentials database
const MOCK_CREDENTIALS = {
  student: {
    'student': { password: 'password', user: { id: '1', name: 'Student User', email: 'student@iiit.ac.in', role: 'student' } },
    'arjun.sharma': { password: 'student123', user: { id: '1', name: 'Arjun Sharma', email: 'arjun@iiit.ac.in', role: 'student' } }
  },
  faculty: {
    'faculty': { password: 'password', user: { id: '2', name: 'Faculty User', email: 'faculty@iiit.ac.in', role: 'faculty' } },
    'dr.kumar': { password: 'faculty123', user: { id: '2', name: 'Dr. Rajesh Kumar', email: 'kumar@iiit.ac.in', role: 'faculty' } }
  },
  admin: {
    'admin': { password: 'admin123', user: { id: '3', name: 'Admin User', email: 'admin@iiit.ac.in', role: 'admin' } },
    'administrator': { password: 'password', user: { id: '3', name: 'System Admin', email: 'sysadmin@iiit.ac.in', role: 'admin' } }
  }
};

// Route permissions by role
const ROUTE_PERMISSIONS = {
  student: ['dashboard', 'activities', 'portfolio', 'assistant'],
  faculty: ['approvals', 'monitoring'],
  admin: ['dashboard', 'analytics', 'announcements']
};

export const auth = {
  // Login function
  login: async (role: string, username: string, password: string) => {
    const roleCredentials = MOCK_CREDENTIALS[role as keyof typeof MOCK_CREDENTIALS];
    
    if (!roleCredentials || !roleCredentials[username]) {
      return { success: false, error: 'Invalid username or role' };
    }
    
    const userCredential = roleCredentials[username];
    if (userCredential.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Store session
    localStorage.setItem('iiit_auth_token', JSON.stringify({
      user: userCredential.user,
      timestamp: Date.now()
    }));
    
    return { success: true, user: userCredential.user };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('iiit_auth_token');
    if (!token) return false;
    
    try {
      const session = JSON.parse(token);
      // Check if session is less than 24 hours old
      return (Date.now() - session.timestamp) < 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('iiit_auth_token');
    if (!token) return null;
    
    try {
      const session = JSON.parse(token);
      return session.user;
    } catch {
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('iiit_auth_token');
  }
};

// Route access control
export const canAccessRoute = (userRole: string, route: string): boolean => {
  const allowedRoutes = ROUTE_PERMISSIONS[userRole as keyof typeof ROUTE_PERMISSIONS];
  return allowedRoutes ? allowedRoutes.includes(route) : false;
};