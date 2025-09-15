import React, { useState, useMemo } from 'react';
import { Plus, Utensils, Clock, CheckCircle, AlertTriangle, Filter, Save, X, User } from 'lucide-react';
import MenuCard from '../components/Dining/MenuCard';
import OrderCard from '../components/Dining/OrderCard';
import { mockMenuItems, mockOrders, mockRooms } from '../data/mockData';
import { MenuItem, Order, Room } from '../types';
import toast from 'react-hot-toast';

const Dining: React.FC = () => {
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [rooms] = useState<Room[]>(mockRooms);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'manual-order'>('orders');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [showManualOrderForm, setShowManualOrderForm] = useState(false);
  const [manualOrder, setManualOrder] = useState({
    roomId: '',
    tableNumber: '',
    guestName: '',
    items: [] as { menuItemId: string; quantity: number; specialInstructions?: string }[],
    notes: ''
  });

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && item.available) ||
        (availabilityFilter === 'unavailable' && !item.available);

      return matchesCategory && matchesAvailability;
    });
  }, [menuItems, categoryFilter, availabilityFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      return matchesStatus;
    });
  }, [orders, orderStatusFilter]);

  const getMenuStats = () => {
    const total = menuItems.length;
    const available = menuItems.filter(item => item.available).length;
    const unavailable = total - available;
    const categories = Array.from(new Set(menuItems.map(item => item.category))).length;

    return { total, available, unavailable, categories };
  };

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const served = orders.filter(o => o.status === 'served').length;

    return { pending, preparing, ready, served };
  };

  const menuStats = getMenuStats();
  const orderStats = getOrderStats();

  const handleEditMenuItem = (item: MenuItem) => {
    console.log('Edit menu item:', item);
    // In a real app, this would open an edit form
  };

  const handleDeleteMenuItem = (item: MenuItem) => {
    console.log('Delete menu item:', item);
    // In a real app, this would show a confirmation dialog
  };

  const handleToggleAvailability = (item: MenuItem) => {
    console.log('Toggle availability for:', item);
    // In a real app, this would make an API call
  };

  const handleOrderStatusChange = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    toast.success(`Order status updated to ${status}`);
  };

  const handleAddItemToOrder = (menuItemId: string) => {
    const existingItem = manualOrder.items.find(item => item.menuItemId === menuItemId);
    if (existingItem) {
      setManualOrder({
        ...manualOrder,
        items: manualOrder.items.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setManualOrder({
        ...manualOrder,
        items: [...manualOrder.items, { menuItemId, quantity: 1 }]
      });
    }
  };

  const handleRemoveItemFromOrder = (menuItemId: string) => {
    setManualOrder({
      ...manualOrder,
      items: manualOrder.items.filter(item => item.menuItemId !== menuItemId)
    });
  };

  const handleUpdateItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItemFromOrder(menuItemId);
      return;
    }
    setManualOrder({
      ...manualOrder,
      items: manualOrder.items.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    });
  };

  const handleCreateManualOrder = () => {
    if (!manualOrder.guestName || manualOrder.items.length === 0) {
      toast.error('Please provide guest name and select at least one item');
      return;
    }

    const totalAmount = manualOrder.items.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      roomId: manualOrder.roomId || undefined,
      tableNumber: manualOrder.tableNumber || undefined,
      items: manualOrder.items,
      status: 'pending',
      totalAmount,
      orderTime: new Date(),
      notes: manualOrder.notes
    };

    setOrders([...orders, newOrder]);
    toast.success('Manual order created successfully');
    
    setManualOrder({
      roomId: '',
      tableNumber: '',
      guestName: '',
      items: [],
      notes: ''
    });
    setShowManualOrderForm(false);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'snack', label: 'Snack' }
  ];

  const orderStatusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'served', label: 'Served' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dining & Menu</h1>
          <p className="text-gray-600 mt-1">
            Manage menu items and track food orders
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manual-order')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manual-order'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Manual Order</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menu'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>Menu ({menuItems.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Stats */}
      {activeTab === 'orders' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning-600">{orderStats.pending}</div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{orderStats.preparing}</div>
            <div className="text-sm text-gray-600">Preparing</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{orderStats.ready}</div>
            <div className="text-sm text-gray-600">Ready</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{orderStats.served}</div>
            <div className="text-sm text-gray-600">Served</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{menuStats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{menuStats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{menuStats.unavailable}</div>
            <div className="text-sm text-gray-600">Unavailable</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{menuStats.categories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        {activeTab === 'orders' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="input"
              >
                {orderStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setOrderStatusFilter('all')}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Items</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setAvailabilityFilter('all');
                }}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'manual-order' ? (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Manual Order</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    value={manualOrder.guestName}
                    onChange={(e) => setManualOrder({ ...manualOrder, guestName: e.target.value })}
                    className="input"
                    placeholder="Enter guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <select
                    value={manualOrder.roomId}
                    onChange={(e) => setManualOrder({ ...manualOrder, roomId: e.target.value })}
                    className="input"
                  >
                    <option value="">Select room (optional)</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} - {room.type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={manualOrder.tableNumber}
                    onChange={(e) => setManualOrder({ ...manualOrder, tableNumber: e.target.value })}
                    className="input"
                    placeholder="Enter table number (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    value={manualOrder.notes}
                    onChange={(e) => setManualOrder({ ...manualOrder, notes: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Menu Items
                  </label>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {menuItems.filter(item => item.available).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">${item.price}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddItemToOrder(item.id)}
                            className="btn btn-primary text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            {manualOrder.items.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  {manualOrder.items.map((item) => {
                    const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                    return (
                      <div key={item.menuItemId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{menuItem?.name}</span>
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${(menuItem?.price || 0) * item.quantity}</span>
                          <button
                            onClick={() => handleRemoveItemFromOrder(item.menuItemId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${manualOrder.items.reduce((total, item) => {
                      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                      return total + (menuItem?.price || 0) * item.quantity;
                    }, 0)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setManualOrder({
                    roomId: '',
                    tableNumber: '',
                    guestName: '',
                    items: [],
                    notes: ''
                  });
                  setShowManualOrderForm(false);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManualOrder}
                className="btn btn-primary"
                disabled={manualOrder.items.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Create Order
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  menuItems={menuItems}
                  onStatusChange={handleOrderStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more orders.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
            <p className="text-sm text-gray-600">
              Showing {filteredMenuItems.length} of {menuItems.length} items
            </p>
          </div>

          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditMenuItem}
                  onDelete={handleDeleteMenuItem}
                  onToggleAvailability={handleToggleAvailability}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more items.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dining;
