import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, Bed } from 'lucide-react';
import ChartCard from '../components/Dashboard/ChartCard';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for reports
  const occupancyData = [
    { name: 'Jan', occupancy: 65, revenue: 12000 },
    { name: 'Feb', occupancy: 70, revenue: 15000 },
    { name: 'Mar', occupancy: 80, revenue: 18000 },
    { name: 'Apr', occupancy: 75, revenue: 16000 },
    { name: 'May', occupancy: 85, revenue: 20000 },
    { name: 'Jun', occupancy: 90, revenue: 22000 },
    { name: 'Jul', occupancy: 95, revenue: 25000 },
    { name: 'Aug', occupancy: 88, revenue: 23000 },
    { name: 'Sep', occupancy: 82, revenue: 19000 },
    { name: 'Oct', occupancy: 78, revenue: 17000 },
    { name: 'Nov', occupancy: 72, revenue: 14000 },
    { name: 'Dec', occupancy: 68, revenue: 13000 }
  ];

  const roomTypeData = [
    { name: 'Single', value: 8, revenue: 9600 },
    { name: 'Double', value: 12, revenue: 21600 },
    { name: 'Suite', value: 3, revenue: 9000 },
    { name: 'Family', value: 2, revenue: 5000 }
  ];

  const revenueSources = [
    { name: 'Room Revenue', value: 45200, percentage: 70 },
    { name: 'Food & Beverage', value: 12914, percentage: 20 },
    { name: 'Services', value: 6457, percentage: 10 }
  ];

  const dailyOccupancy = [
    { day: 'Mon', occupancy: 75 },
    { day: 'Tue', occupancy: 80 },
    { day: 'Wed', occupancy: 85 },
    { day: 'Thu', occupancy: 90 },
    { day: 'Fri', occupancy: 95 },
    { day: 'Sat', occupancy: 100 },
    { day: 'Sun', occupancy: 70 }
  ];

  const guestSatisfaction = [
    { month: 'Jan', rating: 4.2 },
    { month: 'Feb', rating: 4.3 },
    { month: 'Mar', rating: 4.5 },
    { month: 'Apr', rating: 4.4 },
    { month: 'May', rating: 4.6 },
    { month: 'Jun', rating: 4.7 }
  ];

  const getKeyMetrics = () => {
    const currentMonth = occupancyData[occupancyData.length - 1];
    const previousMonth = occupancyData[occupancyData.length - 2];
    
    return {
      occupancyRate: currentMonth.occupancy,
      occupancyChange: ((currentMonth.occupancy - previousMonth.occupancy) / previousMonth.occupancy * 100).toFixed(1),
      revenue: currentMonth.revenue,
      revenueChange: ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1),
      totalRooms: roomTypeData.reduce((sum, room) => sum + room.value, 0),
      avgRating: guestSatisfaction[guestSatisfaction.length - 1].rating
    };
  };

  const metrics = getKeyMetrics();

  const handleExportReport = (type: string) => {
    console.log(`Exporting ${type} report`);
    // In a real app, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Hotel performance insights and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Bed className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.occupancyRate}%</div>
          <div className="text-sm text-gray-600">Occupancy Rate</div>
          <div className={`text-xs mt-1 ${parseFloat(metrics.occupancyChange) >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {parseFloat(metrics.occupancyChange) >= 0 ? '+' : ''}{metrics.occupancyChange}% vs last month
          </div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-6 w-6 text-success-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${metrics.revenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
          <div className={`text-xs mt-1 ${parseFloat(metrics.revenueChange) >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {parseFloat(metrics.revenueChange) >= 0 ? '+' : ''}{metrics.revenueChange}% vs last month
          </div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-warning-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.totalRooms}</div>
          <div className="text-sm text-gray-600">Total Rooms</div>
          <div className="text-xs text-gray-500 mt-1">Available inventory</div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.avgRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
          <div className="text-xs text-gray-500 mt-1">Guest satisfaction</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Occupancy & Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="occupancy" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Occupancy Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupancy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Satisfaction Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={guestSatisfaction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenueSources.map((source, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${source.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-2">{source.name}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-success-500' : 'bg-warning-500'
                  }`}
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{source.percentage}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExportReport('occupancy')}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Occupancy Report
          </button>
          <button
            onClick={() => handleExportReport('revenue')}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Revenue Report
          </button>
          <button
            onClick={() => handleExportReport('guest')}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Guest Report
          </button>
          <button
            onClick={() => handleExportReport('financial')}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Financial Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;



