import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Wifi, Share2, Clock, ArrowLeft, Loader2, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { pdfApi } from '../../api/pdf.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: Wifi, title: "Offline Access", desc: "Study anywhere without internet connection" },
  { icon: Clock, title: "Quick Revision", desc: "Condensed notes for fast review sessions" },
  { icon: Share2, title: "Easy Sharing", desc: "Share PDF notes with classmates easily" },
];

const topics = [
  "Data Structures", "Algorithms", "Machine Learning", "React Hooks",
  "Python Basics", "SQL Queries", "System Design", "OOPs Concepts"
];

const GeneratePDF = () => {
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();

  const generatePDF = async () => {
    if (!topic) return toast.error('Please enter a topic');

    setLoading(true);
    setDownloaded(false);
    try {
      const blob = await pdfApi.downloadNotes(topic, prompt);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic}_notes.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
      setDownloaded(true);
      toast.success('PDF generated and downloaded!');

      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') generatePDF();
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-emerald-500 mb-4">
            <FileText className="w-3 h-3" />
            <span>Smart Note Taker</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Instant Study Notes
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Create beautifully formatted PDF summaries for any topic in seconds. Perfect for last-minute revision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] hover:border-emerald-500/20 transition-colors group"
            >
              <feature.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Topic
              </label>
              <input
                type="text"
                placeholder="What are you studying? (e.g., Graph Theory)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-5 py-4 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Customize Notes (Optional)
              </label>
              <textarea
                placeholder="E.g., include definitions, key formulas, and comparisons..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none text-base"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Trending Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${topic === t
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-[#141414] text-gray-400 border-[#1F1F1F] hover:text-white hover:border-gray-600'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generatePDF}
              disabled={loading}
              className={`w-full py-4 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg ${downloaded ? 'bg-emerald-500 text-black hovering:bg-emerald-400' : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Notes...
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Download Complete
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  Generate PDF
                </>
              )}
            </button>
          </div>

          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};

export default GeneratePDF;
