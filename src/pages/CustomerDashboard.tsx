import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Bed, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Plus,
  LogOut,
  Navigation,
  Camera,
  Mountain,
  Waves
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockBookings, mockRooms, mockMenuItems, mockTripPackages } from '../data/mockData';
import { Booking, Room, MenuItem, TripPackage } from '../types';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings] = useState<Booking[]>(mockBookings.filter(b => b.guestId === user?.id));
  const [availableRooms] = useState<Room[]>(mockRooms.filter(r => r.status === 'available'));
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);
  const [tripPackages] = useState<TripPackage[]>(mockTripPackages.filter(p => p.isActive));

  const getBookingStatus = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { text: 'Confirmed', color: 'text-primary-600 bg-primary-100', icon: CheckCircle };
      case 'checked-in':
        return { text: 'Checked In', color: 'text-success-600 bg-success-100', icon: CheckCircle };
      case 'checked-out':
        return { text: 'Completed', color: 'text-gray-600 bg-gray-100', icon: CheckCircle };
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-danger-600 bg-danger-100', icon: XCircle };
      default:
        return { text: 'Unknown', color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  const getRoomTypeIcon = (type: Room['type']) => {
    switch (type) {
      case 'single':
        return <Bed className="h-4 w-4" />;
      case 'double':
        return <Users className="h-4 w-4" />;
      case 'suite':
        return <Star className="h-4 w-4" />;
      case 'family':
        return <Users className="h-4 w-4" />;
      default:
        return <Bed className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-primary-100">Manage your bookings and explore our services</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-success-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {bookings.filter(b => b.status === 'checked-out').length}
          </div>
          <div className="text-sm text-gray-600">Completed Stays</div>
        </div>
        <div className="card text-center">
          <Star className="h-8 w-8 text-warning-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </button>
        </div>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => {
            const room = mockRooms.find(r => r.id === booking.roomId);
            const status = getBookingStatus(booking.status);
            const StatusIcon = status.icon;
            
            return (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      {getRoomTypeIcon(room?.type || 'single')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {room ? `Room ${room.number}` : `Room ${booking.roomId}`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.text}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">${booking.totalAmount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => {
          const room = mockRooms.find(r => r.id === booking.roomId);
          const status = getBookingStatus(booking.status);
          const StatusIcon = status.icon;
          
          return (
            <div key={booking.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    {getRoomTypeIcon(room?.type || 'single')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {room ? `Room ${room.number}` : `Room ${booking.roomId}`}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{room?.type} Room</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </span>
                      <span>to</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.text}
                  </span>
                  <p className="text-lg font-semibold text-gray-900 mt-2">${booking.totalAmount}</p>
                  <div className="flex space-x-2 mt-3">
                    <button className="btn btn-secondary text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="btn btn-primary text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Modify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderExplore = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Our Rooms</h2>
        <p className="text-gray-600">Discover our luxurious accommodations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableRooms.map((room) => (
          <div key={room.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  {getRoomTypeIcon(room.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Room {room.number}</h3>
                  <p className="text-sm text-gray-500 capitalize">{room.type}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Available
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Rate per night</span>
                <span className="font-semibold">${room.rate}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Max occupancy</span>
                <span className="font-semibold">{room.maxOccupancy} guests</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {room.amenities.map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <button className="btn btn-primary w-full">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Menu</h2>
        <p className="text-gray-600">Explore our delicious dining options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Utensils className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-primary-600">${item.price}</span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-1">
                {item.ingredients.map((ingredient, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.available 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
              <button 
                className={`btn text-sm ${
                  item.available 
                    ? 'btn-primary' 
                    : 'btn-secondary cursor-not-allowed'
                }`}
                disabled={!item.available}
              >
                {item.available ? 'Order Now' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getTripIcon = (destination: string) => {
    if (destination.toLowerCase().includes('mountain')) return Mountain;
    if (destination.toLowerCase().includes('coast') || destination.toLowerCase().includes('beach')) return Waves;
    return Navigation;
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return Car;
      case 'bus': return Users;
      case 'van': return Car;
      case 'luxury_car': return Star;
      default: return Car;
    }
  };

  const renderTripPackages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Packages</h2>
        <p className="text-gray-600">Discover amazing destinations and experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripPackages.map((trip) => {
          const TripIcon = getTripIcon(trip.destination);
          const VehicleIcon = getVehicleIcon(trip.vehicle.type);
          
          return (
            <div key={trip.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <TripIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                    <p className="text-sm text-gray-500">{trip.destination}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary-600">${trip.price}</span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">{trip.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{trip.duration} day{trip.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Max {trip.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <VehicleIcon className="h-4 w-4 mr-2" />
                    <span>{trip.vehicle.name}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {trip.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {trip.highlights.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{trip.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Includes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {trip.includes.slice(0, 2).map((item, index) => (
                      <span key={index} className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                    {trip.includes.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{trip.includes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">From ${trip.priceRanges[0]?.min || trip.price}</span>
                </div>
                <button className="btn btn-primary text-sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  className="input"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Non-smoking room</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">High floor preference</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Calendar },
    { id: 'bookings', name: 'My Bookings', icon: Bed },
    { id: 'explore', name: 'Explore Rooms', icon: MapPin },
    { id: 'menu', name: 'Restaurant Menu', icon: Utensils },
    { id: 'trips', name: 'Trip Packages', icon: Navigation },
    { id: 'profile', name: 'Profile', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Bed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-900">Grand Hotel</h1>
                <p className="text-xs text-navy-500">Customer Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-navy-50 rounded-xl p-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-navy-900">{user?.name}</p>
                  <p className="text-xs text-navy-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-navy-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'explore' && renderExplore()}
        {activeTab === 'menu' && renderMenu()}
        {activeTab === 'trips' && renderTripPackages()}
        {activeTab === 'profile' && renderProfile()}
      </main>
    </div>
  );
};

export default CustomerDashboard;
