import React, { useState, useEffect } from 'react';
import { applicationApi, activityApi } from '../../api/placement.api';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  Plus,
  FileText,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Trash2,
  TrendingUp,
  MoreHorizontal,
  Search,
  Building2
} from 'lucide-react';
import Button from '../../components/common/Button';

const Placement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user?.educationLevel === 'College') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, activitiesRes] = await Promise.all([
        applicationApi.getMyApplications(),
        activityApi.getAll()
      ]);

      if (appsRes.success) setApplications(appsRes.data);
      if (activitiesRes.success) setActivities(activitiesRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.educationLevel !== 'College') {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">
          Career Catalyst
        </h1>
        <p className="text-gray-500 text-sm">
          Track your placement journey and stay updated with activities
        </p>
      </div>

      {/* AI Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link to="/placement/resume" className="group">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-orange-500/30 transition-all relative overflow-hidden group-hover:bg-[#141414]">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Sparkles className="w-12 h-12 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl border border-orange-500/20">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Resume Scorer</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              Get AI-powered feedback to improve your resume and stand out to recruiters.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-orange-400">
              <Sparkles className="w-3 h-3" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1F1F1F]">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'applications'
                ? 'text-orange-500'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Application Tracking
            </div>
            {activeTab === 'applications' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'activities'
                ? 'text-orange-500'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Activities & Timeline
            </div>
            {activeTab === 'activities' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === 'applications' && (
            <ApplicationsTab
              applications={filteredApplications}
              loading={loading}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              setShowAddModal={setShowAddModal}
              fetchData={fetchData}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesTab
              activities={activities}
              loading={loading}
              fetchData={fetchData}
              user={user}
            />
          )}
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

// Sub-components

const ApplicationsTab = ({ applications, loading, filterStatus, setFilterStatus, setShowAddModal, fetchData }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationApi.delete(id);
      toast.success('Application deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await applicationApi.update(id, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = {
    'Applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Test Scheduled': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Test Completed': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Interview Scheduled': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Interview Completed': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Selected': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 appearance-none min-w-[180px]"
            >
              <option value="all">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Test Scheduled">Test Scheduled</option>
              <option value="Test Completed">Test Completed</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[#333] bg-[#0A0A0A]">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-700" />
          <h3 className="text-lg font-medium text-white mb-1">No applications yet</h3>
          <p className="text-gray-500">Start tracking your job applications here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#333] transition-colors group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#222] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div className="relative">
                  <button onClick={() => handleDelete(app._id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{app.company}</h3>
              <p className="text-gray-500 text-sm mb-4">{app.role}</p>

              <div className="flex items-center gap-3 mb-6">
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[app.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                  {app.status}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#1F1F1F]">
                {app.package && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    {app.package}
                  </div>
                )}
                {app.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {app.location}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Test Scheduled">Test Scheduled</option>
                  <option value="Test Completed">Test Completed</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActivitiesTab = ({ activities, loading, fetchData, user }) => {
  const handleRegister = async (id) => {
    try {
      await activityApi.register(id);
      toast.success('Registered successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async (id) => {
    try {
      await activityApi.unregister(id);
      toast.success('Unregistered successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to unregister');
    }
  };

  const activityTypeColors = {
    'Drive': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Training': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Mock Interview': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Workshop': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Deadline': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const upcomingActivities = activities.filter(a => new Date(a.date) >= new Date());

  return (
    <div>
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          Loading activities...
        </div>
      ) : upcomingActivities.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[#333] bg-[#0A0A0A]">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-700" />
          <h3 className="text-lg font-medium text-white mb-1">No upcoming activities</h3>
          <p className="text-gray-500">Check back later for new events.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingActivities.map((activity) => {
            const isRegistered = activity.participants.includes(user._id);

            return (
              <div key={activity._id} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#333] transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Date Box */}
                  <div className="flex-shrink-0 w-full md:w-20 h-20 bg-[#141414] rounded-xl border border-[#222] flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-gray-500 uppercase font-medium">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-2xl font-bold text-white">{new Date(activity.date).getDate()}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${activityTypeColors[activity.type] || 'bg-gray-800 text-gray-400'}`}>
                        {activity.type}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{activity.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{activity.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {activity.participants.length}
                        {activity.maxParticipants && `/${activity.maxParticipants} Registered`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    {isRegistered ? (
                      <button
                        onClick={() => handleUnregister(activity._id)}
                        className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(activity._id)}
                        disabled={activity.maxParticipants && activity.participants.length >= activity.maxParticipants}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activity.maxParticipants && activity.participants.length >= activity.maxParticipants
                            ? 'bg-[#141414] text-gray-500 cursor-not-allowed border border-[#222]'
                            : 'bg-white text-black hover:bg-gray-200'
                          }`}
                      >
                        {activity.maxParticipants && activity.participants.length >= activity.maxParticipants ? 'Full' : 'Register'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AddApplicationModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    package: '',
    location: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applicationApi.create(formData);
      toast.success('Application added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">
          Add New Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="e.g. Google"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Role *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Package
              </label>
              <input
                type="text"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. 12 LPA"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. Bangalore"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#141414] hover:bg-[#1F1F1F] text-gray-300 rounded-lg text-sm font-medium transition-colors border border-[#333]">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Placement;
