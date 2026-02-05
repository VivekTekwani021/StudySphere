// import { useState } from 'react';
// import { pdfApi } from '../../api/pdf.api';
// import toast from 'react-hot-toast';

// const LearningContent = () => {
//   const [topic, setTopic] = useState('');
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGeneratePDF = async () => {
//     if (!topic) {
//       toast.error('Topic required');
//       return;
//     }

//     setLoading(true);
//     try {
//       const blob = await pdfApi.downloadNotes(topic, prompt);
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${topic}_learning.pdf`;
//       a.click();

//       window.URL.revokeObjectURL(url);
//       toast.success('PDF generated');
//     } catch {
//       toast.error('Failed to generate PDF');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-4">
//       <h2 className="text-xl font-semibold">📘 Learning Content</h2>

//       <input
//         placeholder="Topic"
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//       />

//       <textarea
//         placeholder="Enter prompt"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />

//       <button onClick={handleGeneratePDF} disabled={loading}>
//         {loading ? 'Generating...' : 'Generate Learning PDF'}
//       </button>
//     </div>
//   );
// };

// export default LearningContent;
import { useState } from "react";
import axios from "../../api/axiosInstance";
import { pdfApi } from "../../api/pdf.api";

export default function LearningContent() {
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLearning = async () => {
    if (!topic) return alert("Enter topic");

    setLoading(true);
    try {
      const res = await axios.post("/learning/content", {
        topic,
        prompt,
      });

      setResult(res.data.explanation);
    } catch (err) {
      alert("Error generating learning");
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    const blob = await pdfApi.downloadNotes(topic, prompt);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic}.pdf`;
    a.click();
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">Learning Content</h2>

      <input
        className="border p-2 w-full"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateLearning}>
        {loading ? "Generating..." : "Generate Learning"}
      </button>

      {result && (
        <>
          <div className="border p-4 bg-gray-50 whitespace-pre-wrap">
            {result}
          </div>

          <button onClick={downloadPDF}>
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}
