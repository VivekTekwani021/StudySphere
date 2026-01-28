import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pdfApi } from '../../api/pdf.api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Download, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [topicToDownload, setTopicToDownload] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadNotes = async (e) => {
    e.preventDefault();
    if (!topicToDownload) return;
    
    setDownloading(true);
    try {
      const blob = await pdfApi.downloadNotes(topicToDownload);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topicToDownload}_notes.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download notes');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
                {user?.name?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user?.educationLevel} Student
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Account Settings</h4>
              <Button variant="danger" onClick={logout} size="sm">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PDF Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Download Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Export your AI-generated study notes as a PDF for offline reading.
            </p>
            <form onSubmit={handleDownloadNotes} className="space-y-3">
              <Input 
                placeholder="Topic Name" 
                value={topicToDownload}
                onChange={(e) => setTopicToDownload(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" isLoading={downloading}>
                Download PDF
              </Button>
            </form>
          </CardContent>
        </Card>

         {/* Placement Status Card - Only if enabled */}
         {user?.isPlacementEnabled && (
           <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
             <CardContent className="p-6">
               <div className="flex items-center mb-4">
                 <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                 <h3 className="text-lg font-bold">Placement Access</h3>
               </div>
               <p className="text-gray-300 text-sm mb-4">
                 You have exclusive access to placement opportunities.
               </p>
               <Button variant="secondary" onClick={() => window.location.href='/placement'}>
                 View Jobs
               </Button>
             </CardContent>
           </Card>
         )}
      </div>
    </div>
  );
};

export default Profile;
