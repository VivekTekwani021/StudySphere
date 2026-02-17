import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Search, Play, Clock, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { learningApi } from '../../api/learning.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const YouTubeLearning = () => {
  const [topic, setTopic] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    if (!topic) return toast.error('Please enter a topic');

    setLoading(true);
    try {
      const data = await learningApi.getContent({ topic });
      setVideos(data.videos || []);
      if (data.videos?.length === 0) {
        toast.error('No videos found for this topic');
      }
    } catch {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchVideos();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">

      {/* Back Button */}
      <button
        onClick={() => navigate('/learning')}
        className="flex items-center gap-2 mb-8 group text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Hub</span>
      </button>

      <div className="max-w-7xl mx-auto">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#1F1F1F] pb-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-red-500 mb-4">
              <Youtube className="w-3 h-3" />
              <span>Video Library</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">YouTube Learning</h1>
            <p className="text-gray-400">Search for educational videos and watch them without distractions.</p>
          </div>

          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search topics (e.g. React, Physics)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-4 pr-12 py-3 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
            />
            <button
              onClick={fetchVideos}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#1F1F1F] hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <AnimatePresence mode="wait">
          {videos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden hover:border-red-500/30 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-video bg-[#141414]">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4 border-t border-[#1F1F1F] pt-4">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Video Source</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-white hover:text-red-500 transition-colors"
                      >
                        Open in YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !loading && (
              <div className="text-center py-20 border border-dashed border-[#1F1F1F] rounded-3xl">
                <div className="w-20 h-20 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-8 h-8 text-gray-700 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Enter a topic above to find curated educational content from YouTube.
                </p>
              </div>
            )
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default YouTubeLearning;
