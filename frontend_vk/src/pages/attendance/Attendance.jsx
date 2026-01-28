import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SchoolAttendance from './SchoolAttendance';
import CollegeAttendance from './CollegeAttendance';
import { Calendar } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const isCollege = user?.educationLevel === 'College';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Calendar size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Tracker</h1>
            <p className="text-gray-500">Manage your {isCollege ? 'subject-wise' : 'daily'} attendance</p>
        </div>
      </div>

      {isCollege ? <CollegeAttendance /> : <SchoolAttendance />}
    </div>
  );
};

export default Attendance;
