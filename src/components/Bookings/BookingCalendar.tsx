import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Booking } from '../../types';

interface BookingCalendarProps {
  bookings: Booking[];
  onDateClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  onDateClick,
  onBookingClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before month start
  const startDate = monthStart;
  const startDayOfWeek = startDate.getDay();
  const emptyCells = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return date >= checkIn && date < checkOut;
    });
  };

  const getBookingStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'checked-in':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: Booking['source']) => {
    switch (source) {
      case 'booking.com':
        return '🏨';
      case 'tripadvisor':
        return '🦉';
      case 'expedia':
        return '✈️';
      case 'direct':
        return '🏠';
      case 'phone':
        return '📞';
      case 'walk-in':
        return '🚶';
      default:
        return '📅';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn btn-secondary text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month start */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="bg-white p-2 min-h-[100px]" />
        ))}

        {/* Calendar days */}
        {monthDays.map((day) => {
          const dayBookings = getBookingsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={`bg-white p-2 min-h-[100px] border-r border-b border-gray-100 ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              } ${isToday ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-primary-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </span>
                {onDateClick && (
                  <button
                    onClick={() => onDateClick(day)}
                    className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Bookings for this day */}
              <div className="space-y-1">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => onBookingClick?.(booking)}
                    className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow ${getBookingStatusColor(booking.status)}`}
                    title={`${booking.guestId} - ${booking.source}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{getSourceIcon(booking.source)}</span>
                      <span className="truncate">Room {booking.roomId}</span>
                    </div>
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayBookings.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-100 border border-primary-200 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-100 border border-success-200 rounded"></div>
          <span>Checked-in</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span>Checked-out</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-danger-100 border border-danger-200 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;



