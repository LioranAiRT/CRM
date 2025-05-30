import React, { useState, useEffect } from "react";
import NavButtons from "./NavButtons";

// Exemplu mock pentru supervizori (înlocuiește cu import real din ManagementUseri)
const mockSupervizori = [
  "Supervizor 1",
  "Supervizor 2",
  "Supervizor 3"
];

type Project = {
  id: string;
  nume: string;
  tip: "Intern" | "Extern";
  supervizor: string;
};

const PROJECTS_KEY = "projects";

const ListaProiecte = ({
  onBack,
  onHome,
}: {
  onBack?: () => void;
  onHome?: () => void;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [nume, setNume] = useState("");
  const [tip, setTip] = useState<"Intern" | "Extern">("Intern");
  const [supervizor, setSupervizor] = useState("");

  // Încarcă proiectele din localStorage la montare
  useEffect(() => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  // Salvează proiectul nou direct în localStorage
  const handleAdd = () => {
    if (!nume.trim() || !supervizor) {
      alert("Completează numele proiectului și selectează supervizorul!");
      return;
    }
    setProjects(prev => {
      const updated = [
        ...prev,
        { id: Date.now().toString(), nume, tip, supervizor }
      ];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
      return updated;
    });
    setNume("");
    setTip("Intern");
    setSupervizor("");
  };

  return (
    <div style={{
      position: "relative",
      paddingTop: 40,
      maxWidth: 500,
      margin: "0 auto",
      background: "#232323",
      borderRadius: 12,
      boxShadow: "0 2px 12px #0002",
      padding: 24
    }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#fff" }}>Lista Proiecte</h2>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 32,
        alignItems: "center"
      }}>
        <input
          type="text"
          placeholder="Nume proiect"
          value={nume}
          onChange={e => setNume(e.target.value)}
          style={{
            width: 180,
            padding: "6px 10px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid #1C6B68"
          }}
        />
        <div style={{ width: 180, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <label htmlFor="tip-proiect" style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>
            Tip Proiect
          </label>
          <select
            id="tip-proiect"
            value={tip}
            onChange={e => setTip(e.target.value as "Intern" | "Extern")}
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #1C6B68",
              background: "#fff",
              color: "#1C6B68",
              fontWeight: 600
            }}
          >
            <option value="Intern">Intern</option>
            <option value="Extern">Extern</option>
          </select>
        </div>
        <div style={{ width: 180, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <label htmlFor="supervizor" style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>
            Supervizor
          </label>
          <select
            id="supervizor"
            value={supervizor}
            onChange={e => setSupervizor(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #1C6B68",
              background: "#fff",
              color: supervizor ? "#222" : "#1C6B68",
              fontWeight: 600,
              boxShadow: supervizor ? "0 0 0 2px #1C6B6833" : "0 0 0 2px #1C6B68",
              outline: "none"
            }}
          >
            <option value="" style={{ color: "#1C6B68", fontWeight: 700 }}>
              Selectează supervizor
            </option>
            {mockSupervizori.map(sv => (
              <option key={sv} value={sv} style={{ color: "#222", fontWeight: 600 }}>
                {sv}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          style={{
            width: 120,
            padding: "8px 0",
            background: "#1C6B68",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 15,
            marginTop: 8
          }}
        >
          Adaugă proiect
        </button>
      </div>
      <div>
        <h4 style={{ marginBottom: 12, color: "#fff" }}>Proiecte existente</h4>
        <table style={{ width: "100%", fontSize: 14, background: "#fff", borderRadius: 8 }}>
          <thead>
            <tr style={{ background: "#1C6B68", color: "#fff" }}>
              <th style={{ padding: 8, borderRadius: "8px 0 0 0" }}>Nume</th>
              <th>Tip</th>
              <th>Supervizor</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={p.id} style={{ background: idx % 2 ? "#f7f7f7" : "#fff" }}>
                <td style={{ padding: 6, color: "#222", fontWeight: 600 }}>{p.nume}</td>
                <td style={{ padding: 6, color: "#1C6B68", fontWeight: 600 }}>{p.tip}</td>
                <td style={{ padding: 6, color: "#E67E22", fontWeight: 700 }}>{p.supervizor}</td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: 16, color: "#888" }}>
                  Niciun proiect adăugat încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaProiecte;