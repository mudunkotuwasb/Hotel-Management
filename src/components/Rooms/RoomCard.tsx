import React from 'react';
import { Room, Guest, Booking } from '../../types';
import { 
  Bed, 
  Users, 
  Wifi, 
  Tv, 
  Wind, 
  Coffee,
  MapPin,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Eye,
  Trash2,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onEdit?: (room: Room) => void;
  onStatusChange?: (roomId: string, status: Room['status']) => void;
  onView?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onCheckIn?: (room: Room) => void;
  onCheckOut?: (room: Room) => void;
  guest?: Guest | null;
  booking?: Booking | null;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onEdit, 
  onStatusChange, 
  onView, 
  onDelete, 
  onCheckIn, 
  onCheckOut, 
  guest, 
  booking 
}) => {
  const getStatusConfig = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return { 
          color: 'status-available', 
          icon: CheckCircle, 
          text: 'Available',
          bg: 'bg-success-50 border-success-200'
        };
      case 'occupied':
        return { 
          color: 'status-occupied', 
          icon: Users, 
          text: 'Occupied',
          bg: 'bg-danger-50 border-danger-200'
        };
      case 'reserved':
        return { 
          color: 'status-reserved', 
          icon: Clock, 
          text: 'Reserved',
          bg: 'bg-warning-50 border-warning-200'
        };
      case 'cleaning':
        return { 
          color: 'status-cleaning', 
          icon: AlertTriangle, 
          text: 'Cleaning',
          bg: 'bg-warning-50 border-warning-200'
        };
      case 'maintenance':
        return { 
          color: 'status-maintenance', 
          icon: AlertTriangle, 
          text: 'Maintenance',
          bg: 'bg-navy-50 border-navy-200'
        };
      default:
        return { 
          color: 'status-available', 
          icon: CheckCircle, 
          text: 'Available',
          bg: 'bg-success-50 border-success-200'
        };
    }
  };


  const getRoomTypeIcon = (type: Room['type']) => {
    switch (type) {
      case 'single':
        return <Bed className="h-4 w-4" />;
      case 'double':
        return <Users className="h-4 w-4" />;
      case 'suite':
        return <Bed className="h-4 w-4" />;
      case 'family':
        return <Users className="h-4 w-4" />;
      default:
        return <Bed className="h-4 w-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'tv':
        return <Tv className="h-3 w-3" />;
      case 'ac':
        return <Wind className="h-3 w-3" />;
      case 'mini bar':
        return <Coffee className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(room.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`room-card ${statusConfig.bg} group`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white rounded-xl shadow-soft">
            {getRoomTypeIcon(room.type)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-900">
              Room {room.number}
            </h3>
            <p className="text-sm text-navy-600 font-medium capitalize">
              {room.type} • Floor {room.floor}
            </p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.text}
        </div>
      </div>

      {/* Guest Information */}
      {guest && room.status === 'occupied' && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-navy-200">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-4 w-4 text-navy-600" />
            <span className="text-sm font-semibold text-navy-900">Current Guest</span>
          </div>
          <div className="text-sm text-navy-600">
            <div className="font-medium">{guest.name}</div>
            <div className="text-xs">{guest.email}</div>
            {booking && (
              <div className="text-xs mt-1">
                Check-in: {new Date(booking.checkIn).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cleaning Information */}
      {room.needsCleaning && (
        <div className="mb-4 p-3 bg-warning-50 rounded-lg border border-warning-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning-600" />
            <span className="text-sm font-semibold text-warning-900">Needs Cleaning</span>
          </div>
          {room.cleaningNotes && (
            <div className="text-sm text-warning-700 mb-1">
              {room.cleaningNotes}
            </div>
          )}
          {room.lastCleaned && (
            <div className="text-xs text-warning-600">
              Last cleaned: {new Date(room.lastCleaned).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Room Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm text-navy-600">
          <span className="font-medium">Rate per night</span>
          <span className="font-bold text-navy-900">${room.rate}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-navy-600">
          <span className="font-medium">Max occupancy</span>
          <span className="font-bold text-navy-900">{room.maxOccupancy} guests</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-navy-600 mb-2">
          <MapPin className="h-4 w-4 mr-2 text-navy-500" />
          <span className="font-semibold">Amenities</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 text-xs text-navy-600 bg-white px-2 py-1 rounded-lg border border-navy-200">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {room.amenities.length > 3 && (
            <div className="text-xs text-navy-500 bg-white px-2 py-1 rounded-lg border border-navy-200">
              +{room.amenities.length - 3} more
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {/* Primary Actions */}
        <div className="flex space-x-2">
          {room.status === 'available' && onCheckIn && (
            <button
              onClick={() => onCheckIn(room)}
              className="flex-1 btn btn-success text-sm group"
            >
              <LogIn className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Check In
            </button>
          )}
          {room.status === 'occupied' && onCheckOut && (
            <button
              onClick={() => onCheckOut(room)}
              className="flex-1 btn btn-warning text-sm group"
            >
              <LogOut className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Check Out
            </button>
          )}
          {room.status === 'cleaning' && onStatusChange && (
            <button
              onClick={() => onStatusChange(room.id, 'available')}
              className="flex-1 btn btn-success text-sm group"
            >
              <CheckCircle className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Mark Clean
            </button>
          )}
          {room.status === 'available' && onStatusChange && (
            <button
              onClick={() => onStatusChange(room.id, 'cleaning')}
              className="flex-1 btn btn-warning text-sm group"
            >
              <AlertTriangle className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Needs Cleaning
            </button>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(room)}
              className="flex-1 btn btn-secondary text-sm group"
            >
              <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(room)}
              className="flex-1 btn btn-primary text-sm group"
            >
              <Edit className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(room)}
              className="btn btn-danger text-sm group"
            >
              <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
