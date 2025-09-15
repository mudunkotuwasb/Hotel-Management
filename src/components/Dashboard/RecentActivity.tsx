import React from 'react';
import { Clock, User, Bed, Utensils } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'checkin' | 'checkout' | 'booking' | 'order';
  description: string;
  time: string;
  room?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'checkin',
    description: 'John Smith checked in',
    time: '2 hours ago',
    room: 'Room 102'
  },
  {
    id: '2',
    type: 'order',
    description: 'Room service order placed',
    time: '3 hours ago',
    room: 'Room 201'
  },
  {
    id: '3',
    type: 'booking',
    description: 'New reservation confirmed',
    time: '4 hours ago',
    room: 'Room 103'
  },
  {
    id: '4',
    type: 'checkout',
    description: 'Maria Garcia checked out',
    time: '5 hours ago',
    room: 'Room 105'
  }
];

const RecentActivity: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <User className="h-4 w-4 text-success-600" />;
      case 'checkout':
        return <User className="h-4 w-4 text-danger-600" />;
      case 'booking':
        return <Bed className="h-4 w-4 text-primary-600" />;
      case 'order':
        return <Utensils className="h-4 w-4 text-warning-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              {activity.room && (
                <p className="text-xs text-gray-500">{activity.room}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

