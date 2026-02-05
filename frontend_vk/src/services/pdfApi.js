import axios from "axios";

export const downloadPDF = async ({ title, content }) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://localhost:5000/api/pdf/download",
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${title}.pdf`);
  document.body.appendChild(link);
  link.click();
};
