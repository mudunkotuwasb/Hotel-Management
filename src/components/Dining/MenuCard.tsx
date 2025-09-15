import React from 'react';
import { MenuItem } from '../../types';
import { Utensils, DollarSign, Clock, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
  onToggleAvailability?: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {
  const getCategoryIcon = (category: MenuItem['category']) => {
    switch (category) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'beverage':
        return '🥤';
      case 'snack':
        return '🍿';
      default:
        return '🍽️';
    }
  };

  const getCategoryColor = (category: MenuItem['category']) => {
    switch (category) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dinner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'beverage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`card hover:shadow-md transition-shadow ${!item.available ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getCategoryIcon(item.category)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.available 
                  ? 'bg-success-100 text-success-800 border border-success-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onToggleAvailability && (
            <button
              onClick={() => onToggleAvailability(item)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title={item.available ? 'Mark as unavailable' : 'Mark as available'}
            >
              {item.available ? (
                <Eye className="h-4 w-4 text-gray-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
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

      <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Price</span>
          <span className="font-semibold text-lg text-gray-900">${item.price}</span>
        </div>
      </div>

      {item.ingredients.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Utensils className="h-4 w-4 mr-1" />
            <span>Ingredients</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCard;



