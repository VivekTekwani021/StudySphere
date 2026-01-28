import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { CalendarCheck, BookOpen, Trophy, Info } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Attendance" 
          value="--%" 
          icon={CalendarCheck} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Topics Learned" 
          value="--" 
          icon={BookOpen} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Quiz Score" 
          value="--" 
          icon={Trophy} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Status" 
          value={user?.educationLevel || 'N/A'} 
          icon={Info} 
          color="bg-green-500" 
        />
      </div>

      {/* Placeholders for recent activity or charts can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-64">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-10">
              No recent activity found.
            </div>
          </CardContent>
        </Card>

        <Card className="h-64">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-10">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
