import React, { useState } from "react";
import NavButtons from "./NavButtons";

const mockProjects = ["Proiect A", "Proiect B"];
const mockSurveys = ["Chestionar 1", "Chestionar 2"];

const ImporturiBazeDate = ({ onBack, onHome }: { onBack?: () => void; onHome?: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [project, setProject] = useState("");
  const [survey, setSurvey] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [checkedCols, setCheckedCols] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setColumns(["Nume", "Prenume", "Telefon", "Email"]);
    setCheckedCols([]);
  };

  const handleCheck = (col: string) => {
    setCheckedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div style={{ position: "relative", paddingTop: 40 }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2>Importuri baze de date</h2>
      <div style={{ border: "1px solid #1C6B68", borderRadius: 8, padding: 16, maxWidth: 500 }}>
        <div style={{ marginBottom: 12 }}>
          <label>
            <b>Importă fișier:</b>
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFile}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <b>Proiect:</b>
            <select value={project} onChange={e => setProject(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">Alege proiect</option>
              {mockProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <b>Alocă chestionar:</b>
            <select value={survey} onChange={e => setSurvey(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">Alege chestionar</option>
              {mockSurveys.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        {columns.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <b>De afișat în chestionar:</b>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {columns.map(col => (
                <li key={col}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedCols.includes(col)}
                      onChange={() => handleCheck(col)}
                    />{" "}
                    {col}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => {
            if (!file || !project || !survey) {
              alert("Selectează fișier, proiect și chestionar!");
              return;
            }
            alert(
              `Import realizat!\nProiect: ${project}\nChestionar: ${survey}\nColoane afișate: ${checkedCols.join(
                ", "
              )}`
            );
          }}
        >
          Importă
        </button>
      </div>
      {checkedCols.length > 0 && (
        <div style={{ marginTop: 24, background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
          <b>Informații bază de date:</b>
          <ul>
            {checkedCols.map(col => (
              <li key={col}>{col}: ...</li>
            ))}
          </ul>
          <div style={{ marginTop: 8, fontStyle: "italic" }}>
            (Chestionarul va fi afișat sub această zonă)
          </div>
        </div>
      )}
    </div>
  );
};

export default ImporturiBazeDate;