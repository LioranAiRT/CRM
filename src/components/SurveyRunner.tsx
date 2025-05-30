import React, { useState } from "react";

type Condition = {
  answer: string;
  skipTo: number;
};

type Question = {
  text: string;
  type: string;
  options: string[];
  required: boolean;
  condition?: Condition;
};

const SurveyRunner = ({ onBack }: { onBack?: () => void }) => {
  const [questions] = useState<Question[]>(() => {
    const saved = localStorage.getItem("survey");
    return saved ? JSON.parse(saved) : [];
  });
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!questions.length) {
    return <div>Nu există niciun chestionar salvat.</div>;
  }

  const handleChange = (idx: number, value: any) => {
    setAnswers({ ...answers, [idx]: value });
  };

  const handleNext = () => {
    const q = questions[currentIdx];
    // Dacă există condiție și răspunsul se potrivește, sari la skipTo
    if (
      q.condition &&
      answers[currentIdx] &&
      answers[currentIdx].toString().toLowerCase() ===
        q.condition.answer.toLowerCase()
    ) {
      setCurrentIdx(q.condition.skipTo);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // console.log(answers);
  };

  if (submitted) {
    return (
      <div>
        <div>Mulțumim pentru completare!</div>
        {onBack && (
          <div style={{ marginTop: 16 }}>
            <button onClick={onBack}>Înapoi</button>
          </div>
        )}
      </div>
    );
  }

  // Dacă am ajuns la final
  if (currentIdx >= questions.length) {
    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">Trimite răspunsurile</button>
      </form>
    );
  }

  const q = questions[currentIdx];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      {onBack && (
        <div style={{ marginBottom: 16 }}>
          <button type="button" onClick={onBack}>
            Înapoi
          </button>
        </div>
      )}
      <h2>Completează chestionarul</h2>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>
            {q.text}{" "}
            {q.required && <span style={{ color: "red" }}>*</span>}
          </b>
        </label>
        <div>
          {q.type === "text" && (
            <input
              type="text"
              required={q.required}
              value={answers[currentIdx] || ""}
              onChange={(e) => handleChange(currentIdx, e.target.value)}
              style={{ width: "60%" }}
            />
          )}
          {q.type === "choice" &&
            q.options.map((opt, oIdx) => (
              <div key={oIdx}>
                <label>
                  <input
                    type="radio"
                    name={`q${currentIdx}`}
                    value={opt}
                    checked={answers[currentIdx] === opt}
                    onChange={() => handleChange(currentIdx, opt)}
                    required={q.required}
                  />{" "}
                  {opt}
                </label>
              </div>
            ))}
          {q.type === "rating" && (
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} style={{ marginRight: 10 }}>
                  <input
                    type="radio"
                    name={`q${currentIdx}`}
                    value={n}
                    checked={answers[currentIdx] === n}
                    onChange={() => handleChange(currentIdx, n)}
                    required={q.required}
                  />{" "}
                  {n}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <button type="submit">
        {currentIdx === questions.length - 1 ? "Trimite răspunsurile" : "Următoarea"}
      </button>
    </form>
  );
};

export default SurveyRunner;