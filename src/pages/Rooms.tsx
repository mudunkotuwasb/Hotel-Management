import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Grid, List, Search, Filter, Eye, Edit, Trash2, Save, X, User, LogIn, LogOut } from 'lucide-react';
import RoomCard from '../components/Rooms/RoomCard';
import RoomFilters from '../components/Rooms/RoomFilters';
import { mockRooms, mockBookings, mockGuests } from '../data/mockData';
import { Room, Booking, Guest } from '../types';
import toast from 'react-hot-toast';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotel_rooms');
    return saved ? JSON.parse(saved) : mockRooms;
  });
  const [bookings] = useState<Booking[]>(mockBookings);
  const [guests] = useState<Guest[]>(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: '',
    type: 'single',
    status: 'available',
    rate: 0,
    amenities: [],
    maxOccupancy: 1,
    floor: 1
  });
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [checkInRoom, setCheckInRoom] = useState<Room | null>(null);
  const [checkInGuest, setCheckInGuest] = useState<Partial<Guest>>({
    name: '',
    email: '',
    phone: ''
  });

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;

      return matchesSearch && matchesStatus && matchesType && matchesFloor;
    });
  }, [rooms, searchTerm, statusFilter, typeFilter, floorFilter]);

  // Save to localStorage whenever rooms change
  useEffect(() => {
    localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
  }, [rooms]);

  const handleStatusChange = (roomId: string, newStatus: Room['status']) => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId 
        ? { 
            ...room, 
            status: newStatus,
            needsCleaning: newStatus === 'cleaning' ? true : false,
            lastCleaned: newStatus === 'available' ? new Date() : room.lastCleaned
          }
        : room
    );
    setRooms(updatedRooms);
    toast.success(`Room status updated to ${newStatus}`);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setNewRoom(room);
    setShowAddForm(true);
  };

  const handleAddRoom = () => {
    if (!newRoom.number || !newRoom.rate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const room: Room = {
      id: editingRoom?.id || Date.now().toString(),
      number: newRoom.number,
      type: newRoom.type as Room['type'],
      status: newRoom.status as Room['status'],
      rate: newRoom.rate,
      amenities: newRoom.amenities || [],
      maxOccupancy: newRoom.maxOccupancy || 1,
      floor: newRoom.floor || 1
    };

    if (editingRoom) {
      const updatedRooms = rooms.map(r => r.id === editingRoom.id ? room : r);
      setRooms(updatedRooms);
      toast.success(`Room ${room.number} updated successfully`);
    } else {
      setRooms([...rooms, room]);
      toast.success(`Room ${room.number} added successfully`);
    }

    setShowAddForm(false);
    setEditingRoom(null);
    setNewRoom({
      number: '',
      type: 'single',
      status: 'available',
      rate: 0,
      amenities: [],
      maxOccupancy: 1,
      floor: 1
    });
  };

  const handleDeleteRoom = (room: Room) => {
    if (window.confirm(`Are you sure you want to delete Room ${room.number}?`)) {
      const updatedRooms = rooms.filter(r => r.id !== room.id);
      setRooms(updatedRooms);
      toast.success(`Room ${room.number} deleted successfully`);
    }
  };

  const handleCheckIn = (room: Room) => {
    setCheckInRoom(room);
    setShowCheckInForm(true);
  };

  const handleCheckOut = (room: Room) => {
    if (window.confirm(`Check out guest from Room ${room.number}?`)) {
      handleStatusChange(room.id, 'cleaning');
      toast.success(`Guest checked out from Room ${room.number}`);
    }
  };

  const handleProcessCheckIn = () => {
    if (!checkInGuest.name || !checkInGuest.email || !checkInGuest.phone) {
      toast.error('Please fill in all guest information');
      return;
    }

    if (checkInRoom) {
      handleStatusChange(checkInRoom.id, 'occupied');
      toast.success(`Guest checked in to Room ${checkInRoom.number}`);
    }

    setShowCheckInForm(false);
    setCheckInRoom(null);
    setCheckInGuest({
      name: '',
      email: '',
      phone: ''
    });
  };

  const getRoomBooking = (roomId: string) => {
    return bookings.find(booking => booking.roomId === roomId && booking.status === 'confirmed');
  };

  const getRoomGuest = (roomId: string) => {
    const booking = getRoomBooking(roomId);
    if (booking) {
      return guests.find(guest => guest.id === booking.guestId);
    }
    return null;
  };

  const getStatusCounts = () => {
    const counts = {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      cleaning: rooms.filter(r => r.status === 'cleaning').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Room Management</h1>
          <p className="text-navy-600 mt-1">
            Manage {statusCounts.total} rooms across the hotel
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-navy-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-soft text-primary-600' : 'text-navy-600 hover:text-navy-900'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-soft text-primary-600' : 'text-navy-600 hover:text-navy-900'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button 
            className="btn btn-primary group"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
            Add Room
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="stat-card text-center group">
          <div className="text-3xl font-bold text-navy-900 mb-1">{statusCounts.total}</div>
          <div className="text-sm text-navy-600 font-medium">Total Rooms</div>
        </div>
        <div className="stat-card text-center group bg-success-50 border-success-200">
          <div className="text-3xl font-bold text-success-600 mb-1">{statusCounts.available}</div>
          <div className="text-sm text-success-700 font-medium">Available</div>
        </div>
        <div className="stat-card text-center group bg-danger-50 border-danger-200">
          <div className="text-3xl font-bold text-danger-600 mb-1">{statusCounts.occupied}</div>
          <div className="text-sm text-danger-700 font-medium">Occupied</div>
        </div>
        <div className="stat-card text-center group bg-warning-50 border-warning-200">
          <div className="text-3xl font-bold text-warning-600 mb-1">{statusCounts.cleaning}</div>
          <div className="text-sm text-warning-700 font-medium">Needs Cleaning</div>
        </div>
        <div className="stat-card text-center group bg-navy-50 border-navy-200">
          <div className="text-3xl font-bold text-navy-600 mb-1">{statusCounts.maintenance}</div>
          <div className="text-sm text-navy-700 font-medium">Maintenance</div>
        </div>
      </div>

      {/* Filters */}
      <RoomFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        floorFilter={floorFilter}
        onFloorFilterChange={setFloorFilter}
      />

      {/* Add/Edit Room Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingRoom(null);
                setNewRoom({
                  number: '',
                  type: 'single',
                  status: 'available',
                  rate: 0,
                  amenities: [],
                  maxOccupancy: 1,
                  floor: 1
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
                Room Number *
              </label>
              <input
                type="text"
                value={newRoom.number || ''}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                className="input"
                placeholder="e.g., 101, 201A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select
                value={newRoom.type || 'single'}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
                className="input"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newRoom.status || 'available'}
                onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as Room['status'] })}
                className="input"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Night *
              </label>
              <input
                type="number"
                value={newRoom.rate || ''}
                onChange={(e) => setNewRoom({ ...newRoom, rate: parseFloat(e.target.value) || 0 })}
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="number"
                value={newRoom.floor || ''}
                onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 1 })}
                className="input"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Occupancy
              </label>
              <input
                type="number"
                value={newRoom.maxOccupancy || ''}
                onChange={(e) => setNewRoom({ ...newRoom, maxOccupancy: parseInt(e.target.value) || 1 })}
                className="input"
                min="1"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Kitchenette', 'Safe'].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newRoom.amenities?.includes(amenity) || false}
                      onChange={(e) => {
                        const amenities = newRoom.amenities || [];
                        if (e.target.checked) {
                          setNewRoom({ ...newRoom, amenities: [...amenities, amenity] });
                        } else {
                          setNewRoom({ ...newRoom, amenities: amenities.filter(a => a !== amenity) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddRoom}
                className="btn btn-primary w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-in Form */}
      {showCheckInForm && checkInRoom && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Check-in Guest - Room {checkInRoom.number}
            </h3>
            <button
              onClick={() => {
                setShowCheckInForm(false);
                setCheckInRoom(null);
                setCheckInGuest({
                  name: '',
                  email: '',
                  phone: ''
                });
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest Name *
              </label>
              <input
                type="text"
                value={checkInGuest.name || ''}
                onChange={(e) => setCheckInGuest({ ...checkInGuest, name: e.target.value })}
                className="input"
                placeholder="Enter guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={checkInGuest.email || ''}
                onChange={(e) => setCheckInGuest({ ...checkInGuest, email: e.target.value })}
                className="input"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={checkInGuest.phone || ''}
                onChange={(e) => setCheckInGuest({ ...checkInGuest, phone: e.target.value })}
                className="input"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleProcessCheckIn}
                className="btn btn-primary w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Check In Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-navy-600 font-medium">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </p>
        <div className="flex items-center space-x-2 text-sm text-navy-500">
          <Filter className="h-4 w-4" />
          <span>Filtered by: {statusFilter !== 'all' ? `Status: ${statusFilter}` : 'All statuses'}</span>
        </div>
      </div>

      {/* Room Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRoom}
              onStatusChange={handleStatusChange}
              onView={handleEditRoom}
              onDelete={handleDeleteRoom}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              guest={getRoomGuest(room.id)}
              booking={getRoomBooking(room.id)}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Room {room.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{room.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        room.status === 'available' ? 'status-available' :
                        room.status === 'occupied' ? 'status-occupied' :
                        room.status === 'reserved' ? 'status-reserved' :
                        room.status === 'cleaning' ? 'status-cleaning' :
                        'status-maintenance'
                      }`}>
                        {room.status === 'available' ? 'Available' :
                         room.status === 'occupied' ? 'Occupied' :
                         room.status === 'reserved' ? 'Reserved' :
                         room.status === 'cleaning' ? 'Needs Cleaning' :
                         'Maintenance'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${room.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      {room.status === 'cleaning' && (
                        <button
                          onClick={() => handleStatusChange(room.id, 'available')}
                          className="text-success-600 hover:text-success-900"
                        >
                          Mark Clean
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;
