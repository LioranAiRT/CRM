import React from "react";

type Props = {
  onBack?: () => void;
  onHome?: () => void;
};

const NavButtons = ({ onBack, onHome }: Props) => (
  <div style={{
    position: "absolute",
    top: 10,
    left: 10,
    display: "flex",
    gap: 6,
    zIndex: 10
  }}>
    {onBack && (
      <button
        onClick={onBack}
        style={{
          fontSize: 13,
          padding: "2px 8px",
          borderRadius: 6,
          border: "1px solid #E67E22",
          background: "#E67E22",
          color: "#fff",
          cursor: "pointer",
          minWidth: 32
        }}
        title="Înapoi"
      >
        ←
      </button>
    )}
    {onHome && (
      <button
        onClick={onHome}
        style={{
          fontSize: 13,
          padding: "2px 8px",
          borderRadius: 6,
          border: "1px solid #1C6B68",
          background: "#1C6B68",
          color: "#fff",
          cursor: "pointer",
          minWidth: 32
        }}
        title="Acasă"
      >
        <span role="img" aria-label="home">🏠</span>
      </button>
    )}
  </div>
);

export default NavButtons;