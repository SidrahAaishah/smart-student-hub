import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  Target, 
  Clock, 
  Save,
  Calendar
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TimeSlot {
  id: string;
  time: string;
  subject: string;
  type: string;
}

interface StudentAssistantProps {
  userId: string;
}

export const StudentAssistant: React.FC<StudentAssistantProps> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '09:00 AM', subject: '', type: '' },
    { id: '2', time: '10:00 AM', subject: '', type: '' },
    { id: '3', time: '11:00 AM', subject: '', type: '' },
    { id: '4', time: '12:00 PM', subject: '', type: '' },
    { id: '5', time: '01:00 PM', subject: 'Lunch Break', type: 'Break' },
    { id: '6', time: '02:00 PM', subject: '', type: '' },
    { id: '7', time: '03:00 PM', subject: '', type: '' },
    { id: '8', time: '04:00 PM', subject: '', type: '' },
    { id: '9', time: '05:00 PM', subject: '', type: '' }
  ]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem(`todos_${userId}`);
    const savedGoal = localStorage.getItem(`dailyGoal_${userId}`);
    const savedTimeSlots = localStorage.getItem(`timeSlots_${userId}`);

    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedGoal) setDailyGoal(savedGoal);
    if (savedTimeSlots) setTimeSlots(JSON.parse(savedTimeSlots));
  }, [userId]);

  // Save data to localStorage
  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem(`todos_${userId}`, JSON.stringify(newTodos));
  };

  const saveDailyGoal = (goal: string) => {
    setDailyGoal(goal);
    localStorage.setItem(`dailyGoal_${userId}`, goal);
  };

  const saveTimeSlots = (slots: TimeSlot[]) => {
    setTimeSlots(slots);
    localStorage.setItem(`timeSlots_${userId}`, JSON.stringify(slots));
  };

  // Todo functions
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      saveTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingTodo(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingTodo && editText.trim()) {
      const updatedTodos = todos.map(todo =>
        todo.id === editingTodo ? { ...todo, text: editText.trim() } : todo
      );
      saveTodos(updatedTodos);
    }
    setEditingTodo(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  // Timetable functions
  const updateTimeSlot = (id: string, field: 'subject' | 'type', value: string) => {
    const updatedSlots = timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    saveTimeSlots(updatedSlots);
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Student Assistant</h1>
        <p className="text-purple-100 text-sm sm:text-base">Organize your day, track your goals, and manage your schedule</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Left Column - Todo List and Goals */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Daily Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Goals of Today</h2>
            </div>
            <textarea
              value={dailyGoal}
              onChange={(e) => saveDailyGoal(e.target.value)}
              placeholder="What do you want to achieve today? Write your daily goals here..."
              className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
            />
            <div className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">To-Do List</h2>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {completedTodos}/{totalTodos} completed
              </div>
            </div>

            {/* Progress Bar */}
            {totalTodos > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Add Todo */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base min-h-[44px]"
              />
              <button
                onClick={addTodo}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center min-h-[44px] min-w-[44px] justify-center"
                aria-label="Add task"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Todo Items */}
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    todo.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors min-w-[24px] min-h-[24px] ${
                      todo.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>

                  {editingTodo === todo.id ? (
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm min-h-[32px]"
                        autoFocus
                      />
                      <button 
                        onClick={saveEdit} 
                        className="text-green-600 hover:text-green-700 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="Save edit"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="text-gray-600 hover:text-gray-700 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="Cancel edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-sm sm:text-base ${
                          todo.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {todos.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <Check className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No tasks yet. Add one above to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Timetable */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-6">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Scheduled Time Table</h2>
          </div>

          {/* Mobile: Stack layout */}
          <div className="sm:hidden space-y-3 max-h-80 overflow-y-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {slot.time}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={slot.subject}
                    onChange={(e) => updateTimeSlot(slot.id, 'subject', e.target.value)}
                    placeholder="Subject/Activity"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[44px]"
                  />
                  <select
                    value={slot.type}
                    onChange={(e) => updateTimeSlot(slot.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white min-h-[44px]"
                  >
                    <option value="">Type</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Study">Study</option>
                    <option value="Break">Break</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden sm:block space-y-3 max-h-96 overflow-y-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="grid grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {slot.time}
                  </span>
                </div>
                <input
                  type="text"
                  value={slot.subject}
                  onChange={(e) => updateTimeSlot(slot.id, 'subject', e.target.value)}
                  placeholder="Subject/Activity"
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <select
                  value={slot.type}
                  onChange={(e) => updateTimeSlot(slot.id, 'type', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="">Type</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Study">Study</option>
                  <option value="Break">Break</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              💡 Tip: <span className="hidden sm:inline">Click on any field to edit your schedule. Changes are saved automatically.</span>
              <span className="sm:hidden">Tap fields to edit. Auto-saved.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};