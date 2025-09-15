import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Users, Clock, CheckCircle, AlertTriangle, Save, X } from 'lucide-react';
import TaskCard from '../components/Housekeeping/TaskCard';
import { mockHousekeepingTasks, mockRooms } from '../data/mockData';
import { HousekeepingTask, Room } from '../types';
import toast from 'react-hot-toast';

const Housekeeping: React.FC = () => {
  const [tasks, setTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('hotel_housekeeping_tasks');
    return saved ? JSON.parse(saved) : mockHousekeepingTasks;
  });
  const [rooms] = useState<Room[]>(mockRooms);
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<HousekeepingTask>>({
    roomId: '',
    staffId: '',
    type: 'cleaning',
    priority: 'medium',
    notes: ''
  });

  // Mock staff data
  const staffMembers = [
    { id: 'staff-1', name: 'Sarah Johnson', role: 'Housekeeper' },
    { id: 'staff-2', name: 'Mike Chen', role: 'Housekeeper' },
    { id: 'staff-3', name: 'Lisa Rodriguez', role: 'Supervisor' }
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStaff = selectedStaff === 'all' || task.staffId === selectedStaff;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesStaff && matchesStatus && matchesPriority;
    });
  }, [tasks, selectedStaff, statusFilter, priorityFilter]);

  const getTaskStats = () => {
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;

    return { pending, inProgress, completed, highPriority };
  };

  const stats = getTaskStats();

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('hotel_housekeeping_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleStatusChange = (taskId: string, status: HousekeepingTask['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status,
            completedAt: status === 'completed' ? new Date() : undefined
          }
        : task
    );
    setTasks(updatedTasks);
    toast.success(`Task status updated to ${status}`);
  };

  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, completedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    toast.success('Task completed successfully');
  };

  const handleAddTask = () => {
    if (!newTask.roomId || !newTask.staffId) {
      toast.error('Please select a room and staff member');
      return;
    }

    const task: HousekeepingTask = {
      id: Date.now().toString(),
      roomId: newTask.roomId,
      staffId: newTask.staffId,
      status: 'pending',
      type: newTask.type as HousekeepingTask['type'],
      priority: newTask.priority as HousekeepingTask['priority'],
      assignedAt: new Date(),
      notes: newTask.notes
    };

    setTasks([...tasks, task]);
    toast.success('New task created successfully');
    
    setShowAddForm(false);
    setNewTask({
      roomId: '',
      staffId: '',
      type: 'cleaning',
      priority: 'medium',
      notes: ''
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      toast.success('Task deleted successfully');
    }
  };

  const getRoomForTask = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housekeeping</h1>
          <p className="text-gray-600 mt-1">
            Manage cleaning tasks and room maintenance
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="input"
            >
              <option value="all">All Staff</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStaff('all');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTask({
                  roomId: '',
                  staffId: '',
                  type: 'cleaning',
                  priority: 'medium',
                  notes: ''
                });
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room *
              </label>
              <select
                value={newTask.roomId || ''}
                onChange={(e) => setNewTask({ ...newTask, roomId: e.target.value })}
                className="input"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.number} - {room.type} ({room.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff Member *
              </label>
              <select
                value={newTask.staffId || ''}
                onChange={(e) => setNewTask({ ...newTask, staffId: e.target.value })}
                className="input"
              >
                <option value="">Select staff member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} - {staff.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <select
                value={newTask.type || 'cleaning'}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value as HousekeepingTask['type'] })}
                className="input"
              >
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority || 'medium'}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as HousekeepingTask['priority'] })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newTask.notes || ''}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                className="input"
                rows={3}
                placeholder="Add any special instructions or notes..."
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddTask}
                className="btn btn-primary w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffMembers.map((staff) => {
            const staffTasks = tasks.filter(t => t.staffId === staff.id);
            const pendingTasks = staffTasks.filter(t => t.status === 'pending').length;
            const inProgressTasks = staffTasks.filter(t => t.status === 'in-progress').length;
            const completedTasks = staffTasks.filter(t => t.status === 'completed').length;

            return (
              <div key={staff.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{staff.name}</h4>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-warning-600">{pendingTasks}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">{inProgressTasks}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success-600">{completedTasks}</div>
                    <div className="text-xs text-gray-500">Done</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <p className="text-sm text-gray-600">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                room={getRoomForTask(task.roomId)}
                onStatusChange={handleStatusChange}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Housekeeping;

