import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign, trend: 'up' },
    { name: 'Inventory Value', value: '$234,567', change: '+15.3%', icon: Package, trend: 'up' },
    { name: 'Active Orders', value: '234', change: '-2.4%', icon: ShoppingCart, trend: 'down' },
    { name: 'Total Employees', value: '156', change: '+5.2%', icon: Users, trend: 'up' },
  ];

  const recentActivities = [
    { id: 1, type: 'order', description: 'New order #1234 received', time: '2 minutes ago' },
    { id: 2, type: 'payment', description: 'Payment received from ABC Corp', time: '15 minutes ago' },
    { id: 3, type: 'inventory', description: 'Stock alert: Widget A low on stock', time: '1 hour ago' },
    { id: 4, type: 'hr', description: 'New employee request submitted', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your ERP dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Icon className={`h-6 w-6 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendIcon className={`h-4 w-4 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Create Invoice</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Package className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">New Order</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Employee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
