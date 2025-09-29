import { User } from '../types';

// Mock JWT-like token structure for demo
interface AuthToken {
  userId: string;
  role: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

// Simulate password hashing (in real app, use bcrypt on backend)
const hashPassword = (password: string): string => {
  // Simple hash simulation - DO NOT use in production
  return btoa(password + 'salt123');
};

// Simulate token generation (in real app, use JWT on backend)
const generateToken = (user: User): string => {
  const token: AuthToken = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    iat: Date.now()
  };
  return btoa(JSON.stringify(token));
};

// Simulate token validation
const validateToken = (token: string): AuthToken | null => {
  try {
    const decoded: AuthToken = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }
    return decoded;
  } catch {
    return null; // Invalid token
  }
};

// Role-based access control
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    admin: 3,
    faculty: 2,
    student: 1
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
};

// Check if user can access a specific route
export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions = {
    // Student routes
    'dashboard': ['student', 'faculty', 'admin'],
    'activities': ['student', 'faculty', 'admin'],
    'portfolio': ['student', 'faculty', 'admin'],
    'assistant': ['student', 'faculty', 'admin'],
    
    // Faculty routes
    'approvals': ['faculty', 'admin'],
    'monitoring': ['faculty', 'admin'],
    
    // Admin routes
    'analytics': ['admin'],
    'announcements': ['admin']
  };
  
  const allowedRoles = routePermissions[route as keyof typeof routePermissions] || [];
  return allowedRoles.includes(userRole);
};

// Session management
export const auth = {
  // Login with credentials
  login: async (role: string, username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
    // Mock credentials database
    const credentials = {
      student: {
        'student': { password: 'password', user: { id: '1', name: 'Student User', email: 'student@iiit.ac.in', role: 'student' } },
        'arjun.sharma': { password: 'student123', user: { id: '1', name: 'Arjun Sharma', email: 'arjun@iiit.ac.in', role: 'student' } }
      },
      faculty: {
        'faculty': { password: 'password', user: { id: '2', name: 'Faculty User', email: 'faculty@iiit.ac.in', role: 'faculty' } },
        'priya.singh': { password: 'faculty123', user: { id: '2', name: 'Dr. Priya Singh', email: 'priya@iiit.ac.in', role: 'faculty' } }
      },
      admin: {
        'admin': { password: 'admin123', user: { id: '3', name: 'Admin User', email: 'admin@iiit.ac.in', role: 'admin' } },
        'administrator': { password: 'password', user: { id: '3', name: 'System Admin', email: 'admin@iiit.ac.in', role: 'admin' } }
      }
    };

    try {
      const roleCredentials = credentials[role as keyof typeof credentials];
      const userCredential = roleCredentials?.[username.toLowerCase()];
      
      if (userCredential && userCredential.password === password) {
        const token = generateToken(userCredential.user as User);
        localStorage.setItem('authToken', token);
        return { 
          success: true, 
          user: userCredential.user as User, 
          token 
        };
      } else {
        return { 
          success: false, 
          error: `Invalid credentials for ${role}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Authentication failed' 
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.clear();
  },

  // Get current user from token
  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const decoded = validateToken(token);
    if (!decoded) {
      auth.logout(); // Clear invalid token
      return null;
    }
    
    // In real app, fetch user data from backend using decoded.userId
    const storedUser = localStorage.getItem('iiit_nagpur_user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    const decoded = validateToken(token);
    return decoded !== null;
  },

  // Get user role
  getUserRole: (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const decoded = validateToken(token);
    return decoded?.role || null;
  }
};

// Export for documentation
export const authEndpoints = {
  login: 'POST /api/auth/login',
  logout: 'POST /api/auth/logout',
  refresh: 'POST /api/auth/refresh',
  verify: 'GET /api/auth/verify'
};

export const exampleLoginRequest = {
  method: 'POST',
  url: '/api/auth/login',
  body: {
    role: 'student',
    username: 'student',
    password: 'password'
  }
};

export const exampleLoginResponse = {
  success: true,
  user: {
    id: '1',
    name: 'Student User',
    email: 'student@iiit.ac.in',
    role: 'student'
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  expiresIn: '24h'
};