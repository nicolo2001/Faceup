import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Clock, DollarSign, Video, Calendar, Settings,
  ChevronRight, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - would come from API in production
  const stats = {
    totalRevenue: 12580,
    totalOrders: 156,
    avgResponseTime: '2.5 hours',
    completionRate: 98,
    activeOrders: 5,
    pendingReviews: 3
  };

  const recentOrders = [
    {
      id: '1',
      clientName: 'Tech Solutions Inc.',
      projectTitle: 'Product Demo Video',
      status: 'in-progress',
      dueDate: '2024-03-20',
      price: 250
    },
    {
      id: '2',
      clientName: 'Marketing Pro',
      projectTitle: 'Corporate Explainer',
      status: 'pending',
      dueDate: '2024-03-22',
      price: 350
    },
    {
      id: '3',
      clientName: 'StartupX',
      projectTitle: 'App Tutorial',
      status: 'completed',
      dueDate: '2024-03-18',
      price: 200
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Emma Johnson</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/actor/calendar')}
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Manage Calendar
              </Button>
              <Button
                onClick={() => navigate('/actor/profile')}
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalOrders}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg. Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.avgResponseTime}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completionRate}%
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/actor/orders')}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/actor/orders/${order.id}`)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{order.projectTitle}</h3>
                          <p className="text-sm text-gray-600">{order.clientName}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(order.status)}
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${order.price}</p>
                            <p className="text-sm text-gray-500">Due {new Date(order.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      className="justify-start"
                      leftIcon={<AlertCircle className="h-4 w-4 text-amber-500" />}
                    >
                      <span className="flex-1 text-left">
                        {stats.activeOrders} Active Orders
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      className="justify-start"
                      leftIcon={<CheckCircle className="h-4 w-4 text-green-500" />}
                    >
                      <span className="flex-1 text-left">
                        {stats.pendingReviews} Reviews Pending
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      className="justify-start"
                      leftIcon={<XCircle className="h-4 w-4 text-red-500" />}
                    >
                      <span className="flex-1 text-left">
                        0 Overdue Orders
                      </span>
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Availability */}
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/actor/calendar')}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="success">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Working Hours</span>
                      <span className="font-medium">9 AM - 6 PM EST</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Available</span>
                      <span className="font-medium">Tomorrow</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;