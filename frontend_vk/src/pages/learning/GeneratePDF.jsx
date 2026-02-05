import { useState } from 'react';
import { pdfApi } from '../../api/pdf.api';
import toast from 'react-hot-toast';

const GeneratePDF = () => {
  const [topic, setTopic] = useState('');

  const generatePDF = async () => {
    if (!topic) return toast.error('Topic required');

    try {
      const blob = await pdfApi.downloadNotes(topic);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic}_notes.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">📄 Generate PDF</h2>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={generatePDF}>
        Generate PDF
      </button>
    </div>
  );
};

export default GeneratePDF;
