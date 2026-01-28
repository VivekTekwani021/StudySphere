import React, { useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Quiz = ({ quizData, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // quizData is likely { _id, topic, questions: [{ question, options: [], answer }] }
  // Backend might hide answer if secure, but for simplicity assume we send answers to backend to grade or backend returns score.
  // The API submitQuiz takes { quizId, answers }.

  const handleOptionSelect = (optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Transform answers to backend format if needed
    // API expects answers map.
    await onComplete(answers);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row justify-between items-center border-b">
          <CardTitle>Quiz: {quizData.topic}</CardTitle>
          {!submitted && (
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {!submitted ? (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900">
                {quizData.questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {quizData.questions[currentQuestion].options.map((option, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestion] === idx 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestion] === idx ? 'border-primary' : 'border-gray-300'
                      }`}>
                         {answers[currentQuestion] === idx && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  variant="secondary" 
                  onClick={handlePrev} 
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion === quizData.questions.length - 1 ? (
                  <Button onClick={handleSubmit}>Submit Quiz</Button>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
               <div className="inline-flex p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <AlertCircle size={48} />
               </div>
               <h3 className="text-2xl font-bold">Quiz Submitted!</h3>
               <p className="text-gray-500">Check your results in the dashboard or history.</p>
               <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
