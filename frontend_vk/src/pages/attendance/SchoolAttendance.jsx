import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SchoolAttendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await attendanceApi.getHistory(); // Assuming returns { success, data: [...] }
      if (response.success) {
        setHistory(response.data);
        // Check if marked for today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = response.data.find(r => r.date.startsWith(todayStr));
        if (todayRecord) {
          setTodayStatus(todayRecord.status);
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMark = async (status) => {
    try {
      console.log(status);
      const response = await attendanceApi.markSchoolDaily(status);
      if (response.success) {
        toast.success(`Marked as ${status}`);
        setTodayStatus(status);
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance</CardTitle>
          <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </CardHeader>
        <CardContent>
          {todayStatus ? (
            <div className={`p-4 rounded-lg flex items-center justify-center space-x-2 ${todayStatus === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {todayStatus === 'Present' ? <CheckCircle /> : <XCircle />}
              <span className="font-semibold">Marked {todayStatus}</span>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Button 
                onClick={() => handleMark('Present')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Mark Present
              </Button>
              <Button 
                onClick={() => handleMark('Absent')}
                variant="danger"
                className="flex-1"
              >
                Mark Absent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">No records found.</p>
          ) : (
            <div className="space-y-2">
              {history.map((record) => (
                <div key={record._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                  <span className={`px-2 py-1 rounded text-sm ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolAttendance;
