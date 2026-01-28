import React, { useState } from 'react';
import { roadmapApi } from '../../api/roadmap.api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Map, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null); // Assuming API returns roadmap object
  const [loading, setLoading] = useState(false); // Initial load
  
  // Note: roadmapApi.generate() likely returns the WHOLE roadmap or current state.
  // We might enter this page and fetch current roadmap if it exists, but README endpoint is POST /roadmap "Generate a study roadmap".
  // This implies creates new. 
  // Maybe GET /roadmap is needed? The README table only lists POST /roadmap.
  // If there is no GET, we can't see existing roadmap unless POST returns "current if exists".
  // I will assume POST acts as "Get or Generate" or I need to handle "Generate" button.
  // User prompt says "Generate a study roadmap". I'll add a button.

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await roadmapApi.generate();
      if (response.success) {
        setRoadmap(response.data);
        toast.success('Roadmap generated!');
      }
    } catch (error) {
      toast.error('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await roadmapApi.completeTask(taskId);
      if (response.success) {
        toast.success('Task completed!');
        // Update local state by marking task done
        // Assuming roadmap structure
      }
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  return (
    <div className="space-y-6">
       <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold text-gray-900">Study Roadmap</h1>
         <p className="text-gray-500">Your personalized path to success</p>
       </div>

       {!roadmap ? (
         <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
           <div className="p-4 bg-indigo-100 rounded-full text-primary mb-6">
             <Map size={48} />
           </div>
           <h2 className="text-xl font-bold mb-2">No Active Roadmap</h2>
           <p className="text-gray-500 mb-6 text-center max-w-md">
             Generate an AI-powered study plan tailored to your profile and goals.
           </p>
           <Button size="lg" onClick={handleGenerate} isLoading={loading}>
             Generate Roadmap
           </Button>
         </div>
       ) : (
         <div className="space-y-4">
           {/* Roadmap display logic depending on API response structure */}
           <p>Roadmap content placeholder</p>
           {/* If roadmap is a list of tasks */}
           {/* (roadmap.tasks || []).map(task => ...) */}
         </div>
       )}
    </div>
  );
};

export default Roadmap;
