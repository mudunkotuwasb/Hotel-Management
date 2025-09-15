import React, { useState, useMemo } from 'react';
import { Plus, FileText, DollarSign, CreditCard, Download, Filter } from 'lucide-react';
import BillCard from '../components/Billing/BillCard';
import { mockBills, mockGuests } from '../data/mockData';
import { Bill } from '../types';

const Billing: React.FC = () => {
  const [bills] = useState<Bill[]>(mockBills);
  const [guests] = useState(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const guest = guests.find(g => g.id === bill.guestId);
      const guestName = guest ? guest.name.toLowerCase() : '';
      const matchesSearch = guestName.includes(searchTerm.toLowerCase()) ||
                           bill.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === 'today') {
        const today = new Date().toDateString();
        matchesDate = new Date(bill.createdAt).toDateString() === today;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(bill.createdAt) >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(bill.createdAt) >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bills, guests, searchTerm, statusFilter, dateFilter]);

  const getBillingStats = () => {
    const total = bills.length;
    const pending = bills.filter(b => b.status === 'pending').length;
    const paid = bills.filter(b => b.status === 'paid').length;
    const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);
    const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.total, 0);

    return { total, pending, paid, totalRevenue, pendingAmount };
  };

  const stats = getBillingStats();

  const handleViewBill = (bill: Bill) => {
    console.log('View bill:', bill);
    // In a real app, this would open a detailed bill view
  };

  const handleDownloadBill = (bill: Bill) => {
    console.log('Download bill:', bill);
    // In a real app, this would generate and download a PDF
  };

  const handleMarkPaid = (bill: Bill) => {
    console.log('Mark bill as paid:', bill);
    // In a real app, this would update the bill status
  };

  const getGuestForBill = (guestId: string) => {
    return guests.find(guest => guest.id === guestId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-1">
            Manage guest bills and payments
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Bill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Bills</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">${stats.pendingAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending Amount</div>
        </div>
      </div>

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
              placeholder="Guest name or bill ID..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bills</h3>
        <p className="text-sm text-gray-600">
          Showing {filteredBills.length} of {bills.length} bills
        </p>
      </div>

      {filteredBills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              guest={getGuestForBill(bill.guestId)}
              onView={handleViewBill}
              onDownload={handleDownloadBill}
              onMarkPaid={handleMarkPaid}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more bills.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </button>
          <button className="btn btn-secondary">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Bills
          </button>
          <button className="btn btn-secondary">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;



