import React, { useState, useEffect } from 'react';
import { placementApi } from '../../api/placement.api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Briefcase, Building, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Placement = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isPlacementEnabled) {
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const response = await placementApi.getAll();
      if (response.success) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      const response = await placementApi.apply(id);
      if (response.success) {
        toast.success('Applied successfully!');
        // Update local state to show 'Applied'
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (!user?.isPlacementEnabled) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Placement Opportunities</h1>
        <p className="text-gray-500">Kickstart your career with these openings</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading opportunities...</p>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No open positions at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {job.type || 'Full Time'}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location || 'Remote'}
                  </div>
                  <div>₹ {job.salary || 'Not disclosed'}</div>
                </div>

                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => handleApply(job._id)}
                    disabled={job.applied} // Assuming api returns if applied
                  >
                    {job.applied ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Placement;
