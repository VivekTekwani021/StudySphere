import { useState } from 'react';
import { learningApi } from '../../api/learning.api';
import toast from 'react-hot-toast';

const YouTubeLearning = () => {
  const [topic, setTopic] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    if (!topic) return toast.error('Topic required');

    try {
      const data = await learningApi.getContent({ topic });
      setVideos(data.videos || []);
    } catch {
      toast.error('Failed to fetch videos');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">📺 YouTube Learning</h2>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={fetchVideos}>Search Videos</button>

      <div className="grid grid-cols-2 gap-4">
        {videos.map(v => (
          <iframe
            key={v.videoId}
            src={`https://www.youtube.com/embed/${v.videoId}`}
            title={v.title}
          />
        ))}
      </div>
    </div>
  );
};

export default YouTubeLearning;
