import React, { useState } from 'react';
import { Plus, Calendar, List, Filter, Search, CheckCircle, Users, Clock, LogOut } from 'lucide-react';
import BookingCalendar from '../components/Bookings/BookingCalendar';
import BookingList from '../components/Bookings/BookingList';
import { mockBookings, mockGuests } from '../data/mockData';
import { Booking } from '../types';

const Bookings: React.FC = () => {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [guests] = useState(mockGuests);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const guest = guests.find(g => g.id === booking.guestId);
    const guestName = guest ? guest.name.toLowerCase() : '';
    const matchesSearch = guestName.includes(searchTerm.toLowerCase()) || 
                         booking.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || booking.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // In a real app, this would open a booking form for the selected date
  };

  const handleBookingClick = (booking: Booking) => {
    console.log('Booking clicked:', booking);
    // In a real app, this would open booking details
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking);
    // In a real app, this would open edit form
  };

  const handleCheckIn = (booking: Booking) => {
    console.log('Check-in booking:', booking);
    // In a real app, this would update booking status
  };

  const handleCheckOut = (booking: Booking) => {
    console.log('Check-out booking:', booking);
    // In a real app, this would update booking status
  };

  const handleCancelBooking = (booking: Booking) => {
    console.log('Cancel booking:', booking);
    // In a real app, this would update booking status
  };

  const getBookingStats = () => {
    const today = new Date();
    const todayCheckIns = bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      return checkIn.toDateString() === today.toDateString() && b.status === 'confirmed';
    }).length;
    
    const todayCheckOuts = bookings.filter(b => {
      const checkOut = new Date(b.checkOut);
      return checkOut.toDateString() === today.toDateString() && b.status === 'checked-in';
    }).length;

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const checkedInBookings = bookings.filter(b => b.status === 'checked-in').length;

    return {
      total: bookings.length,
      confirmed: confirmedBookings,
      checkedIn: checkedInBookings,
      todayCheckIns,
      todayCheckOuts
    };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings & Reservations</h1>
            <p className="text-lg text-gray-600">
              Manage guest reservations and check-ins
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'calendar' 
                    ? 'bg-white shadow-sm text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Calendar View"
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button className="btn btn-primary whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card text-center hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600">Total Bookings</div>
        </div>
        <div className="card text-center hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
              <CheckCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-1">{stats.confirmed}</div>
          <div className="text-sm font-medium text-gray-600">Confirmed</div>
        </div>
        <div className="card text-center hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-success-100 rounded-full group-hover:bg-success-200 transition-colors">
              <Users className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-success-600 mb-1">{stats.checkedIn}</div>
          <div className="text-sm font-medium text-gray-600">Checked-in</div>
        </div>
        <div className="card text-center hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-warning-100 rounded-full group-hover:bg-warning-200 transition-colors">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-warning-600 mb-1">{stats.todayCheckIns}</div>
          <div className="text-sm font-medium text-gray-600">Today's Check-ins</div>
        </div>
        <div className="card text-center hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-danger-100 rounded-full group-hover:bg-danger-200 transition-colors">
              <LogOut className="h-6 w-6 text-danger-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-danger-600 mb-1">{stats.todayCheckOuts}</div>
          <div className="text-sm font-medium text-gray-600">Today's Check-outs</div>
        </div>
      </div>

      {/* Filters */}
      {viewMode === 'list' && (
        <div className="card mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Filter className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Bookings
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Guest name or room..."
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-in</option>
                <option value="checked-out">Checked-out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Sources</option>
                <option value="direct">Direct</option>
                <option value="booking.com">Booking.com</option>
                <option value="tripadvisor">TripAdvisor</option>
                <option value="expedia">Expedia</option>
                <option value="phone">Phone</option>
                <option value="walk-in">Walk-in</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSourceFilter('all');
                }}
                className="btn btn-secondary w-full"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {viewMode === 'calendar' ? (
          <div className="animate-fade-in">
            <BookingCalendar
              bookings={filteredBookings}
              onDateClick={handleDateClick}
              onBookingClick={handleBookingClick}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Booking List</h2>
                <p className="text-gray-600 mt-1">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
              </div>
            </div>
            <BookingList
              bookings={filteredBookings}
              guests={guests}
              onEdit={handleEditBooking}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onCancel={handleCancelBooking}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
