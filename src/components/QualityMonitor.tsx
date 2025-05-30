import React, { useState } from "react";
import NavButtons from "./NavButtons";
import RaportEvaluari from "./RaportEvaluari";
import FormularEvaluareBuilder from "./FormularEvaluareBuilder";

// Mock data pentru filtre și tabele
const mockProjects = ["Proiect A", "Proiect B"];
const mockLeaders = ["Team Leader 1", "Team Leader 2"];
const mockConsultants = ["Consultant 1", "Consultant 2"];

type Props = {
  onBack?: () => void;
  onHome?: () => void;
};

const QualityMonitor = ({ onBack, onHome }: Props) => {
  const [page, setPage] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [project, setProject] = useState("");
  const [leader, setLeader] = useState("");
  const [consultant, setConsultant] = useState("");
  const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");

  // Date pentru tabel Export Fișe Feedback
  const tableData = [...Array(10)].map((_, i) => ({
    consultant: `Consultant ${i + 1}`,
    leader: `Team Leader ${i % 2 + 1}`,
    project: `Proiect ${i % 2 === 0 ? "A" : "B"}`,
    date: `2024-05-${10 + i}`,
  }));

  // Stiluri pentru inputuri și selecturi
  const inputStyle: React.CSSProperties = {
    width: "100%",
    minWidth: 0,
    padding: "4px 8px",
    fontSize: 13,
    borderRadius: 6,
    border: "1px solid #fff",
    boxSizing: "border-box"
  };

  return (
    <div style={{ position: "relative", paddingTop: 40, maxWidth: 900, margin: "0 auto" }}>
      <NavButtons
        onBack={page ? () => setPage(null) : onBack}
        onHome={onHome}
      />
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Monitorizare Calitate</h2>
      {!page && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 350, margin: "0 auto" }}>
          <button onClick={() => setPage("editor")}>Editor formulare și fișe de feedback</button>
          <button onClick={() => setPage("raport")}>Raport evaluări</button>
          <button onClick={() => setPage("export")}>Exportă fișe feedback</button>
          <button onClick={() => setPage("analiza")}>Analiză</button>
          <button onClick={() => setPage("obiective")}>Setează Obiective</button>
        </div>
      )}

      {/* Editor formulare și fișe */}
      {page === "editor" && (
        <div>
          <h3>Editor formulare și fișe de feedback</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setPage("formular")}>Creează - Formular evaluare</button>
            <button>Draft fișă de feedback</button>
            <button>Afisează formularele de evaluare</button>
            <button>Afisează fișele de feedback</button>
          </div>
          {/* Exemplu listă fișe */}
          <ul>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              Fisa Feedback 1
              <button style={{ fontSize: 12 }}>Editează</button>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              Fisa Feedback 2
              <button style={{ fontSize: 12 }}>Editează</button>
            </li>
          </ul>
        </div>
      )}

      {/* Formular evaluare builder */}
      {page === "formular" && (
        <FormularEvaluareBuilder
          onBack={() => setPage("editor")}
          onSave={(items) => {
            // aici poți salva formularul în localStorage sau backend
            setPage("editor");
          }}
        />
      )}

      {/* Raport evaluări */}
      {page === "raport" && (
        <RaportEvaluari
          onBack={() => setPage(null)}
          onHome={onHome}
        />
      )}

      {/* Export fișe feedback */}
      {page === "export" && (
        <div>
          <h3 style={{ marginBottom: 16 }}>Export Fișe Feedback</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
              alignItems: "end",
              marginBottom: 8,
              background: "#1C6B68",
              padding: 12,
              borderRadius: 8,
              maxWidth: 800,
              marginLeft: "auto",
              marginRight: "auto",
              justifyItems: "center"
            }}
          >
            <div style={{ width: "100%" }}>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: 4, display: "block" }}>De la data</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: 4, display: "block" }}>La data</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: 4, display: "block" }}>Proiect</label>
              <select
                value={project}
                onChange={e => setProject(e.target.value)}
                style={{ ...inputStyle, minWidth: 100, maxWidth: 140 }}
              >
                <option value="">Toate proiectele</option>
                {mockProjects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: 4, display: "block" }}>Team Leader</label>
              <select
                value={leader}
                onChange={e => setLeader(e.target.value)}
                style={{ ...inputStyle, minWidth: 100, maxWidth: 140 }}
              >
                <option value="">Toți Team Leaderii</option>
                {mockLeaders.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: 4, display: "block" }}>Consultant</label>
              <select
                value={consultant}
                onChange={e => setConsultant(e.target.value)}
                style={{ ...inputStyle, minWidth: 100, maxWidth: 140 }}
              >
                <option value="">Toți Consultanții</option>
                {mockConsultants.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {/* Butoanele pe linie separată */}
          <div style={{
            display: "flex",
            gap: 10,
            marginBottom: 18,
            marginTop: 8,
            justifyContent: "flex-end",
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            <button
              style={{
                height: 32,
                minWidth: 90,
                background: "#fff",
                color: "#1C6B68",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14
              }}
              onClick={() => {
                // Filtrează logică
                let data = [...Array(10)].map((_, i) => ({
                  consultant: `Consultant ${i + 1}`,
                  leader: `Team Leader ${i % 2 + 1}`,
                  project: `Proiect ${i % 2 === 0 ? "A" : "B"}`,
                  date: `2024-05-${10 + i}`,
                }));
                if (fromDate) data = data.filter((d) => d.date >= fromDate);
                if (toDate) data = data.filter((d) => d.date <= toDate);
                if (project) data = data.filter((d) => d.project === project);
                if (leader) data = data.filter((d) => d.leader === leader);
                if (consultant) data = data.filter((d) => d.consultant === consultant);
                alert("Filtrare aplicată (mock)!");
              }}
            >
              Filtrează
            </button>
            <button
              style={{
                height: 32,
                minWidth: 90,
                background: "#E67E22",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14
              }}
              onClick={() => {
                // Exportă logică
                let rows = [
                  ["Consultant", "Team Leader", "Proiect", "Data"],
                  ...tableData.map((row) => [
                    row.consultant,
                    row.leader,
                    row.project,
                    row.date,
                  ]),
                ];
                const csvContent = rows.map((r) => r.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "export_fise_feedback.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Exportă
            </button>
          </div>
          <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
            <table style={{ width: "100%", fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Consultant</th>
                  <th>Team Leader</th>
                  <th>Proiect</th>
                  <th>Data</th>
                  <th style={{ textAlign: "right" }}>Export</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: "#222", fontWeight: 600 }}>{row.consultant}</td>
                    <td style={{ color: "#1C6B68", fontWeight: 600 }}>{row.leader}</td>
                    <td style={{ color: "#1C6B68", fontWeight: 600 }}>{row.project}</td>
                    <td style={{ color: "#222" }}>{row.date}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        style={{
                          padding: "4px 10px",
                          background: "#E67E22",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: 13
                        }}
                        onClick={() => { alert("Export individual mock!"); }}
                      >
                        Exportă
                      </button>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 16, color: "#888" }}>
                      Niciun rezultat pentru filtrele selectate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analiză */}
      {page === "analiza" && (
        <div>
          <h3>Analiză</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="De la Data" />
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} placeholder="La Data" />
            <select value={project} onChange={e => setProject(e.target.value)}>
              <option value="">Toate proiectele</option>
              {mockProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={leader} onChange={e => setLeader(e.target.value)}>
              <option value="">Toți Team Leaderii</option>
              {mockLeaders.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={consultant} onChange={e => setConsultant(e.target.value)}>
              <option value="">Toți Consultanții</option>
              {mockConsultants.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={viewType} onChange={e => setViewType(e.target.value as any)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button style={{ fontSize: 12 }}>Filtrează</button>
          </div>
          {/* Grafic minimalist (exemplu bară ASCII) */}
          <div style={{ fontFamily: "monospace", marginBottom: 16 }}>
            <div>
              Săptămâna 1: <span style={{ color: "green" }}>███████ 70%</span>
            </div>
            <div>
              Săptămâna 2: <span style={{ color: "red" }}>█████ 50%</span>
            </div>
            <div>
              Săptămâna 3: <span style={{ color: "green" }}>█████████ 90%</span>
            </div>
          </div>
          {/* Rubrică obiective și target */}
          <div style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
            <b>Obiective setate:</b> 90% <br />
            <b>Rezultate obținute:</b> 85% <br />
            <b>Target achievement:</b>{" "}
            <span style={{ color: "red" }}>-5% față de target</span>
          </div>
        </div>
      )}

      {/* Setează Obiective */}
      {page === "obiective" && (
        <div>
          <h3>Setează Obiective</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select>
              <option value="">Tip indicator</option>
              <option value="cantitativ">Cantitativ</option>
              <option value="calitativ">Calitativ</option>
            </select>
            <select>
              <option value="">Proiect</option>
              {mockProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select multiple style={{ minWidth: 120 }}>
              <option value="">Toți Team Leaderii</option>
              {mockLeaders.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button
              onClick={() => {
                if (window.confirm("Esti sigur că vrei să aplici obiectivele?")) {
                  alert("Obiective setate!");
                }
              }}
            >
              Aplică
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityMonitor;