import React from 'react';
import { Bill, Guest } from '../../types';
import { FileText, Download, Eye, CreditCard, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface BillCardProps {
  bill: Bill;
  guest?: Guest;
  onView?: (bill: Bill) => void;
  onDownload?: (bill: Bill) => void;
  onMarkPaid?: (bill: Bill) => void;
}

const BillCard: React.FC<BillCardProps> = ({
  bill,
  guest,
  onView,
  onDownload,
  onMarkPaid
}) => {
  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'paid':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'cancelled':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Bill['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'paid':
        return 'Paid';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return '🏨';
      case 'meal':
        return '🍽️';
      case 'service':
        return '🛎️';
      case 'other':
        return '📋';
      default:
        return '📋';
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bill #{bill.id}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {guest ? guest.name : `Guest ${bill.guestId}`}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(bill.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
            {getStatusText(bill.status)}
          </span>
          <p className="text-lg font-bold text-gray-900 mt-1">
            ${bill.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bill Items Summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
        <div className="space-y-1">
          {bill.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span>{getCategoryIcon(item.category)}</span>
                <span className="text-gray-900">{item.description}</span>
                <span className="text-gray-500">×{item.quantity}</span>
              </div>
              <span className="font-medium text-gray-900">${item.amount.toFixed(2)}</span>
            </div>
          ))}
          {bill.items.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{bill.items.length - 3} more items
            </div>
          )}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${bill.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${bill.tax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold border-t border-gray-200 pt-1">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${bill.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {onView && (
          <button
            onClick={() => onView(bill)}
            className="btn btn-secondary flex-1 text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(bill)}
            className="btn btn-secondary flex-1 text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </button>
        )}
        {bill.status === 'pending' && onMarkPaid && (
          <button
            onClick={() => onMarkPaid(bill)}
            className="btn btn-success flex-1 text-sm"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Mark Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default BillCard;



