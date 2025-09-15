import React, { useState, useMemo } from 'react';
import { Plus, Navigation, Mountain, Waves, Car, Users, Star, Edit, Trash2, Save, X, Eye, Clock, MapPin } from 'lucide-react';
import { mockTripPackages, mockTripBookings } from '../data/mockData';
import { TripPackage, TripBooking } from '../types';
import toast from 'react-hot-toast';

const TripPackages: React.FC = () => {
  const [tripPackages, setTripPackages] = useState<TripPackage[]>(mockTripPackages);
  const [tripBookings] = useState<TripBooking[]>(mockTripBookings);
  const [activeTab, setActiveTab] = useState<'packages' | 'bookings'>('packages');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TripPackage | null>(null);
  const [newPackage, setNewPackage] = useState<Partial<TripPackage>>({
    name: '',
    description: '',
    destination: '',
    duration: 1,
    price: 0,
    maxParticipants: 1,
    includes: [],
    highlights: [],
    vehicle: {
      type: 'car',
      capacity: 4,
      name: ''
    },
    priceRanges: [],
    isActive: true,
    images: []
  });

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

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.description || !newPackage.destination) {
      toast.error('Please fill in all required fields');
      return;
    }

    const packageData: TripPackage = {
      id: editingPackage?.id || Date.now().toString(),
      name: newPackage.name,
      description: newPackage.description,
      destination: newPackage.destination,
      duration: newPackage.duration || 1,
      price: newPackage.price || 0,
      maxParticipants: newPackage.maxParticipants || 1,
      includes: newPackage.includes || [],
      highlights: newPackage.highlights || [],
      vehicle: newPackage.vehicle || { type: 'car', capacity: 4, name: '' },
      priceRanges: newPackage.priceRanges || [],
      isActive: newPackage.isActive !== false,
      images: newPackage.images || [],
      createdAt: editingPackage?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingPackage) {
      const updatedPackages = tripPackages.map(p => p.id === editingPackage.id ? packageData : p);
      setTripPackages(updatedPackages);
      toast.success('Trip package updated successfully');
    } else {
      setTripPackages([...tripPackages, packageData]);
      toast.success('Trip package created successfully');
    }

    setShowAddForm(false);
    setEditingPackage(null);
    setNewPackage({
      name: '',
      description: '',
      destination: '',
      duration: 1,
      price: 0,
      maxParticipants: 1,
      includes: [],
      highlights: [],
      vehicle: {
        type: 'car',
        capacity: 4,
        name: ''
      },
      priceRanges: [],
      isActive: true,
      images: []
    });
  };

  const handleEditPackage = (pkg: TripPackage) => {
    setEditingPackage(pkg);
    setNewPackage(pkg);
    setShowAddForm(true);
  };

  const handleDeletePackage = (pkg: TripPackage) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
      const updatedPackages = tripPackages.filter(p => p.id !== pkg.id);
      setTripPackages(updatedPackages);
      toast.success('Trip package deleted successfully');
    }
  };

  const handleToggleActive = (pkg: TripPackage) => {
    const updatedPackages = tripPackages.map(p => 
      p.id === pkg.id ? { ...p, isActive: !p.isActive } : p
    );
    setTripPackages(updatedPackages);
    toast.success(`Package ${pkg.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const getBookingStats = () => {
    const total = tripBookings.length;
    const pending = tripBookings.filter(b => b.status === 'pending').length;
    const confirmed = tripBookings.filter(b => b.status === 'confirmed').length;
    const completed = tripBookings.filter(b => b.status === 'completed').length;

    return { total, pending, confirmed, completed };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Packages</h1>
          <p className="text-gray-600 mt-1">
            Manage trip packages and bookings
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'packages'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Packages ({tripPackages.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Bookings ({tripBookings.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Stats */}
      {activeTab === 'bookings' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      )}

      {/* Add/Edit Package Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPackage ? 'Edit Trip Package' : 'Add New Trip Package'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingPackage(null);
                setNewPackage({
                  name: '',
                  description: '',
                  destination: '',
                  duration: 1,
                  price: 0,
                  maxParticipants: 1,
                  includes: [],
                  highlights: [],
                  vehicle: {
                    type: 'car',
                    capacity: 4,
                    name: ''
                  },
                  priceRanges: [],
                  isActive: true,
                  images: []
                });
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={newPackage.name || ''}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="input"
                  placeholder="e.g., City Heritage Tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={newPackage.destination || ''}
                  onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                  className="input"
                  placeholder="e.g., Historic City Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  value={newPackage.duration || ''}
                  onChange={(e) => setNewPackage({ ...newPackage, duration: parseInt(e.target.value) || 1 })}
                  className="input"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price *
                </label>
                <input
                  type="number"
                  value={newPackage.price || ''}
                  onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) || 0 })}
                  className="input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Participants *
                </label>
                <input
                  type="number"
                  value={newPackage.maxParticipants || ''}
                  onChange={(e) => setNewPackage({ ...newPackage, maxParticipants: parseInt(e.target.value) || 1 })}
                  className="input"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  value={newPackage.vehicle?.type || 'car'}
                  onChange={(e) => setNewPackage({ 
                    ...newPackage, 
                    vehicle: { 
                      ...newPackage.vehicle!, 
                      type: e.target.value as any 
                    } 
                  })}
                  className="input"
                >
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                  <option value="van">Van</option>
                  <option value="luxury_car">Luxury Car</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  value={newPackage.vehicle?.name || ''}
                  onChange={(e) => setNewPackage({ 
                    ...newPackage, 
                    vehicle: { 
                      ...newPackage.vehicle!, 
                      name: e.target.value 
                    } 
                  })}
                  className="input"
                  placeholder="e.g., Comfort Bus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Capacity *
                </label>
                <input
                  type="number"
                  value={newPackage.vehicle?.capacity || ''}
                  onChange={(e) => setNewPackage({ 
                    ...newPackage, 
                    vehicle: { 
                      ...newPackage.vehicle!, 
                      capacity: parseInt(e.target.value) || 4 
                    } 
                  })}
                  className="input"
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPackage.isActive !== false}
                  onChange={(e) => setNewPackage({ ...newPackage, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active Package
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newPackage.description || ''}
              onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
              className="input"
              rows={4}
              placeholder="Describe the trip package..."
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingPackage(null);
                setNewPackage({
                  name: '',
                  description: '',
                  destination: '',
                  duration: 1,
                  price: 0,
                  maxParticipants: 1,
                  includes: [],
                  highlights: [],
                  vehicle: {
                    type: 'car',
                    capacity: 4,
                    name: ''
                  },
                  priceRanges: [],
                  isActive: true,
                  images: []
                });
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPackage}
              className="btn btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'packages' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trip Packages</h3>
            <p className="text-sm text-gray-600">
              Showing {tripPackages.length} packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripPackages.map((pkg) => {
              const TripIcon = getTripIcon(pkg.destination);
              const VehicleIcon = getVehicleIcon(pkg.vehicle.type);
              
              return (
                <div key={pkg.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <TripIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                        <p className="text-sm text-gray-500">{pkg.destination}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pkg.isActive 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{pkg.duration} day{pkg.duration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Max {pkg.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <VehicleIcon className="h-4 w-4 mr-2" />
                        <span>{pkg.vehicle.name}</span>
                      </div>
                    </div>

                    <div className="text-lg font-bold text-primary-600 mb-3">
                      ${pkg.price}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="btn btn-primary text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        className={`btn text-sm ${
                          pkg.isActive ? 'btn-warning' : 'btn-success'
                        }`}
                      >
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeletePackage(pkg)}
                      className="btn btn-danger text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trip Bookings</h3>
            <p className="text-sm text-gray-600">
              Showing {tripBookings.length} bookings
            </p>
          </div>

          <div className="space-y-4">
            {tripBookings.map((booking) => {
              const packageData = tripPackages.find(p => p.id === booking.packageId);
              return (
                <div key={booking.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Navigation className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {packageData?.name || 'Unknown Package'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {packageData?.destination} • {booking.participants} participant{booking.participants > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          Trip Date: {new Date(booking.tripDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-success-100 text-success-800' :
                        booking.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${booking.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPackages;
