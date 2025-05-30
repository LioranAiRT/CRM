import React, { useState } from "react";
import NavButtons from "./NavButtons";

const mockUsers = [
  {
    id: 1,
    nume: "Popescu",
    prenume: "Ion",
    teamLeader: "TL1",
    proiect: "Proiect A",
    clasa: "Editor",
    status: "Activ",
    telefon: "0712345678",
    adSmart: "ion.popescu",
  },
  {
    id: 2,
    nume: "Ionescu",
    prenume: "Maria",
    teamLeader: "TL2",
    proiect: "Proiect B",
    clasa: "Consultant",
    status: "Inactiv",
    telefon: "0722333444",
    adSmart: "maria.ionescu",
  },
];

const claseAcces = ["Owner", "Editor", "Consultant"];

const ManagementUseri = ({ onBack, onHome }: { onBack?: () => void; onHome?: () => void }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState({
    nume: "",
    teamLeader: "",
    proiect: "",
    clasa: "",
    status: "",
    telefon: "",
  });

  const [users, setUsers] = useState(mockUsers);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // Form state pentru creare cont
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    teamLeader: "",
    proiect: "",
    telefon: "",
    adOrange: "",
    adSmart: "",
    clasa: "",
  });

  const handleCreate = () => {
    if (!form.nume || !form.prenume || !form.telefon || !form.adSmart) {
      alert("Completează toate câmpurile obligatorii!");
      return;
    }
    setUsers([
      ...users,
      {
        ...form,
        id: users.length + 1,
        status: "Activ",
      },
    ]);
    setShowCreate(false);
    setForm({
      nume: "",
      prenume: "",
      teamLeader: "",
      proiect: "",
      telefon: "",
      adOrange: "",
      adSmart: "",
      clasa: "",
    });
  };

  const handleEditSave = () => {
    setUsers(users.map(u => u.id === editId ? { ...u, ...editForm } : u));
    setEditId(null);
    setEditForm(null);
  };

  // Filtrare simplă
  const filtered = users.filter((u) =>
    (!search.nume || u.nume.toLowerCase().includes(search.nume.toLowerCase())) &&
    (!search.teamLeader || u.teamLeader.toLowerCase().includes(search.teamLeader.toLowerCase())) &&
    (!search.proiect || u.proiect.toLowerCase().includes(search.proiect.toLowerCase())) &&
    (!search.clasa || u.clasa === search.clasa) &&
    (!search.status || u.status === search.status) &&
    (!search.telefon || u.telefon.includes(search.telefon))
  );

  return (
    <div style={{ position: "relative", paddingTop: 40 }}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <h2>Management useri</h2>
      <button onClick={() => setShowCreate(true)} style={{ marginBottom: 12 }}>
        Creează cont
      </button>
      {showCreate && (
        <div style={{ border: "1px solid #1C6B68", padding: 16, marginBottom: 16, borderRadius: 8, maxWidth: 400 }}>
          <h3>Creează cont nou</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              placeholder="Nume*"
              value={form.nume}
              onChange={e => setForm({ ...form, nume: e.target.value })}
            />
            <input
              placeholder="Prenume*"
              value={form.prenume}
              onChange={e => setForm({ ...form, prenume: e.target.value })}
            />
            <input
              placeholder="Team Leader"
              value={form.teamLeader}
              onChange={e => setForm({ ...form, teamLeader: e.target.value })}
            />
            <input
              placeholder="Proiect"
              value={form.proiect}
              onChange={e => setForm({ ...form, proiect: e.target.value })}
            />
            <input
              placeholder="Număr de telefon*"
              value={form.telefon}
              onChange={e => setForm({ ...form, telefon: e.target.value })}
            />
            <input
              placeholder="AD Orange"
              value={form.adOrange}
              onChange={e => setForm({ ...form, adOrange: e.target.value })}
            />
            <input
              placeholder="AD Smart*"
              value={form.adSmart}
              onChange={e => setForm({ ...form, adSmart: e.target.value })}
            />
            <select
              value={form.clasa}
              onChange={e => setForm({ ...form, clasa: e.target.value })}
            >
              <option value="">Clasa acces</option>
              {claseAcces.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button onClick={handleCreate}>Salvează</button>
            <button onClick={() => setShowCreate(false)}>Renunță</button>
          </div>
        </div>
      )}
      {/* Filtre */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Nume"
          value={search.nume}
          onChange={e => setSearch({ ...search, nume: e.target.value })}
        />
        <input
          placeholder="Team Leader"
          value={search.teamLeader}
          onChange={e => setSearch({ ...search, teamLeader: e.target.value })}
        />
        <input
          placeholder="Proiect"
          value={search.proiect}
          onChange={e => setSearch({ ...search, proiect: e.target.value })}
        />
        <select
          value={search.clasa}
          onChange={e => setSearch({ ...search, clasa: e.target.value })}
        >
          <option value="">Clasa acces</option>
          {claseAcces.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={search.status}
          onChange={e => setSearch({ ...search, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="Activ">Activ</option>
          <option value="Inactiv">Inactiv</option>
        </select>
        <input
          placeholder="Telefon"
          value={search.telefon}
          onChange={e => setSearch({ ...search, telefon: e.target.value })}
        />
      </div>
      {/* Tabel nominal */}
      <div style={{ maxHeight: 350, overflow: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              <th>Nume și Prenume</th>
              <th>Team Leader</th>
              <th>Proiect</th>
              <th>Clasa acces</th>
              <th>Status</th>
              <th>Telefon</th>
              <th style={{ textAlign: "right" }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  {editId === u.id ? (
                    <input value={editForm.nume} onChange={e => setEditForm({ ...editForm, nume: e.target.value })} />
                  ) : (
                    `${u.nume} ${u.prenume}`
                  )}
                </td>
                <td>
                  {editId === u.id ? (
                    <input value={editForm.teamLeader} onChange={e => setEditForm({ ...editForm, teamLeader: e.target.value })} />
                  ) : (
                    u.teamLeader
                  )}
                </td>
                <td>
                  {editId === u.id ? (
                    <input value={editForm.proiect} onChange={e => setEditForm({ ...editForm, proiect: e.target.value })} />
                  ) : (
                    u.proiect
                  )}
                </td>
                <td>
                  {editId === u.id ? (
                    <select value={editForm.clasa} onChange={e => setEditForm({ ...editForm, clasa: e.target.value })}>
                      {claseAcces.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    u.clasa
                  )}
                </td>
                <td>
                  {editId === u.id ? (
                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                      <option value="Activ">Activ</option>
                      <option value="Inactiv">Inactiv</option>
                    </select>
                  ) : (
                    u.status
                  )}
                </td>
                <td>
                  {editId === u.id ? (
                    <input value={editForm.telefon} onChange={e => setEditForm({ ...editForm, telefon: e.target.value })} />
                  ) : (
                    u.telefon
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  {editId === u.id ? (
                    <>
                      <button style={{ fontSize: 12 }} onClick={handleEditSave}>Salvează</button>
                      <button style={{ fontSize: 12, marginLeft: 4 }} onClick={() => setEditId(null)}>Renunță</button>
                    </>
                  ) : (
                    <button style={{ fontSize: 12 }} onClick={() => { setEditId(u.id); setEditForm(u); }}>Editează</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, fontSize: 13 }}>
        <b>Clase de acces:</b> Owner (drepturi totale), Editor (editare/administrare), Consultant (interfață dedicată)
      </div>
    </div>
  );
};

export default ManagementUseri;