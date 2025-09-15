import React from 'react';
import { 
  Bed, 
  Users, 
  Calendar, 
  Utensils, 
  Package, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Eye
} from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import ChartCard from '../components/Dashboard/ChartCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { mockDashboardStats } from '../data/mockData';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  // Mock chart data
  const occupancyData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 70 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 75 },
    { name: 'Fri', value: 85 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 70 }
  ];

  const roomStatusData = [
    { name: 'Available', value: stats.availableRooms },
    { name: 'Occupied', value: stats.occupiedRooms },
    { name: 'Cleaning', value: stats.cleaningRooms },
    { name: 'Maintenance', value: 1 }
  ];

  const revenueData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 16000 },
    { name: 'May', value: 20000 },
    { name: 'Jun', value: 22000 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Grand Hotel</h1>
            <p className="text-primary-100 text-lg">Here's what's happening today</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bed className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle="Hotel capacity"
          icon={Bed}
          color="primary"
        />
        <StatsCard
          title="Available Rooms"
          value={stats.availableRooms}
          subtitle={`${stats.occupancyRate}% occupied`}
          change="+5% from yesterday"
          changeType="positive"
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Today's Check-ins"
          value={stats.todayCheckIns}
          subtitle="Guests arriving"
          icon={Users}
          color="warning"
        />
        <StatsCard
          title="Today's Orders"
          value={stats.todayOrders}
          subtitle="Meal orders"
          change="+3 from yesterday"
          changeType="positive"
          icon={Utensils}
          color="teal"
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          subtitle="Currently in use"
          icon={Bed}
          color="danger"
        />
        <StatsCard
          title="Needs Cleaning"
          value={stats.cleaningRooms}
          subtitle="Housekeeping tasks"
          icon={AlertTriangle}
          color="warning"
        />
        <StatsCard
          title="Low Stock Alert"
          value={stats.lowStockItems}
          subtitle="Items to reorder"
          icon={Package}
          color="danger"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          subtitle="This month"
          change="+12% from last month"
          changeType="positive"
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Weekly Occupancy Rate"
            type="bar"
            data={occupancyData}
            dataKey="value"
            nameKey="name"
          />
        </div>
        <RecentActivity />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Room Status Distribution"
          type="pie"
          data={roomStatusData}
          dataKey="value"
          nameKey="name"
        />
        <ChartCard
          title="Monthly Revenue Trend"
          type="bar"
          data={revenueData}
          dataKey="value"
          nameKey="name"
        />
      </div>

      {/* Quick Actions */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-navy-900">Quick Actions</h3>
          <div className="flex items-center space-x-2 text-sm text-navy-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary group">
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
            New Booking
          </button>
          <button className="btn btn-teal group">
            <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Check-in
          </button>
          <button className="btn btn-warning group">
            <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Room Management
          </button>
          <button className="btn btn-success group">
            <Utensils className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
