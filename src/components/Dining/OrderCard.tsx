import React from 'react';
import { Order, MenuItem } from '../../types';
import { Clock, User, Bed, Utensils, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
  menuItems: MenuItem[];
  onStatusChange?: (orderId: string, status: Order['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  menuItems,
  onStatusChange
}) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'preparing':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'ready':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'served':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'served':
        return 'Served';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <AlertCircle className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'served':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMenuItemName = (menuItemId: string) => {
    const item = menuItems.find(m => m.id === menuItemId);
    return item ? item.name : 'Unknown Item';
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'served';
      default:
        return null;
    }
  };

  const getNextStatusText = (currentStatus: Order['status']) => {
    const nextStatus = getNextStatus(currentStatus);
    switch (nextStatus) {
      case 'preparing':
        return 'Start Preparing';
      case 'ready':
        return 'Mark Ready';
      case 'served':
        return 'Mark Served';
      default:
        return null;
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Utensils className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              {order.roomId && (
                <div className="flex items-center text-sm text-gray-500">
                  <Bed className="h-4 w-4 mr-1" />
                  Room {order.roomId}
                </div>
              )}
              {order.tableNumber && (
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  Table {order.tableNumber}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{getStatusText(order.status)}</span>
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(order.orderTime), 'HH:mm')}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">×{item.quantity}</span>
                <span className="text-gray-900">{getMenuItemName(item.menuItemId)}</span>
                {item.specialInstructions && (
                  <span className="text-xs text-gray-500 italic">
                    ({item.specialInstructions})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Notes:</strong> {order.notes}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Total: ${order.totalAmount}
        </div>
        {getNextStatus(order.status) && onStatusChange && (
          <button
            onClick={() => onStatusChange(order.id, getNextStatus(order.status)!)}
            className="btn btn-primary text-sm"
          >
            {getNextStatusText(order.status)}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;



