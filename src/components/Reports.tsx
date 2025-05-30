import React, { useState } from "react";
import NavButtons from "./NavButtons";

const mockProjects = ["Proiect A", "Proiect B", "Proiect C"];
const mockBases = ["Baza 1", "Baza 2", "Baza 3"];

type ReportsProps = {
  onBack?: () => void;
  onHome?: () => void;
};

const Reports: React.FC<ReportsProps> = ({ onBack, onHome }) => {
  const [customExport, setCustomExport] = useState(false);
  const [project, setProject] = useState("");
  const [dbName, setDbName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("csv");

  const handleExport = () => {
    if (!fromDate || !toDate) {
      alert("Nu ai selectat De la data și Până la data!");
      return;
    }
    alert(
      `Export ${reportType.toUpperCase()} pentru ${project || "Toate proiectele"}, ${dbName || "Toate bazele"}, ${fromDate} - ${toDate}`
    );
    // ...export logic...
  };

  return (
    <div style={{ position: "relative", paddingTop: 40 }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2>Rapoarte</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
        <button style={{ fontSize: 12 }} onClick={() => setCustomExport(false)}>
          Exportă ultima bază importată
        </button>
        <button style={{ fontSize: 12 }} onClick={() => setCustomExport(true)}>
          Export personalizat
        </button>
      </div>
      {customExport && (
        <div style={{ marginTop: 8, maxWidth: 600 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={project} onChange={e => setProject(e.target.value)}>
              <option value="">Toate proiectele</option>
              {mockProjects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select value={dbName} onChange={e => setDbName(e.target.value)}>
              <option value="">Toate bazele</option>
              {mockBases.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
            </select>
            <button style={{ fontSize: 12 }} onClick={handleExport}>
              Exportă
            </button>
          </div>
        </div>
      )}
      <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ccc", marginTop: 24 }}>
        <table style={{ width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              <th>Coloana 1</th>
              <th>Coloana 2</th>
              <th>Coloana 3</th>
              <th style={{ textAlign: "right" }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td>Date {i + 1}</td>
                <td>Valoare {i + 1}</td>
                <td>Altceva {i + 1}</td>
                <td style={{ textAlign: "right" }}>
                  <button style={{ fontSize: 12, marginLeft: 8 }}>Detalii</button>
                  <button style={{ fontSize: 12, marginLeft: 8 }}>Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;