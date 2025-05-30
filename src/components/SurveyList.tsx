import React from "react";
import NavButtons from "./NavButtons";

export type SurveyMeta = {
  id: string;
  name: string;
};

export type UserRole = "Owner" | "Editor" | "Consultant";

export type SurveyListProps = {
  surveys: SurveyMeta[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShowLink: (id: string) => void;
  userRole: UserRole;
  onBack?: () => void;
  onHome?: () => void;
};

const SurveyList: React.FC<SurveyListProps> = ({
  surveys,
  onEdit,
  onDelete,
  onShowLink,
  userRole,
  onBack,
  onHome,
}) => (
  <div style={{ position: "relative", paddingTop: 40 }}>
    <NavButtons onBack={onBack} onHome={onHome} />
    <h2>Lista Survey-uri</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {surveys.map((s) => (
        <li
          key={s.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            borderBottom: "1px solid #1C6B68",
            paddingBottom: 8,
          }}
        >
          <b>{s.name}</b>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{ fontSize: 12, padding: "4px 10px" }}
              onClick={() => onEdit(s.id)}
            >
              Editează
            </button>
            {(userRole === "Owner" || userRole === "Editor") && (
              <button
                style={{ fontSize: 12, padding: "4px 10px" }}
                onClick={() => onDelete(s.id)}
              >
                Șterge Survey
              </button>
            )}
            <button
              style={{ fontSize: 12, padding: "4px 10px" }}
              onClick={() => onShowLink(s.id)}
            >
              Afișează link
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default SurveyList;