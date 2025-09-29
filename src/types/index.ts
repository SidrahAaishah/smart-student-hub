export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  year?: string;
  rollNumber?: string;
}

export interface Activity {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: 'conference' | 'certification' | 'club' | 'competition' | 'leadership' | 'internship' | 'community';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  certificate?: string; // base64 or URL
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  subject: string;
  grade: string;
  credits: number;
  semester: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  email: string;
  cgpa: number;
  attendance: number;
  totalCredits: number;
  activities: Activity[];
  grades: Grade[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  earnedAt?: string;
}