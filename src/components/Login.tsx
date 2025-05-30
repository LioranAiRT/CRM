import React, { useState } from "react";

export type UserRole = "Owner" | "Editor" | "Consultant";

type LoginProps = {
  onLogin: (user: { username: string; role: UserRole }) => void;
};

type User = {
  username: string;
  password: string;
  role: UserRole;
  email: string;
  passwordHistory: string[];
};

const mockUsers: User[] = [
  {
    username: "owner",
    password: "Owner1234!",
    role: "Owner",
    email: "owner@email.com",
    passwordHistory: ["Owner1234!", "Owner2023!", "Owner2022!"],
  },
  {
    username: "editor",
    password: "Editor1234!",
    role: "Editor",
    email: "editor@email.com",
    passwordHistory: ["Editor1234!", "Editor2023!", "Editor2022!"],
  },
  {
    username: "consultant",
    password: "Consultant1!",
    role: "Consultant",
    email: "consultant@email.com",
    passwordHistory: ["Consultant1!", "Consultant2023!", "Consultant2022!"],
  },
];

function validatePassword(pw: string, history: string[]): string | null {
  if (pw.length < 10) return "Parola trebuie să aibă cel puțin 10 caractere.";
  if (!/[a-z]/.test(pw)) return "Parola trebuie să conțină litere mici.";
  if (!/[A-Z]/.test(pw)) return "Parola trebuie să conțină cel puțin o literă mare.";
  if (!/[0-9]/.test(pw)) return "Parola trebuie să conțină cel puțin o cifră.";
  if (!/[.!#$]/.test(pw)) return "Parola trebuie să conțină cel puțin un caracter special (. ! # $).";
  if (history.slice(0, 3).includes(pw)) return "Nu poți folosi o parolă folosită recent (ultimele 3).";
  return null;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showChange, setShowChange] = useState(false);
  const [changeUser, setChangeUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  // Simulare "bază de date" locală
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      onLogin({ username: user.username, role: user.role });
    } else {
      alert("Utilizator sau parolă incorectă!");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === resetEmail);
    if (user) {
      setChangeUser(user);
      setShowChange(true);
      setShowReset(false);
      setResetMsg("");
    } else {
      setResetMsg("Emailul nu a fost găsit!");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setChangeMsg("Parolele nu coincid!");
      return;
    }
    if (!changeUser) return;
    const err = validatePassword(newPassword, changeUser.passwordHistory);
    if (err) {
      setChangeMsg(err);
      return;
    }
    // Update user password & history
    setUsers((prev) =>
      prev.map((u) =>
        u.username === changeUser.username
          ? {
              ...u,
              password: newPassword,
              passwordHistory: [newPassword, ...u.passwordHistory.slice(0, 2)],
            }
          : u
      )
    );
    setChangeMsg("Parola a fost schimbată cu succes!");
    setTimeout(() => {
      setShowChange(false);
      setChangeUser(null);
      setNewPassword("");
      setConfirmPassword("");
      setChangeMsg("");
    }, 2000);
  };

  return (
    <div style={{
      maxWidth: 350,
      margin: "60px auto",
      padding: 24,
      border: "1px solid #1C6B68",
      borderRadius: 10,
      background: "#fff"
    }}>
      <h2 style={{ textAlign: "center" }}>Autentificare</h2>
      {!showReset && !showChange && (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Utilizator"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ background: "#1C6B68", color: "#fff" }}>
            Login
          </button>
          <button
            type="button"
            style={{ fontSize: 13, background: "none", color: "#1C6B68", border: "none", cursor: "pointer" }}
            onClick={() => setShowReset(true)}
          >
            Ai uitat parola?
          </button>
        </form>
      )}
      {showReset && !showChange && (
        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            required
          />
          <button type="submit" style={{ background: "#1C6B68", color: "#fff" }}>
            Trimite resetare parolă
          </button>
          <button
            type="button"
            style={{ fontSize: 13, background: "none", color: "#1C6B68", border: "none", cursor: "pointer" }}
            onClick={() => { setShowReset(false); setResetMsg(""); }}
          >
            Înapoi la login
          </button>
          {resetMsg && <div style={{ color: "#1C6B68", fontSize: 13 }}>{resetMsg}</div>}
        </form>
      )}
      {showChange && changeUser && (
        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Schimbare parolă pentru {changeUser.username}</div>
          <input
            type="password"
            placeholder="Parolă nouă"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmă parola nouă"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <div style={{ fontSize: 12, color: "#888" }}>
            Parola trebuie să conțină minim 10 caractere, litere mici, cel puțin o literă mare, cel puțin o cifră, cel puțin un caracter special (. ! # $) și să nu fie una din ultimele 3 parole folosite.
          </div>
          <button type="submit" style={{ background: "#1C6B68", color: "#fff" }}>
            Schimbă parola
          </button>
          <button
            type="button"
            style={{ fontSize: 13, background: "none", color: "#1C6B68", border: "none", cursor: "pointer" }}
            onClick={() => {
              setShowChange(false);
              setChangeUser(null);
              setNewPassword("");
              setConfirmPassword("");
              setChangeMsg("");
            }}
          >
            Renunță
          </button>
          {changeMsg && <div style={{ color: changeMsg.includes("succes") ? "green" : "red", fontSize: 13 }}>{changeMsg}</div>}
        </form>
      )}
    </div>
  );
};

export default Login;