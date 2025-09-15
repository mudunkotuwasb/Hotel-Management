import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown, Filter, Save, X } from 'lucide-react';
import InventoryCard from '../components/Inventory/InventoryCard';
import { mockInventoryItems } from '../data/mockData';
import { InventoryItem } from '../types';
import toast from 'react-hot-toast';

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('hotel_inventory');
    return saved ? JSON.parse(saved) : mockInventoryItems;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'food',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'pieces',
    cost: 0,
    supplier: ''
  });

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = item.currentStock <= item.minStock;
      } else if (stockFilter === 'normal') {
        matchesStock = item.currentStock > item.minStock && item.currentStock < item.maxStock * 0.9;
      } else if (stockFilter === 'high') {
        matchesStock = item.currentStock >= item.maxStock * 0.9;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [inventoryItems, searchTerm, categoryFilter, stockFilter]);

  const getInventoryStats = () => {
    const total = inventoryItems.length;
    const lowStock = inventoryItems.filter(item => item.currentStock <= item.minStock).length;
    const highStock = inventoryItems.filter(item => item.currentStock >= item.maxStock * 0.9).length;
    const categories = Array.from(new Set(inventoryItems.map(item => item.category))).length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

    return { total, lowStock, highStock, categories, totalValue };
  };

  const stats = getInventoryStats();

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('hotel_inventory', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  const handleRestockItem = (item: InventoryItem) => {
    const newStock = item.maxStock;
    const updatedItems = inventoryItems.map(i => 
      i.id === item.id 
        ? { ...i, currentStock: newStock, lastRestocked: new Date() }
        : i
    );
    setInventoryItems(updatedItems);
    toast.success(`${item.name} restocked to ${newStock} ${item.unit}`);
  };

  const handleUpdateStock = (item: InventoryItem, newStock: number) => {
    const updatedItems = inventoryItems.map(i => 
      i.id === item.id 
        ? { ...i, currentStock: Math.max(0, newStock) }
        : i
    );
    setInventoryItems(updatedItems);
    toast.success(`${item.name} stock updated to ${Math.max(0, newStock)} ${item.unit}`);
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.currentStock === undefined || newItem.minStock === undefined || newItem.maxStock === undefined) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      name: newItem.name,
      category: newItem.category as InventoryItem['category'],
      currentStock: newItem.currentStock,
      minStock: newItem.minStock,
      maxStock: newItem.maxStock,
      unit: newItem.unit || 'pieces',
      cost: newItem.cost || 0,
      supplier: newItem.supplier,
      lastRestocked: new Date()
    };

    if (editingItem) {
      const updatedItems = inventoryItems.map(i => i.id === editingItem.id ? item : i);
      setInventoryItems(updatedItems);
      toast.success(`${item.name} updated successfully`);
    } else {
      setInventoryItems([...inventoryItems, item]);
      toast.success(`${item.name} added successfully`);
    }

    setShowAddForm(false);
    setEditingItem(null);
    setNewItem({
      name: '',
      category: 'food',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'pieces',
      cost: 0,
      supplier: ''
    });
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      const updatedItems = inventoryItems.filter(i => i.id !== item.id);
      setInventoryItems(updatedItems);
      toast.success(`${item.name} deleted successfully`);
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'amenities', label: 'Amenities' },
    { value: 'other', label: 'Other' }
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'low', label: 'Low Stock' },
    { value: 'normal', label: 'Normal Stock' },
    { value: 'high', label: 'High Stock' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage hotel inventory items
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{stats.lowStock}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.highStock}</div>
          <div className="text-sm text-gray-600">High Stock</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.categories}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">${stats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <div className="card bg-danger-50 border-danger-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-danger-600" />
            <div>
              <h3 className="text-lg font-semibold text-danger-800">Low Stock Alert</h3>
              <p className="text-danger-700">
                {stats.lowStock} item{stats.lowStock !== 1 ? 's' : ''} {stats.lowStock !== 1 ? 'are' : 'is'} running low on stock and need{stats.lowStock === 1 ? 's' : ''} to be restocked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Item name or supplier..."
              className="input"
            />
          </div>

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
              Stock Level
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="input"
            >
              {stockOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                setNewItem({
                  name: '',
                  category: 'food',
                  currentStock: 0,
                  minStock: 0,
                  maxStock: 0,
                  unit: 'pieces',
                  cost: 0,
                  supplier: ''
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
                Item Name *
              </label>
              <input
                type="text"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="input"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={newItem.category || 'food'}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as InventoryItem['category'] })}
                className="input"
              >
                <option value="food">Food</option>
                <option value="beverage">Beverage</option>
                <option value="cleaning">Cleaning</option>
                <option value="amenities">Amenities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <input
                type="text"
                value={newItem.unit || ''}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="input"
                placeholder="e.g., pieces, kg, liters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock *
              </label>
              <input
                type="number"
                value={newItem.currentStock || ''}
                onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock *
              </label>
              <input
                type="number"
                value={newItem.minStock || ''}
                onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Stock *
              </label>
              <input
                type="number"
                value={newItem.maxStock || ''}
                onChange={(e) => setNewItem({ ...newItem, maxStock: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost per Unit
              </label>
              <input
                type="number"
                value={newItem.cost || ''}
                onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) || 0 })}
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={newItem.supplier || ''}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                className="input"
                placeholder="Enter supplier name"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddItem}
                className="btn btn-primary w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} of {inventoryItems.length} items
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onRestock={handleRestockItem}
              onUpdateStock={handleUpdateStock}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more items.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </button>
          <button className="btn btn-secondary">
            <Package className="h-4 w-4 mr-2" />
            Bulk Restock
          </button>
          <button className="btn btn-secondary">
            <TrendingUp className="h-4 w-4 mr-2" />
            Stock Report
          </button>
          <button className="btn btn-secondary">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Low Stock Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
