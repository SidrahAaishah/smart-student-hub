import React from 'react';
import { 
  Home, 
  Calendar, 
  Award, 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Megaphone,
  User,
  Bot
} from 'lucide-react';

interface NavigationProps {
  userRole: string;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ userRole, currentView, onViewChange }) => {
  const getNavigationItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'activities', label: 'Activities', icon: Award },
          { id: 'portfolio', label: 'Portfolio', icon: FileText },
          { id: 'assistant', label: 'Student Assistant', icon: Bot }
        ];
      case 'faculty':
        return [
          { id: 'approvals', label: 'Approvals', icon: CheckSquare },
          { id: 'monitoring', label: 'Student Monitoring', icon: Users }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'announcements', label: 'Announcements', icon: Megaphone }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};