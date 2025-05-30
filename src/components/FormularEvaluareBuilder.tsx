import React, { useState } from "react";

// Define types
type IndicatorType = "Critic" | "Non-Critic";
type CategorieType = "Comunicare" | "Procedura" | "Atitudine";
type NotaType = "1-9" | "1-5" | "0/0.5/1";

type Item = {
  tipIndicator: IndicatorType;
  categorie: CategorieType;
  descriere: string;
  metodologie: string;
  tipNota: NotaType;
  pondereCategorie: number;
  pondereNota: number;
  materialeTraining: string;
  temeTraining: string;
};

const defaultItem: Item = {
  tipIndicator: "Critic",
  categorie: "Comunicare",
  descriere: "",
  metodologie: "",
  tipNota: "1-9",
  pondereCategorie: 0,
  pondereNota: 0,
  materialeTraining: "",
  temeTraining: "",
};

const CATEGORII: CategorieType[] = ["Comunicare", "Procedura", "Atitudine"];
const TIPURI: IndicatorType[] = ["Critic", "Non-Critic"];

const FONT_FAMILY = "Tahoma, Arial, sans-serif";

const smallInputStyle = {
  fontSize: 10,
  padding: "2px 4px",
  height: 22,
  borderRadius: 4,
  fontFamily: FONT_FAMILY,
};

const smallLabelStyle = {
  color: "#fff",
  fontSize: 11,
  fontFamily: FONT_FAMILY,
  marginBottom: 2,
};

const FormularEvaluareBuilder = ({
  onBack,
  onSave,
}: {
  onBack?: () => void;
  onSave?: (items: Item[]) => void;
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [current, setCurrent] = useState<Item>({ ...defaultItem });
  const [alertMsg, setAlert] = useState<string | null>(null);

  // Adaugă criteriu cu validări
  const handleAdd = () => {
    if (current.pondereNota > 100) {
      setAlert("Ponderea la nivel de criteriu nu poate depăși 100%!");
      return;
    }
    const totalPondereCat = items
      .filter(
        (it) =>
          it.categorie === current.categorie
      )
      .reduce((acc, it) => acc + it.pondereCategorie, 0) + current.pondereCategorie;
    if (totalPondereCat > 100) {
      setAlert(
        `Totalul ponderii pe categoria "${current.categorie}" depășește 100%!`
      );
      return;
    }
    setAlert(null);
    setItems([...items, current]);
    setCurrent({ ...defaultItem });
  };

  // Salvează în baza de date (mock: POST la /api/formulare)
  const handleSave = async () => {
    try {
      const response = await fetch("/api/formulare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!response.ok) throw new Error("Eroare la salvare!");
      if (onSave) onSave(items);
      window.alert("Formular salvat cu succes!");
    } catch (e: any) {
      setAlert(e.message || "Eroare la salvare!");
    }
  };

  // Grupare criterii pe Categorie
  const grouped: Record<CategorieType, Item[]> = {
    Comunicare: [],
    Procedura: [],
    Atitudine: [],
  };
  items.forEach((item) => {
    grouped[item.categorie].push(item);
  });

  // Calculează totaluri
  const totalPondereCategorie: Record<CategorieType, number> = {
    Comunicare: grouped.Comunicare.reduce((acc, it) => acc + it.pondereCategorie, 0),
    Procedura: grouped.Procedura.reduce((acc, it) => acc + it.pondereCategorie, 0),
    Atitudine: grouped.Atitudine.reduce((acc, it) => acc + it.pondereCategorie, 0),
  };
  const totalPondereNota: Record<CategorieType, number> = {
    Comunicare: grouped.Comunicare.reduce((acc, it) => acc + it.pondereNota, 0),
    Procedura: grouped.Procedura.reduce((acc, it) => acc + it.pondereNota, 0),
    Atitudine: grouped.Atitudine.reduce((acc, it) => acc + it.pondereNota, 0),
  };
  const totalPondereCategorieOverall = items.reduce((acc, it) => acc + it.pondereCategorie, 0);
  const totalPondereNotaOverall = items.reduce((acc, it) => acc + it.pondereNota, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", background: "#232323", borderRadius: 12, padding: 24 }}>
      <h2 style={{ color: "#fff", textAlign: "center", fontSize: 16, fontFamily: FONT_FAMILY }}>Creează Formular de Evaluare</h2>
      {alertMsg && (
        <div style={{ background: "#ffdddd", color: "#b00", padding: 8, borderRadius: 6, marginBottom: 12, fontSize: 11 }}>
          {alertMsg}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        <div>
          <label style={smallLabelStyle}>Tip indicator:</label>
          <select
            value={current.tipIndicator}
            onChange={e => setCurrent(c => ({ ...c, tipIndicator: e.target.value as IndicatorType }))}
            style={{ ...smallInputStyle, width: 120 }}
          >
            {TIPURI.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={smallLabelStyle}>Categorie:</label>
          <select
            value={current.categorie}
            onChange={e => setCurrent(c => ({ ...c, categorie: e.target.value as CategorieType }))}
            style={{ ...smallInputStyle, width: 120 }}
          >
            {CATEGORII.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={smallLabelStyle}>Descriere:</label>
          <textarea
            rows={2}
            value={current.descriere}
            onChange={e => setCurrent(c => ({ ...c, descriere: e.target.value }))}
            style={{ ...smallInputStyle, width: "100%", minHeight: 32, resize: "vertical" }}
          />
        </div>
        <div>
          <label style={smallLabelStyle}>Metodologie:</label>
          <textarea
            rows={2}
            value={current.metodologie}
            onChange={e => setCurrent(c => ({ ...c, metodologie: e.target.value }))}
            style={{ ...smallInputStyle, width: "100%", minHeight: 32, resize: "vertical" }}
          />
        </div>
        <div>
          <label style={smallLabelStyle}>Tip notă:</label>
          <select
            value={current.tipNota}
            onChange={e => setCurrent(c => ({ ...c, tipNota: e.target.value as NotaType }))}
            style={{ ...smallInputStyle, width: 100 }}
          >
            <option value="1-9">1-9</option>
            <option value="1-5">1-5</option>
            <option value="0/0.5/1">0/0.5/1</option>
          </select>
        </div>
        <div>
          <label style={smallLabelStyle}>Pondere categorie (%):</label>
          <input
            type="number"
            value={current.pondereCategorie}
            onChange={e => setCurrent(c => ({ ...c, pondereCategorie: Number(e.target.value) }))}
            min={0}
            max={100}
            style={{ ...smallInputStyle, width: 80 }}
          />
        </div>
        <div>
          <label style={smallLabelStyle}>Pondere notă (%):</label>
          <input
            type="number"
            value={current.pondereNota}
            onChange={e => setCurrent(c => ({ ...c, pondereNota: Number(e.target.value) }))}
            min={0}
            max={100}
            style={{ ...smallInputStyle, width: 80 }}
          />
        </div>
        <div>
          <label style={smallLabelStyle}>Materiale de training:</label>
          <input
            type="text"
            value={current.materialeTraining}
            onChange={e => setCurrent(c => ({ ...c, materialeTraining: e.target.value }))}
            style={{ ...smallInputStyle, width: "100%" }}
          />
        </div>
        <div>
          <label style={smallLabelStyle}>Teme de training:</label>
          <input
            type="text"
            value={current.temeTraining}
            onChange={e => setCurrent(c => ({ ...c, temeTraining: e.target.value }))}
            style={{ ...smallInputStyle, width: "100%" }}
          />
        </div>
        <button
          onClick={handleAdd}
          style={{
            ...smallInputStyle,
            background: "#E67E22",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            width: 120,
            marginTop: 4,
          }}
        >
          Adaugă criteriu
        </button>
      </div>
      {/* Tabel criterii pe Categorie */}
      <h3 style={{ color: "#fff", fontSize: 12, fontFamily: FONT_FAMILY }}>Criterii adăugate:</h3>
      {CATEGORII.map((cat) => (
        <div key={cat} style={{ marginBottom: 18 }}>
          <div style={{ color: "#1C6B68", fontWeight: 700, marginBottom: 4, fontSize: 13, fontFamily: FONT_FAMILY }}>{cat}</div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 6,
                fontSize: 8,
                marginBottom: 4,
                borderCollapse: "collapse",
                fontFamily: FONT_FAMILY,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Tip Indicator</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Descriere</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Metodologie</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Tip Notă</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Pondere Cat.</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Pondere Notă</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Materiale Training</th>
                  <th style={{ color: "#1C6B68", fontWeight: 700, fontSize: 8, padding: 2, fontFamily: FONT_FAMILY }}>Teme Training</th>
                </tr>
              </thead>
              <tbody>
                {grouped[cat].length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "#888", fontSize: 8, fontFamily: FONT_FAMILY }}>Niciun criteriu</td>
                  </tr>
                ) : (
                  grouped[cat].map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.tipIndicator}</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.descriere}</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.metodologie}</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.tipNota}</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.pondereCategorie}%</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.pondereNota}%</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.materialeTraining}</td>
                      <td style={{ padding: 2, color: "#232323", fontFamily: FONT_FAMILY }}>{item.temeTraining}</td>
                    </tr>
                  ))
                )}
                {/* Linie total pe categorie */}
                <tr style={{ background: "#E67E22", color: "#fff", fontWeight: 700, fontSize: 8 }}>
                  <td colSpan={4} style={{ textAlign: "right", padding: 2 }}>Total categorie:</td>
                  <td style={{ padding: 2 }}>{totalPondereCategorie[cat]}%</td>
                  <td style={{ padding: 2 }}>{totalPondereNota[cat]}%</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {/* Linie total overall */}
      <div style={{ marginBottom: 12, color: "#fff", fontWeight: 700, fontSize: 9, textAlign: "right", fontFamily: FONT_FAMILY }}>
        Total general pondere categorie: {totalPondereCategorieOverall}% &nbsp; | &nbsp; Total general pondere notă: {totalPondereNotaOverall}%
      </div>
      <div style={{ marginTop: 18 }}>
        <button onClick={onBack} style={{ marginRight: 12, ...smallInputStyle, width: 90 }}>Înapoi</button>
        <button onClick={handleSave} disabled={items.length === 0} style={{ ...smallInputStyle, width: 120 }}>Salvează formular</button>
      </div>
    </div>
  );
};

export default FormularEvaluareBuilder;