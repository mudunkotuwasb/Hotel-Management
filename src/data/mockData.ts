import { Room, Guest, Booking, HousekeepingTask, MenuItem, Order, InventoryItem, Bill, DashboardStats, TripPackage, TripBooking } from '../types';

export const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single',
    status: 'available',
    rate: 120,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    maxOccupancy: 1,
    floor: 1,
    needsCleaning: false,
    lastCleaned: new Date('2024-01-14')
  },
  {
    id: '2',
    number: '102',
    type: 'double',
    status: 'occupied',
    rate: 180,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
    maxOccupancy: 2,
    floor: 1,
    needsCleaning: false,
    lastCleaned: new Date('2024-01-13')
  },
  {
    id: '3',
    number: '201',
    type: 'suite',
    status: 'reserved',
    rate: 300,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi'],
    maxOccupancy: 4,
    floor: 2,
    needsCleaning: false,
    lastCleaned: new Date('2024-01-12')
  },
  {
    id: '4',
    number: '202',
    type: 'family',
    status: 'cleaning',
    rate: 250,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Kitchenette'],
    maxOccupancy: 4,
    floor: 2,
    needsCleaning: true,
    cleaningNotes: 'Deep cleaning required - guest checked out late',
    lastCleaned: new Date('2024-01-10')
  },
  {
    id: '5',
    number: '301',
    type: 'double',
    status: 'maintenance',
    rate: 180,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    maxOccupancy: 2,
    floor: 3,
    needsCleaning: false,
    lastCleaned: new Date('2024-01-11')
  }
];

export const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    nationality: 'US',
    preferences: ['Non-smoking', 'High floor'],
    bookingHistory: ['1', '2']
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0456',
    nationality: 'ES',
    preferences: ['Vegetarian meals'],
    bookingHistory: ['3']
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    guestId: '1',
    roomId: '2',
    checkIn: new Date('2024-01-15'),
    checkOut: new Date('2024-01-18'),
    status: 'checked-in',
    package: 'bed-breakfast',
    source: 'booking.com',
    totalAmount: 540,
    notes: 'Anniversary celebration',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    guestId: '2',
    roomId: '3',
    checkIn: new Date('2024-01-20'),
    checkOut: new Date('2024-01-25'),
    status: 'confirmed',
    package: 'full-board',
    source: 'direct',
    totalAmount: 1500,
    notes: 'Business trip',
    createdAt: new Date('2024-01-12')
  }
];

export const mockHousekeepingTasks: HousekeepingTask[] = [
  {
    id: '1',
    roomId: '4',
    staffId: 'staff-1',
    status: 'in-progress',
    type: 'cleaning',
    priority: 'high',
    assignedAt: new Date('2024-01-15T09:00:00'),
    notes: 'Deep cleaning required - guest checked out late'
  },
  {
    id: '2',
    roomId: '2',
    staffId: 'staff-2',
    status: 'pending',
    type: 'cleaning',
    priority: 'medium',
    assignedAt: new Date('2024-01-15T10:00:00'),
    notes: 'Standard cleaning - check-in at 3 PM'
  },
  {
    id: '3',
    roomId: '1',
    staffId: 'staff-1',
    status: 'completed',
    type: 'cleaning',
    priority: 'low',
    assignedAt: new Date('2024-01-15T08:00:00'),
    completedAt: new Date('2024-01-15T09:30:00'),
    notes: 'Quick turnover cleaning'
  },
  {
    id: '4',
    roomId: '5',
    staffId: 'staff-3',
    status: 'pending',
    type: 'maintenance',
    priority: 'high',
    assignedAt: new Date('2024-01-15T11:00:00'),
    notes: 'AC not working - guest complaint'
  },
  {
    id: '5',
    roomId: '3',
    staffId: 'staff-2',
    status: 'pending',
    type: 'inspection',
    priority: 'medium',
    assignedAt: new Date('2024-01-15T12:00:00'),
    notes: 'Pre-check-in inspection for VIP guest'
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Continental Breakfast',
    description: 'Fresh pastries, fruits, coffee, and juice',
    price: 15,
    category: 'breakfast',
    available: true,
    ingredients: ['Pastries', 'Fruits', 'Coffee', 'Juice']
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon',
    price: 28,
    category: 'dinner',
    available: true,
    ingredients: ['Salmon', 'Herbs', 'Lemon', 'Olive Oil']
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    roomId: '2',
    items: [
      { menuItemId: '1', quantity: 2 },
      { menuItemId: '2', quantity: 1 }
    ],
    status: 'preparing',
    totalAmount: 58,
    orderTime: new Date('2024-01-15T08:30:00'),
    notes: 'Room service'
  }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Coffee Beans',
    category: 'food',
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unit: 'kg',
    cost: 15,
    supplier: 'Coffee Supply Co.',
    lastRestocked: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Towels',
    category: 'amenities',
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    unit: 'pieces',
    cost: 8,
    supplier: 'Hotel Supplies Inc.',
    lastRestocked: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Bath Soap',
    category: 'amenities',
    currentStock: 8,
    minStock: 20,
    maxStock: 80,
    unit: 'pieces',
    cost: 2.5,
    supplier: 'Hotel Supplies Inc.',
    lastRestocked: new Date('2024-01-08')
  },
  {
    id: '4',
    name: 'Toilet Paper',
    category: 'amenities',
    currentStock: 12,
    minStock: 25,
    maxStock: 100,
    unit: 'rolls',
    cost: 1.2,
    supplier: 'Hotel Supplies Inc.',
    lastRestocked: new Date('2024-01-05')
  },
  {
    id: '5',
    name: 'Cleaning Spray',
    category: 'cleaning',
    currentStock: 3,
    minStock: 8,
    maxStock: 30,
    unit: 'bottles',
    cost: 4.5,
    supplier: 'Cleaning Solutions Ltd.',
    lastRestocked: new Date('2024-01-03')
  },
  {
    id: '6',
    name: 'Fresh Milk',
    category: 'food',
    currentStock: 15,
    minStock: 20,
    maxStock: 50,
    unit: 'liters',
    cost: 3.2,
    supplier: 'Dairy Fresh Co.',
    lastRestocked: new Date('2024-01-14')
  },
  {
    id: '7',
    name: 'Bread',
    category: 'food',
    currentStock: 6,
    minStock: 10,
    maxStock: 25,
    unit: 'loaves',
    cost: 2.8,
    supplier: 'Bakery Direct',
    lastRestocked: new Date('2024-01-14')
  },
  {
    id: '8',
    name: 'Orange Juice',
    category: 'beverage',
    currentStock: 4,
    minStock: 12,
    maxStock: 40,
    unit: 'liters',
    cost: 5.5,
    supplier: 'Beverage Co.',
    lastRestocked: new Date('2024-01-11')
  }
];

export const mockBills: Bill[] = [
  {
    id: '1',
    bookingId: '1',
    guestId: '1',
    items: [
      { description: 'Room 102 (3 nights)', quantity: 3, rate: 180, amount: 540, category: 'room' },
      { description: 'Breakfast package', quantity: 3, rate: 15, amount: 45, category: 'meal' }
    ],
    subtotal: 585,
    tax: 58.5,
    total: 643.5,
    status: 'pending',
    createdAt: new Date('2024-01-15')
  }
];

export const mockTripPackages: TripPackage[] = [
  {
    id: '1',
    name: 'City Heritage Tour',
    description: 'Explore the rich history and culture of our beautiful city with a guided tour through historic landmarks, museums, and local markets.',
    destination: 'Historic City Center',
    duration: 1,
    price: 75,
    maxParticipants: 15,
    includes: ['Professional guide', 'Entrance fees', 'Transportation', 'Lunch'],
    highlights: ['Ancient Cathedral', 'Historic Market', 'Museum of Art', 'Local Crafts'],
    vehicle: {
      type: 'bus',
      capacity: 15,
      name: 'Comfort Bus'
    },
    priceRanges: [
      { min: 50, max: 75, description: 'Standard Package' },
      { min: 75, max: 100, description: 'Premium Package with Lunch' },
      { min: 100, max: 150, description: 'VIP Package with Private Guide' }
    ],
    isActive: true,
    images: ['/images/city-tour-1.jpg', '/images/city-tour-2.jpg'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Mountain Adventure',
    description: 'Experience breathtaking mountain views and fresh air with our guided hiking tour through scenic trails and natural wonders.',
    destination: 'Blue Mountain Range',
    duration: 2,
    price: 120,
    maxParticipants: 8,
    includes: ['Expert guide', 'Hiking equipment', 'Mountain lunch', 'Photography session'],
    highlights: ['Summit Viewpoint', 'Waterfall Trail', 'Wildlife Spotting', 'Sunset Photography'],
    vehicle: {
      type: 'van',
      capacity: 8,
      name: 'Adventure Van'
    },
    priceRanges: [
      { min: 80, max: 120, description: 'Day Trip Package' },
      { min: 120, max: 180, description: 'Overnight Package' },
      { min: 180, max: 250, description: 'Luxury Mountain Lodge Package' }
    ],
    isActive: true,
    images: ['/images/mountain-1.jpg', '/images/mountain-2.jpg'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Coastal Paradise',
    description: 'Relax and unwind at pristine beaches with crystal clear waters, perfect for swimming, snorkeling, and beach activities.',
    destination: 'Golden Coast',
    duration: 1,
    price: 90,
    maxParticipants: 12,
    includes: ['Beach equipment', 'Snorkeling gear', 'Beach lunch', 'Water activities'],
    highlights: ['Private Beach Access', 'Snorkeling Spots', 'Beach Volleyball', 'Sunset Views'],
    vehicle: {
      type: 'luxury_car',
      capacity: 4,
      name: 'Luxury Sedan'
    },
    priceRanges: [
      { min: 60, max: 90, description: 'Beach Day Package' },
      { min: 90, max: 130, description: 'Water Sports Package' },
      { min: 130, max: 200, description: 'Private Beach Experience' }
    ],
    isActive: true,
    images: ['/images/beach-1.jpg', '/images/beach-2.jpg'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockTripBookings: TripBooking[] = [
  {
    id: '1',
    packageId: '1',
    guestId: '1',
    bookingDate: new Date('2024-01-15'),
    tripDate: new Date('2024-01-20'),
    participants: 2,
    totalPrice: 150,
    status: 'confirmed',
    specialRequests: 'Vegetarian lunch please',
    vehiclePreference: 'bus',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    packageId: '2',
    guestId: '2',
    bookingDate: new Date('2024-01-16'),
    tripDate: new Date('2024-01-22'),
    participants: 1,
    totalPrice: 120,
    status: 'pending',
    createdAt: new Date('2024-01-16')
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRooms: 20,
  availableRooms: 12,
  occupiedRooms: 5,
  cleaningRooms: 2,
  todayCheckIns: 3,
  todayCheckOuts: 2,
  todayOrders: 8,
  lowStockItems: 3,
  occupancyRate: 75,
  revenue: 12500
};

