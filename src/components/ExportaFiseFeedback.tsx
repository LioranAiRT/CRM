import React, { useState } from "react";

// Mock data pentru filtre și tabele
const mockProjects = ["Proiect A", "Proiect B"];
const mockLeaders = ["Team Leader 1", "Team Leader 2"];
const mockConsultants = ["Consultant 1", "Consultant 2"];

// Generează date mock pentru tabel
const generateTableData = () =>
  [...Array(10)].map((_, i) => ({
    consultant: `Consultant ${i + 1}`,
    leader: `Team Leader ${i % 2 + 1}`,
    project: `Proiect ${i % 2 === 0 ? "A" : "B"}`,
    date: `2024-05-${10 + i}`,
  }));

const ExportaFiseFeedback = ({
  onBack,
  onHome,
}: {
  onBack?: () => void;
  onHome?: () => void;
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [project, setProject] = useState("");
  const [leader, setLeader] = useState("");
  const [consultant, setConsultant] = useState("");
  const [filteredData, setFilteredData] = useState(generateTableData());

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

  const handleFiltreaza = () => {
    let data = generateTableData();
    if (fromDate) {
      data = data.filter((d) => d.date >= fromDate);
    }
    if (toDate) {
      data = data.filter((d) => d.date <= toDate);
    }
    if (project) {
      data = data.filter((d) => d.project === project);
    }
    if (leader) {
      data = data.filter((d) => d.leader === leader);
    }
    if (consultant) {
      data = data.filter((d) => d.consultant === consultant);
    }
    setFilteredData(data);
  };

  const handleExport = async () => {
    let rows = [
      ["Consultant", "Team Leader", "Proiect", "Data"],
      ...filteredData.map((row) => [
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
  };

  return (
    <div style={{
      position: "relative",
      paddingTop: 40,
      maxWidth: 900,
      margin: "0 auto",
      background: "#232323",
      borderRadius: 12,
      boxShadow: "0 2px 12px #0002",
      padding: 24
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#fff" }}>Export Fișe Feedback</h2>
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
          onClick={handleFiltreaza}
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
        >
          Filtrează
        </button>
        <button
          onClick={handleExport}
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
        >
          Exportă
        </button>
      </div>
      {/* Info număr fișe */}
      <div style={{ marginBottom: 8, color: "#1C6B68", fontWeight: 600 }}>
        Se afișează {filteredData.length} fișe de feedback
      </div>
      {/* Tabel cu scroll */}
      <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
        <table style={{ width: "100%", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#1C6B68", color: "#fff" }}>
              <th>Consultant</th>
              <th>Team Leader</th>
              <th>Proiect</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} style={{ background: i % 2 ? "#f7f7f7" : "#fff" }}>
                <td style={{ color: "#222", fontWeight: 600 }}>{row.consultant}</td>
                <td style={{ color: "#1C6B68", fontWeight: 600 }}>{row.leader}</td>
                <td style={{ color: "#1C6B68", fontWeight: 600 }}>{row.project}</td>
                <td style={{ color: "#222" }}>{row.date}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 16, color: "#888" }}>
                  Niciun rezultat pentru filtrele selectate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportaFiseFeedback;