import React from 'react';
import { Calendar, User, Bed, Phone, Globe, Home, MapPin } from 'lucide-react';
import { Booking, Guest } from '../../types';
import { format } from 'date-fns';

interface BookingListProps {
  bookings: Booking[];
  guests: Guest[];
  onEdit?: (booking: Booking) => void;
  onCheckIn?: (booking: Booking) => void;
  onCheckOut?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  guests,
  onEdit,
  onCheckIn,
  onCheckOut,
  onCancel
}) => {
  const getGuestName = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? guest.name : 'Unknown Guest';
  };

  const getSourceIcon = (source: Booking['source']) => {
    switch (source) {
      case 'booking.com':
        return <Globe className="h-4 w-4 text-blue-600" />;
      case 'tripadvisor':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'expedia':
        return <Globe className="h-4 w-4 text-orange-600" />;
      case 'direct':
        return <Home className="h-4 w-4 text-gray-600" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-gray-600" />;
      case 'walk-in':
        return <MapPin className="h-4 w-4 text-gray-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'status-reserved';
      case 'checked-in':
        return 'status-occupied';
      case 'checked-out':
        return 'status-available';
      case 'cancelled':
        return 'status-maintenance';
      default:
        return 'status-available';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'checked-in':
        return 'Checked-in';
      case 'checked-out':
        return 'Checked-out';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getPackageText = (pkg: Booking['package']) => {
    switch (pkg) {
      case 'room-only':
        return 'Room Only';
      case 'bed-breakfast':
        return 'Bed & Breakfast';
      case 'half-board':
        return 'Half Board';
      case 'full-board':
        return 'Full Board';
      default:
        return 'Room Only';
    }
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {getGuestName(booking.guestId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {booking.guestId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">Room {booking.roomId}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{getPackageText(booking.package)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getSourceIcon(booking.source)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {booking.source.replace('-', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${booking.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => onCheckIn?.(booking)}
                          className="text-success-600 hover:text-success-900"
                        >
                          Check-in
                        </button>
                        <button
                          onClick={() => onEdit?.(booking)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onCancel?.(booking)}
                          className="text-danger-600 hover:text-danger-900"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'checked-in' && (
                      <button
                        onClick={() => onCheckOut?.(booking)}
                        className="text-warning-600 hover:text-warning-900"
                      >
                        Check-out
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Create a new booking to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BookingList;



