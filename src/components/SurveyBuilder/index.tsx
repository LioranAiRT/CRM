import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NavButtons from "../NavButtons";

const questionTypes = [
  { value: "single", label: "Selecție unică" },
  { value: "multiple", label: "Selecție multiplă" },
  { value: "dropdown", label: "Dropdown list" },
  { value: "rating5", label: "Rating 1-5" },
  { value: "rating10", label: "Rating 1-10" },
  { value: "text", label: "Free text" }
];

type Condition = {
  answer: string;
  skipTo: number | "";
};

type Question = {
  text: string;
  type: string;
  options: string[];
  required: boolean;
  condition?: Condition;
};

type Survey = {
  id: string;
  name: string;
  questions: Question[];
};

const iconBtnStyle = {
  fontSize: 14,
  padding: "2px 6px",
  height: 24,
  minWidth: 0,
  marginLeft: 4,
  marginRight: 0,
  background: "#2F2F2F",
  border: "1px solid #1C6B68",
  borderRadius: 6,
  color: "#D6DBDA",
  cursor: "pointer" as const,
  verticalAlign: "middle"
};

const SurveyBuilder = ({
  initialSurvey,
  onBack,
  onSave,
  onNavigateRequest,
  onHome,
}: {
  initialSurvey?: Survey;
  onBack?: () => void;
  onSave?: () => void;
  onNavigateRequest?: (callback: () => void) => void;
  onHome?: () => void;
}) => {
  const [name, setName] = useState(initialSurvey?.name || "");
  const [questions, setQuestions] = useState<Question[]>(initialSurvey?.questions || []);
  const [preview, setPreview] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<any>({});
  const [dirty, setDirty] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewOrder, setPreviewOrder] = useState<number[]>([]);

  // Adaugă automat întrebarea Observații la final dacă nu există deja
  React.useEffect(() => {
    if (
      questions.length === 0 ||
      questions[questions.length - 1]?.text !== "Observații"
    ) {
      setQuestions((prev) => [
        ...prev.filter((q) => q.text !== "Observații"),
        {
          text: "Observații",
          type: "text",
          options: [""],
          required: false,
        },
      ]);
    }
    // eslint-disable-next-line
  }, []);

  // Marchează ca modificat la orice schimbare
  React.useEffect(() => {
    setDirty(true);
  }, [name, questions]);

  // Funcție pentru navigare cu confirmare
  const handleNavigate = (callback: () => void) => {
    if (dirty && !preview) {
      if (
        window.confirm(
          "Esti sigur ca vrei sa parasesti modulul? Modificarile nesalvate se pot pierde."
        )
      ) {
        setDirty(false);
        callback();
      }
    } else {
      callback();
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions.slice(0, -1),
      { text: "", type: "single", options: [""], required: false },
      questions[questions.length - 1], // Observații la final
    ]);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const addOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push("");
    setQuestions(updated);
  };

  const removeQuestion = (idx: number) => {
    // Nu permite ștergerea Observații
    if (questions[idx].text === "Observații") return;
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
  };

  const moveQuestion = (idx: number, direction: number) => {
    // Nu permite mutarea Observații
    if (questions[idx].text === "Observații") return;
    const updated = [...questions];
    const targetIdx = idx + direction;
    if (
      targetIdx < 0 ||
      targetIdx >= questions.length - 1 // Observații rămâne la final
    )
      return;
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    setQuestions(updated);
  };

  const saveSurvey = () => {
    if (!name.trim()) {
      alert("Introdu un nume pentru survey!");
      return;
    }
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]");
    let id = initialSurvey?.id || uuidv4();
    const newSurvey = { id, name, questions };
    const updatedSurveys = surveys.filter((s: Survey) => s.id !== id);
    updatedSurveys.push(newSurvey);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));
    alert("Chestionar salvat!");
    setDirty(false);
    if (onSave) onSave();
  };

  // --- Preview logic cu conditionari si skip ---
  React.useEffect(() => {
    if (preview) {
      setPreviewIdx(0);
      setPreviewAnswers({});
      setPreviewOrder([0]);
    }
  }, [preview, questions.length]);

  const handlePreviewChange = (idx: number, value: any) => {
    setPreviewAnswers((prev: any) => ({ ...prev, [idx]: value }));
  };

  const getNextIdx = (currentIdx: number, answers: any) => {
    const q = questions[currentIdx];
    if (
      q.condition &&
      answers[currentIdx] &&
      q.condition.answer &&
      answers[currentIdx].toString().toLowerCase() ===
        q.condition.answer.toLowerCase() &&
      q.condition.skipTo !== ""
    ) {
      return Number(q.condition.skipTo);
    }
    return currentIdx + 1;
  };

  const handlePreviewNext = () => {
    const nextIdx = getNextIdx(previewOrder[previewOrder.length - 1], {
      ...previewAnswers,
    });
    if (
      nextIdx < questions.length &&
      questions[nextIdx].text !== "Observații"
    ) {
      setPreviewOrder((prev) => [...prev, nextIdx]);
      setPreviewIdx(previewOrder.length);
    } else {
      setPreviewIdx(previewOrder.length + 1);
    }
  };

  const handlePreviewBack = () => {
    if (previewIdx > 0) {
      setPreviewIdx(previewIdx - 1);
      setPreviewOrder((prev) => prev.slice(0, -1));
    }
  };

  const handlePreviewReset = () => {
    setPreviewAnswers({});
    setPreviewIdx(0);
    setPreviewOrder([0]);
  };

  // Validare pentru întrebări obligatorii la salvare
  const validateRequired = () => {
    const missing = questions
      .filter((q) => q.required && q.text !== "Observații")
      .map((q, idx) => ({ idx, text: q.text }))
      .filter((q, idx) => {
        // Dacă nu există răspuns pentru această întrebare
        return !previewAnswers[q.idx] || previewAnswers[q.idx].length === 0;
      });
    if (missing.length > 0) {
      alert(
        "Nu ai completat toate întrebările obligatorii:\n" +
          missing.map((q) => `- ${q.text}`).join("\n")
      );
      return false;
    }
    alert("Toate întrebările obligatorii au răspuns!");
    return true;
  };

  // Butoane de navigare cu confirmare
  const handleBack = () => {
    if (onNavigateRequest) {
      onNavigateRequest(() => onBack && onBack());
    } else {
      handleNavigate(() => onBack && onBack());
    }
  };

  return (
    <div style={{ position: "relative", paddingTop: 40 }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2>Survey Builder</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          Nume survey:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 300 }}
            required
          />
        </label>
      </div>
      {!preview && (
        <button onClick={addQuestion}>Adaugă întrebare</button>
      )}
      <button
        onClick={() => setPreview(!preview)}
        style={{ marginLeft: 8 }}
      >
        {preview ? "Continua Editarea" : "Previzualizează"}
      </button>
      <button onClick={saveSurvey} style={{ marginLeft: 8 }}>
        Salvează chestionar
      </button>
      {preview && (
        <button
          onClick={validateRequired}
          style={{ marginLeft: 8, background: "#1C6B68", color: "#fff" }}
        >
          Verifică întrebări obligatorii
        </button>
      )}
      {!preview ? (
        <div>
          {questions.map((q, idx) =>
            q.text === "Observații" ? null : (
              <div
                key={idx}
                style={{
                  margin: "32px 0 32px 0",
                  borderBottom: "2px solid #1C6B68",
                  padding: "0 0 24px 0",
                  background: "#232323",
                  borderRadius: 8,
                  position: "relative",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 20 }}>
                  Întrebarea {idx + 1}:
                </div>
                <input
                  type="text"
                  placeholder="Text întrebare"
                  value={q.text}
                  onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                  style={{ width: "60%", fontSize: 16, marginBottom: 8 }}
                />
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                  style={{ marginLeft: 10, fontSize: 15 }}
                >
                  {questionTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {(q.type === "single" ||
                  q.type === "multiple" ||
                  q.type === "dropdown") && (
                  <div style={{ marginTop: 8 }}>
                    <b>Opțiuni:</b>
                    {q.options.map((opt, oIdx) => (
                      <input
                        key={oIdx}
                        type="text"
                        placeholder={`Opțiunea ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                        style={{ marginLeft: 5, fontSize: 14 }}
                      />
                    ))}
                    <button
                      onClick={() => addOption(idx)}
                      style={{
                        ...iconBtnStyle,
                        marginLeft: 5,
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {/* Conditionare */}
                <div style={{ marginTop: 10 }}>
                  <span>
                    Dacă răspunsul este
                    {(q.type === "single" ||
                      q.type === "multiple" ||
                      q.type === "dropdown") &&
                    q.options.length > 0 ? (
                      <select
                        value={q.condition?.answer || ""}
                        onChange={(e) =>
                          updateQuestion(idx, "condition", {
                            ...(q.condition || {}),
                            answer: e.target.value,
                            skipTo: q.condition?.skipTo || "",
                          })
                        }
                        style={{ margin: "0 5px", fontSize: 14 }}
                      >
                        <option value="">Alege...</option>
                        {q.options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="valoare răspuns"
                        value={q.condition?.answer || ""}
                        onChange={(e) =>
                          updateQuestion(idx, "condition", {
                            ...(q.condition || {}),
                            answer: e.target.value,
                            skipTo: q.condition?.skipTo || "",
                          })
                        }
                        style={{ margin: "0 5px", fontSize: 14 }}
                      />
                    )}
                    atunci sari la întrebarea
                    <select
                      value={q.condition?.skipTo ?? ""}
                      onChange={(e) =>
                        updateQuestion(idx, "condition", {
                          ...(q.condition || {}),
                          answer: q.condition?.answer || "",
                          skipTo: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      style={{ margin: "0 5px", fontSize: 14 }}
                    >
                      <option value="">--</option>
                      {questions.map((_, qIdx) =>
                        qIdx > idx && questions[qIdx].text !== "Observații" ? (
                          <option key={qIdx} value={qIdx}>
                            {qIdx + 1}
                          </option>
                        ) : null
                      )}
                    </select>
                    <button
                      style={{
                        ...iconBtnStyle,
                        marginLeft: 8,
                      }}
                      onClick={() => updateQuestion(idx, "condition", undefined)}
                      type="button"
                      title="Șterge condiția"
                    >
                      ✖
                    </button>
                  </span>
                </div>
                {/* Obligativitate și acțiuni */}
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(idx, "required", e.target.checked)
                      }
                    />
                    <span>Întrebare obligatorie</span>
                  </label>
                  <button
                    onClick={() => removeQuestion(idx)}
                    style={iconBtnStyle}
                    title="Șterge întrebare"
                  >
                    🗑
                  </button>
                  <button
                    onClick={() => moveQuestion(idx, -1)}
                    disabled={idx === 0}
                    style={iconBtnStyle}
                    title="Mută sus"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveQuestion(idx, 1)}
                    disabled={idx === questions.length - 2}
                    style={iconBtnStyle}
                    title="Mută jos"
                  >
                    ↓
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h3>Previzualizare chestionar (testare conditionari)</h3>
          <form>
            {previewOrder.map((qIdx, idx) => {
              const q = questions[qIdx];
              if (!q || q.text === "Observații") return null;
              return (
                <div
                  key={qIdx}
                  style={{
                    margin: "32px 0 32px 0",
                    borderBottom: "2px solid #1C6B68",
                    padding: "0 0 24px 0",
                  }}
                >
                  <b style={{ fontSize: 20 }}>
                    {q.text}
                    {q.required && <span style={{ color: "red" }}>*</span>}
                  </b>
                  <div style={{ fontSize: 15 }}>
                    {q.type === "text" && (
                      <input
                        type="text"
                        required={q.required}
                        value={previewAnswers[qIdx] || ""}
                        onChange={(e) =>
                          handlePreviewChange(qIdx, e.target.value)
                        }
                        style={{ width: "60%" }}
                      />
                    )}
                    {q.type === "single" &&
                      q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <label>
                            <input
                              type="radio"
                              name={`q${qIdx}`}
                              value={opt}
                              checked={previewAnswers[qIdx] === opt}
                              onChange={() => handlePreviewChange(qIdx, opt)}
                              required={q.required}
                            />{" "}
                            {opt}
                          </label>
                        </div>
                      ))}
                    {q.type === "multiple" &&
                      q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <label>
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(previewAnswers[qIdx])
                                  ? previewAnswers[qIdx].includes(opt)
                                  : false
                              }
                              onChange={(e) => {
                                let arr =
                                  Array.isArray(previewAnswers[qIdx])
                                    ? [...previewAnswers[qIdx]]
                                    : [];
                                if (e.target.checked) arr.push(opt);
                                else arr = arr.filter((v) => v !== opt);
                                handlePreviewChange(qIdx, arr);
                              }}
                            />{" "}
                            {opt}
                          </label>
                        </div>
                      ))}
                    {q.type === "dropdown" && (
                      <select
                        value={previewAnswers[qIdx] || ""}
                        onChange={(e) =>
                          handlePreviewChange(qIdx, e.target.value)
                        }
                        required={q.required}
                      >
                        <option value="">Alege...</option>
                        {q.options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                    {q.type === "rating5" && (
                      <div>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <label key={n} style={{ marginRight: 10 }}>
                            <input
                              type="radio"
                              name={`q${qIdx}`}
                              value={n}
                              checked={previewAnswers[qIdx] === n}
                              onChange={() => handlePreviewChange(qIdx, n)}
                              required={q.required}
                            />{" "}
                            {n}
                          </label>
                        ))}
                      </div>
                    )}
                    {q.type === "rating10" && (
                      <div>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <label key={n} style={{ marginRight: 10 }}>
                            <input
                              type="radio"
                              name={`q${qIdx}`}
                              value={n}
                              checked={previewAnswers[qIdx] === n}
                              onChange={() => handlePreviewChange(qIdx, n)}
                              required={q.required}
                            />{" "}
                            {n}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Observații la final */}
            <div style={{ marginBottom: 20 }}>
              <b style={{ fontSize: 20 }}>Observații</b>
              <div>
                <textarea
                  rows={6}
                  style={{
                    width: "50%",
                    minWidth: 300,
                    maxWidth: "90%",
                    fontSize: 16,
                    padding: 8,
                  }}
                  placeholder="Scrie observațiile aici..."
                  value={previewAnswers["obs"] || ""}
                  onChange={(e) =>
                    setPreviewAnswers({
                      ...previewAnswers,
                      obs: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handlePreviewReset}
              style={{ marginLeft: 10 }}
            >
              Resetează
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;