import React from 'react';
import { HousekeepingTask, Room } from '../../types';
import { Clock, User, AlertTriangle, CheckCircle, Play, Bed, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: HousekeepingTask;
  room?: Room;
  onStatusChange?: (taskId: string, status: HousekeepingTask['status']) => void;
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  room,
  onStatusChange,
  onComplete,
  onDelete
}) => {
  const getStatusColor = (status: HousekeepingTask['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: HousekeepingTask['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = (priority: HousekeepingTask['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-gray-600';
      case 'medium':
        return 'text-warning-600';
      case 'high':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: HousekeepingTask['type']) => {
    switch (type) {
      case 'cleaning':
        return <Bed className="h-4 w-4" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'inspection':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bed className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: HousekeepingTask['type']) => {
    switch (type) {
      case 'cleaning':
        return 'Cleaning';
      case 'maintenance':
        return 'Maintenance';
      case 'inspection':
        return 'Inspection';
      default:
        return 'Task';
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            {getTypeIcon(task.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {room ? `Room ${room.number}` : `Room ${task.roomId}`}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {getTypeText(task.type)} • {room?.type || 'Unknown Type'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 hover:bg-red-100 rounded"
                title="Delete task"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </button>
            )}
          </div>
          <p className={`text-xs mt-1 ${getPriorityColor(task.priority)}`}>
            {task.priority} priority
          </p>
        </div>
      </div>

      {task.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {task.notes}
          </p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Assigned</span>
          <span className="font-medium">
            {format(new Date(task.assignedAt), 'MMM dd, HH:mm')}
          </span>
        </div>
        {task.completedAt && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Completed</span>
            <span className="font-medium">
              {format(new Date(task.completedAt), 'MMM dd, HH:mm')}
            </span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {task.status === 'pending' && (
          <button
            onClick={() => onStatusChange?.(task.id, 'in-progress')}
            className="btn btn-warning flex-1 text-sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Start Task
          </button>
        )}
        {task.status === 'in-progress' && (
          <button
            onClick={() => onComplete?.(task.id)}
            className="btn btn-success flex-1 text-sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </button>
        )}
        {task.status === 'completed' && (
          <div className="flex-1 text-center text-sm text-success-600 font-medium">
            Task Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

