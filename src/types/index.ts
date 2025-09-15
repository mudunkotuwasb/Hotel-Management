export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'housekeeping' | 'kitchen';
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'family';
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
  rate: number;
  amenities: string[];
  maxOccupancy: number;
  floor: number;
  needsCleaning?: boolean;
  cleaningNotes?: string;
  lastCleaned?: Date;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  preferences?: string[];
  bookingHistory: string[];
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  package: 'room-only' | 'bed-breakfast' | 'half-board' | 'full-board';
  source: 'direct' | 'booking.com' | 'tripadvisor' | 'expedia' | 'phone' | 'walk-in';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  staffId: string;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'cleaning' | 'maintenance' | 'inspection';
  priority: 'low' | 'medium' | 'high';
  assignedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'beverage' | 'snack';
  available: boolean;
  ingredients: string[];
}

export interface Order {
  id: string;
  roomId?: string;
  tableNumber?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  totalAmount: number;
  orderTime: Date;
  estimatedTime?: Date;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'beverage' | 'cleaning' | 'amenities' | 'other';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  supplier?: string;
  lastRestocked?: Date;
}

export interface Bill {
  id: string;
  bookingId: string;
  guestId: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}

export interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: 'room' | 'meal' | 'service' | 'other';
}

export interface TripPackage {
  id: string;
  name: string;
  description: string;
  destination: string;
  duration: number; // in days
  price: number;
  maxParticipants: number;
  includes: string[];
  highlights: string[];
  vehicle: {
    type: 'car' | 'bus' | 'van' | 'luxury_car';
    capacity: number;
    name: string;
  };
  priceRanges: {
    min: number;
    max: number;
    description: string;
  }[];
  isActive: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripBooking {
  id: string;
  packageId: string;
  guestId: string;
  bookingDate: Date;
  tripDate: Date;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
  vehiclePreference?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  todayOrders: number;
  lowStockItems: number;
  occupancyRate: number;
  revenue: number;
}

