import { Student, Activity, Announcement, Badge, Grade } from '../types';

export const generateMockStudents = (): Student[] => {
  const mockGrades: Grade[] = [
    { subject: 'Data Structures', grade: 'A+', credits: 4, semester: 'Fall 2023' },
    { subject: 'Database Systems', grade: 'A', credits: 3, semester: 'Fall 2023' },
    { subject: 'Web Development', grade: 'A+', credits: 3, semester: 'Spring 2024' },
    { subject: 'Machine Learning', grade: 'A-', credits: 4, semester: 'Spring 2024' },
    { subject: 'Software Engineering', grade: 'A', credits: 3, semester: 'Fall 2024' }
  ];

  return [
    {
      id: '1',
      name: 'Arjun Sharma',
      rollNumber: 'IIIT2021001',
      department: 'Computer Science',
      year: '3rd Year',
      email: 'arjun.sharma@iiit.ac.in',
      cgpa: 8.7,
      attendance: 92,
      totalCredits: 17,
      activities: [],
      grades: mockGrades
    },
    {
      id: '2',
      name: 'Priya Patel',
      rollNumber: 'IIIT2021002', 
      department: 'Information Technology',
      year: '3rd Year',
      email: 'priya.patel@iiit.ac.in',
      cgpa: 9.1,
      attendance: 95,
      totalCredits: 17,
      activities: [],
      grades: mockGrades
    },
    {
      id: '3',
      name: 'Rohit Kumar',
      rollNumber: 'IIIT2022001',
      department: 'Computer Science',
      year: '2nd Year', 
      email: 'rohit.kumar@iiit.ac.in',
      cgpa: 8.3,
      attendance: 88,
      totalCredits: 14,
      activities: [],
      grades: mockGrades.slice(0, 3)
    }
  ];
};

export const generateMockActivities = (): Activity[] => {
  return [
    {
      id: '1',
      studentId: '1',
      title: 'IEEE International Conference on Computer Science',
      description: 'Presented research paper on Machine Learning algorithms',
      category: 'conference',
      date: '2024-01-15',
      status: 'approved',
      approvedBy: 'Dr. Rajesh Kumar',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '2',
      studentId: '1',
      title: 'AWS Cloud Practitioner Certification',
      description: 'Successfully completed AWS Cloud Practitioner certification',
      category: 'certification',
      date: '2024-02-20',
      status: 'pending',
      createdAt: '2024-02-18T09:00:00Z',
      updatedAt: '2024-02-18T09:00:00Z'
    },
    {
      id: '3',
      studentId: '2',
      title: 'Coding Club President',
      description: 'Led the coding club and organized multiple programming competitions',
      category: 'leadership',
      date: '2023-08-01',
      status: 'approved',
      approvedBy: 'Prof. Sunita Sharma',
      createdAt: '2023-07-28T16:00:00Z',
      updatedAt: '2023-08-02T10:15:00Z'
    }
  ];
};

export const generateMockAnnouncements = (): Announcement[] => {
  return [
    {
      id: '1',
      title: 'Annual Tech Fest 2024',
      content: 'IIIT Nagpur is organizing its annual tech fest from March 15-17, 2024. All students are encouraged to participate in various competitions and workshops.',
      author: 'Dean of Students',
      createdAt: '2024-01-20T10:00:00Z',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Internship Drive by TCS',
      content: 'TCS will be conducting an internship drive for final year students on February 25, 2024. Registration deadline is February 20, 2024.',
      author: 'Placement Cell',
      createdAt: '2024-01-18T14:30:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Library Closure for Maintenance',
      content: 'The central library will remain closed from February 1-3, 2024 for maintenance work. Students can access digital resources during this period.',
      author: 'Library Administration',
      createdAt: '2024-01-25T09:15:00Z',
      priority: 'low'
    }
  ];
};

export const generateMockBadges = (): Badge[] => {
  return [
    {
      id: '1',
      name: 'Conference Speaker',
      description: 'Presented at an academic conference',
      icon: '🎤',
      criteria: 'Present at 1+ conference'
    },
    {
      id: '2',
      name: 'Certification Master',
      description: 'Earned 3+ professional certifications',
      icon: '🏆',
      criteria: 'Complete 3+ certifications'
    },
    {
      id: '3',
      name: 'Leadership Excellence',
      description: 'Demonstrated outstanding leadership',
      icon: '👑',
      criteria: 'Hold leadership position'
    },
    {
      id: '4',
      name: 'Academic Excellence',
      description: 'Maintained high academic performance',
      icon: '📚',
      criteria: 'CGPA above 8.5'
    },
    {
      id: '5',
      name: 'Community Champion',
      description: 'Active in community service',
      icon: '🤝',
      criteria: '5+ community service activities'
    }
  ];
};

export const initializeMockData = () => {
  const students = generateMockStudents();
  const activities = generateMockActivities();
  const announcements = generateMockAnnouncements();
  const badges = generateMockBadges();

  if (!localStorage.getItem('iiit_nagpur_students')) {
    localStorage.setItem('iiit_nagpur_students', JSON.stringify(students));
  }
  if (!localStorage.getItem('iiit_nagpur_activities')) {
    localStorage.setItem('iiit_nagpur_activities', JSON.stringify(activities));
  }
  if (!localStorage.getItem('iiit_nagpur_announcements')) {
    localStorage.setItem('iiit_nagpur_announcements', JSON.stringify(announcements));
  }
  if (!localStorage.getItem('iiit_nagpur_badges')) {
    localStorage.setItem('iiit_nagpur_badges', JSON.stringify(badges));
  }
};