import React from 'react';
import { InventoryItem } from '../../types';
import { Package, AlertTriangle, TrendingDown, TrendingUp, Edit, Plus, Minus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onRestock?: (item: InventoryItem) => void;
  onUpdateStock?: (item: InventoryItem, newStock: number) => void;
  onDelete?: (item: InventoryItem) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onEdit,
  onRestock,
  onUpdateStock,
  onDelete
}) => {
  const getCategoryIcon = (category: InventoryItem['category']) => {
    switch (category) {
      case 'food':
        return '🍽️';
      case 'beverage':
        return '🥤';
      case 'cleaning':
        return '🧽';
      case 'amenities':
        return '🛁';
      case 'other':
        return '📦';
      default:
        return '📦';
    }
  };

  const getCategoryColor = (category: InventoryItem['category']) => {
    switch (category) {
      case 'food':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'beverage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cleaning':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'amenities':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatus = () => {
    if (item.currentStock <= item.minStock) {
      return {
        status: 'low',
        color: 'text-danger-600',
        bgColor: 'bg-danger-50',
        borderColor: 'border-danger-200',
        icon: <AlertTriangle className="h-4 w-4" />
      };
    } else if (item.currentStock >= item.maxStock * 0.9) {
      return {
        status: 'high',
        color: 'text-success-600',
        bgColor: 'bg-success-50',
        borderColor: 'border-success-200',
        icon: <TrendingUp className="h-4 w-4" />
      };
    } else {
      return {
        status: 'normal',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: <Package className="h-4 w-4" />
      };
    }
  };

  const stockStatus = getStockStatus();
  const stockPercentage = (item.currentStock / item.maxStock) * 100;

  return (
    <div className={`card hover:shadow-md transition-shadow ${stockStatus.bgColor} ${stockStatus.borderColor} border-2`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getCategoryIcon(item.category)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} ${stockStatus.bgColor} ${stockStatus.borderColor} border`}>
                {stockStatus.icon}
                <span className="ml-1 capitalize">{stockStatus.status} stock</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Edit item"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 hover:bg-red-100 rounded-lg"
              title="Delete item"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Stock Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Current Stock</span>
          <span className="font-semibold text-lg text-gray-900">
            {item.currentStock} {item.unit}
          </span>
        </div>
        
        {/* Stock Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stockStatus.status === 'low' ? 'bg-danger-500' :
              stockStatus.status === 'high' ? 'bg-success-500' : 'bg-primary-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Min: {item.minStock}</span>
          <span>Max: {item.maxStock}</span>
        </div>
      </div>

      {/* Cost and Supplier */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Cost per unit</span>
          <span className="font-medium text-gray-900">${item.cost}</span>
        </div>
        {item.supplier && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Supplier</span>
            <span className="font-medium text-gray-900">{item.supplier}</span>
          </div>
        )}
        {item.lastRestocked && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last restocked</span>
            <span className="font-medium text-gray-900">
              {format(new Date(item.lastRestocked), 'MMM dd, yyyy')}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {onUpdateStock && (
          <>
            <button
              onClick={() => onUpdateStock(item, Math.max(0, item.currentStock - 1))}
              className="btn btn-secondary flex-1 text-sm"
            >
              <Minus className="h-4 w-4 mr-1" />
              -1
            </button>
            <button
              onClick={() => onUpdateStock(item, item.currentStock + 1)}
              className="btn btn-secondary flex-1 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              +1
            </button>
          </>
        )}
        {onRestock && (
          <button
            onClick={() => onRestock(item)}
            className="btn btn-primary flex-1 text-sm"
          >
            Restock
          </button>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;

