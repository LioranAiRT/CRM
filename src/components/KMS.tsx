import React, { useState } from "react";
import NavButtons from "./NavButtons";

const mockFiles = [
  { name: "Procedura1.pdf", type: "pdf" },
  { name: "Manual_operare.docx", type: "word" },
  { name: "Tabel_date.xlsx", type: "excel" },
];

const KMS = ({ onBack, onHome }: { onBack?: () => void; onHome?: () => void }) => {
  const [files, setFiles] = useState(mockFiles);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFiles([
        ...files,
        { name: f.name, type: f.name.endsWith(".pdf") ? "pdf" : f.name.endsWith(".docx") ? "word" : "excel" },
      ]);
      alert(`Fișierul "${f.name}" a fost importat și indexat!`);
    }
  };

  const handleDelete = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ position: "relative", paddingTop: 40 }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2>KMS - Knowledge Management System</h2>
      <div style={{ border: "1px solid #1C6B68", borderRadius: 8, padding: 16, maxWidth: 500, marginBottom: 24 }}>
        <b>Importă fișier Word, PDF sau Excel:</b>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleImport}
          style={{ marginLeft: 8 }}
        />
        <div style={{ fontSize: 13, marginTop: 8, color: "#888" }}>
          (Fișierele vor fi indexate și utilizate pentru chestionare, chat inteligent, Q&A, Hint)
        </div>
      </div>
      <div>
        <b>Fișiere importate:</b>
        <ul>
          {files.map((f, idx) => (
            <li key={idx}>
              {f.name} <span style={{ color: "#1C6B68", fontSize: 12 }}>({f.type})</span>
              {(f.type === "word" || f.type === "excel") && (
                <button style={{ fontSize: 12, marginLeft: 8 }}>Editează</button>
              )}
              <button style={{ fontSize: 12, marginLeft: 8 }} onClick={() => handleDelete(idx)}>Șterge</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KMS;