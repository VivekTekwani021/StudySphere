import { useNavigate } from "react-router-dom";

export default function LearningRoom() {
  const nav = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Learning Room</h1>

      <button onClick={() => nav("/learning/content")}>
        📘 Learning Content
      </button>

      <button onClick={() => nav("/learning/youtube")}>
        📺 YouTube Learning
      </button>

      <button onClick={() => nav("/learning/pdf")}>
        📄 Generate PDF
      </button>
    </div>
  );
}
