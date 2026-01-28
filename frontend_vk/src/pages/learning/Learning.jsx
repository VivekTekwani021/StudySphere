import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { learningApi } from '../../api/learning.api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Quiz from './Quiz';
import { Search, BookOpen, BrainCircuit, CheckCircle } from 'lucide-react'; // BrainCircuit instead of Brain for uniqueness check or plain Brain
import toast from 'react-hot-toast';

const Learning = () => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  
  // content response: { topic, content: "markdown string" } or similar
  // Adjust based on actual API

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setContent(null);
    try {
      const response = await learningApi.getContent(topic);
      if (response.success) {
        setContent(response.data); // data might contain { content: "...", topic: "..." }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate content. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLearned = async () => {
    if (!content) return;
    try {
      // Assuming we verify based on topic name or ID. 
      // API spec: POST /complete, params not fully specified in README summary but typically topicId or topic name.
      // README says "Mark a topic as learned".
      await learningApi.markLearned(content.topic || topic);
      toast.success('Topic marked as learned!');
    } catch (error) {
      toast.error('Failed to mark learned');
    }
  };

  const handleGenerateQuiz = async () => {
    if (!content && !topic) return;
    setQuizLoading(true);
    try {
      const response = await learningApi.generateQuiz(content?.topic || topic);
      if (response.success) {
        setActiveQuiz(response.data); // data is the quiz object
      }
    } catch (error) {
      toast.error('Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = async (answers) => {
    try {
      const response = await learningApi.submitQuiz(activeQuiz._id, answers);
      if (response.success) {
        const { score, total } = response.data;
        toast.success(`Quiz completed! Score: ${score}/${total}`);
        // Could show a result modal here
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
        <p className="text-gray-500">Master any topic with AI-generated notes and quizzes</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="What do you want to learn? (e.g. Quantum Physics, React Hooks)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={loading}>
              Start Learning
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Content Area */}
      {content && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-indigo-900">{content.topic || topic}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleGenerateQuiz}
                    isLoading={quizLoading}
                  >
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleMarkLearned}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Done
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-indigo max-w-none p-8">
              <ReactMarkdown>
                {content.content || content.text || "# No content generated"}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        <Quiz 
          quizData={activeQuiz} 
          onComplete={handleQuizSubmit} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}
    </div>
  );
};

export default Learning;
