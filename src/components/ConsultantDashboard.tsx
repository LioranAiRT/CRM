import React from "react";
import NavButtons from "./NavButtons";

const ConsultantDashboard = ({ onHome }: { onHome?: () => void }) => (
  <div style={{ position: "relative", paddingTop: 40 }}>
    <NavButtons onHome={onHome} />
    <h2>Dashboard Consultant</h2>
    <h3>Evaluările mele</h3>
    <div>Media lunară (ultimele 3 luni): <b>8.5</b></div>
    <ul>
      <li>Fișă evaluare 1 <button style={{ fontSize: 12 }}>Deschide</button></li>
      <li>Fișă evaluare 2 <button style={{ fontSize: 12 }}>Deschide</button></li>
    </ul>
    <h3>Obiective de performanță</h3>
    <div>Target achievement ultimele 6 luni: <b>92%</b></div>
    <h3>Analiză</h3>
    <div style={{ fontFamily: "monospace" }}>
      <div>Mai 2024: ████████ 80%</div>
      <div>Apr 2024: ██████ 60%</div>
      <div>Mar 2024: █████████ 90%</div>
    </div>
  </div>
);

export default ConsultantDashboard;