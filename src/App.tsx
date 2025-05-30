import React, { useState, useEffect } from "react";
import SurveyBuilder from "./components/SurveyBuilder";
import SurveyList from "./components/SurveyList";
import Reports from "./components/Reports";
import QualityMonitor from "./components/QualityMonitor";
import ManagementUseri from "./components/ManagementUseri";
import ImporturiBazeDate from "./components/ImporturiBazeDate";
import ConsultantDashboard from "./components/ConsultantDashboard";
import KMS from "./components/KMS";
import Logo from "./components/Logo";
import RaportEvaluari from "./components/RaportEvaluari";
import Login, { UserRole } from "./components/Login";
import ListaProiecte from "./components/ListaProiecte";
import "./App.css";

type Survey = {
  id: string;
  name: string;
  questions: any[];
};

const cardShades = [
  "linear-gradient(90deg, #1C6B68 0%, #0D5B57 100%)",
  "linear-gradient(90deg, #2F2F2F 0%, #1B1C1C 100%)",
  "linear-gradient(90deg, #0D5B57 0%, #1C6B68 100%)",
  "linear-gradient(90deg, #1B1C1C 0%, #2F2F2F 100%)",
  "linear-gradient(90deg, #1C6B68 0%, #2F2F2F 100%)",
  "linear-gradient(90deg, #0D5B57 0%, #2F2F2F 100%)",
  "linear-gradient(90deg, #2F2F2F 0%, #1C6B68 100%)",
  "linear-gradient(90deg, #1B1C1C 0%, #0D5B57 100%)",
];

const homeActions = [
  {
    label: "Lista proiecte",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 7V5a2 2 0 0 1 2-2h3.5l2 3H21" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "projects",
  },
  {
    label: "KMS",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 4v16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 4v16" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "kms",
  },
  {
    label: "Monitorizare Calitate",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "quality",
  },
  {
    label: "Importuri baze de date",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "imports",
  },
  {
    label: "Management useri",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "users",
  },
  {
    label: "Creează Survey",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "create",
  },
  {
    label: "Lista Survey-uri",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "list",
  },
  {
    label: "Rapoarte",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 17v-6M12 17v-2M17 17v-8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mode: "reports",
  },
];

function App() {
  const [mode, setMode] = useState<
    | "none"
    | "create"
    | "list"
    | "edit"
    | "reports"
    | "quality"
    | "projects"
    | "kms"
    | "imports"
    | "users"
  >("none");
  const [editSurvey, setEditSurvey] = useState<Survey | null>(null);

  const [user, setUser] = useState<{ username: string; role: UserRole } | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const userRole: UserRole = user?.role || "Consultant";
  const surveys: Survey[] = JSON.parse(localStorage.getItem("surveys") || "[]");

  const handleEdit = (id: string) => {
    const survey = surveys.find((s) => s.id === id);
    setEditSurvey(survey || null);
    setMode("edit");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest survey?")) {
      const updated = surveys.filter((s) => s.id !== id);
      localStorage.setItem("surveys", JSON.stringify(updated));
      window.location.reload();
    }
  };

  const handleShowLink = (id: string) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      const link = `${window.location.origin}/survey/${encodeURIComponent(
        survey.name.replace(/\s+/g, "-").toLowerCase()
      )}`;
      window.prompt("Link chestionar:", link);
    }
  };

  const handleLogin = (user: { username: string; role: UserRole }) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMode("none");
  };

  useEffect(() => {
    if (!user) return;
    let timeout = setTimeout(handleLogout, 15 * 60 * 1000);
    const reset = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleLogout, 15 * 60 * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
    // eslint-disable-next-line
  }, [user]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="home-dashboard-bg">
      <header
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 24px",
          background: "#1B1C1C",
          boxShadow: "0 2px 8px 0 #0002",
        }}
      >
        <Logo />
        <span
          className="metal-title"
          style={{
            marginLeft: 8,
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Lioran - KMS & CRM AiRT
        </span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#1C6B68", fontWeight: 600 }}>
          {user.username} ({user.role})
        </span>
        <button
          style={{
            marginLeft: 18,
            fontWeight: 600,
            fontSize: 12,
            padding: "4px 14px",
            borderRadius: 8,
            border: "none",
            background: "#1C6B68",
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 8px #1C6B6840",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <div className="survey-builder-container">
        {mode === "none" && (
          <div className="dashboard-cards-rect">
            {homeActions.map((action, idx) => (
              <div
                key={action.mode}
                className="dashboard-card-rect"
                tabIndex={0}
                style={{
                  background: cardShades[idx % cardShades.length],
                  minWidth: 280,
                  maxWidth: 340,
                  minHeight: 54,
                  maxHeight: 64,
                  flex: "1 1 320px",
                  padding: "0 16px",
                  boxShadow: "0 2px 8px 0 #0D5B5740",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                  border: "1.5px solid #1C6B68",
                  overflow: "hidden",
                  position: "relative",
                  margin: 0,
                }}
                onClick={() => setMode(action.mode as any)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") setMode(action.mode as any);
                }}
              >
                <span
                  style={{
                    marginRight: 16,
                    width: 32,
                    height: 32,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: "drop-shadow(0 0 2px #1C6B68)",
                    transition: "color 0.2s",
                  }}
                >
                  {action.icon}
                </span>
                <span
                  className="label"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "left",
                    letterSpacing: 0.5,
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                    textShadow: "0 1px 0 #0D5B57",
                  }}
                >
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        )}
        {mode === "projects" && (
          <ListaProiecte
            onBack={() => setMode("none")}
            onHome={() => setMode("none")}
          />
        )}
        {mode === "create" && (
          <SurveyBuilder
            onBack={() => setMode("none")}
            onHome={() => setMode("none")}
            onSave={() => setMode("none")}
          />
        )}
        {mode === "edit" && editSurvey && (
          <SurveyBuilder
            initialSurvey={editSurvey}
            onBack={() => setMode("list")}
            onHome={() => setMode("none")}
            onSave={() => setMode("list")}
          />
        )}
        {mode === "list" && (
          <SurveyList
            surveys={surveys}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowLink={handleShowLink}
            userRole={userRole}
            onBack={() => setMode("none")}
            onHome={() => setMode("none")}
          />
        )}
        {mode === "reports" && <Reports onBack={() => setMode("none")} onHome={() => setMode("none")} />}
        {mode === "quality" && <QualityMonitor onBack={() => setMode("none")} onHome={() => setMode("none")} />}
        {mode === "users" && <ManagementUseri onBack={() => setMode("none")} onHome={() => setMode("none")} />}
        {mode === "imports" && <ImporturiBazeDate onBack={() => setMode("none")} onHome={() => setMode("none")} />}
        {mode === "kms" && <KMS onBack={() => setMode("none")} onHome={() => setMode("none")} />}
      </div>
    </div>
  );
}

export default App;