import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/global.css';

const PlaneSVG = ({ className, style }) => (
  <svg className={className} style={style} width="88" height="88" viewBox="0 0 24 24"
    fill="none" stroke="#5a9d6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9" />
  </svg>
);

const ParachuteSVG = ({ className, style }) => (
  <svg className={className} style={style} width="70" height="86" viewBox="0 0 24 30">
    <path d="M2 14 Q12 2 22 14 Z" fill="rgba(90,157,106,0.18)" stroke="#5a9d6a" strokeWidth="1.4" strokeLinejoin="round" />
    <line x1="7"  y1="14" x2="12" y2="22" stroke="#5a9d6a" strokeWidth="1" strokeLinecap="round" />
    <line x1="12" y1="14" x2="12" y2="22" stroke="#5a9d6a" strokeWidth="1" strokeLinecap="round" />
    <line x1="17" y1="14" x2="12" y2="22" stroke="#5a9d6a" strokeWidth="1" strokeLinecap="round" />
    <circle cx="12" cy="24" r="2" fill="#5a9d6a" />
  </svg>
);

export default function AdminPanel() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tables');
  const [newGuest, setNewGuest] = useState({ name: '', dietary: '', notes: '' });
  const [newTableForm, setNewTableForm] = useState({ tableNumber: '', capacity: 8 });
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editingGuestName, setEditingGuestName] = useState('');
  const [selectedTableForGuest, setSelectedTableForGuest] = useState('');

  // Guest context menu
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Table capacity context menu
  const [tableMenu, setTableMenu] = useState(null); // { tableNumber, x, y }
  const [editingCapacity, setEditingCapacity] = useState('');

  // Global indoor/outdoor location (applies to all tables)
  const [globalLocation, setGlobalLocation] = useState(
    () => localStorage.getItem('globalLocation') || 'exterior'
  );

  const longPressRef = useRef(null);
  const tableLongPressRef = useRef(null);

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Global location toggle ──────────────────────────────────────
  const toggleGlobalLocation = () => {
    const next = globalLocation === 'exterior' ? 'interior' : 'exterior';
    setGlobalLocation(next);
    localStorage.setItem('globalLocation', next);
    // Also write per-table keys so Table.jsx picks it up
    const perTable = {};
    tables.forEach(t => { perTable[t.tableNumber] = next; });
    localStorage.setItem('tableLocations', JSON.stringify(perTable));
  };

  // ── Guest context menu ──────────────────────────────────────────
  const openContextMenu = (x, y, guestName, tableNumber) => {
    setSelectedGuest({ guestName, tableNumber });
    setContextMenu({ x, y });
  };
  const closeContextMenu = () => { setContextMenu(null); setSelectedGuest(null); };

  const handleTouchStart = (e, guestName, tableNumber) => {
    const touch = e.touches[0];
    const x = touch.clientX, y = touch.clientY;
    longPressRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      openContextMenu(x, y, guestName, tableNumber);
      longPressRef.current = null;
    }, 600);
  };
  const cancelLongPress = () => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  };

  const handleEditFromContextMenu = () => {
    if (!selectedGuest) return;
    const table = tables.find(t => t.tableNumber === selectedGuest.tableNumber);
    if (!table) { closeContextMenu(); return; }
    const idx = table.guests.findIndex(g => g.name === selectedGuest.guestName);
    if (idx === -1) { closeContextMenu(); return; }
    setEditingGuestId(`${selectedGuest.tableNumber}-${idx}`);
    setEditingGuestName(selectedGuest.guestName);
    closeContextMenu();
  };

  const handleDeleteFromContextMenu = async () => {
    if (!selectedGuest) return;
    const { guestName, tableNumber } = selectedGuest;
    closeContextMenu();
    if (!window.confirm(`Ești sigur că vrei să ștergi ${guestName}?`)) return;
    try {
      await axios.delete(`/api/tables/${tableNumber}/guests/${guestName}`);
      fetchTables();
    } catch (error) {
      alert('Eroare la ștergerea invitatului!');
    }
  };

  const handleMoveGuest = async (newTableNumber) => {
    if (!selectedGuest) return;
    try {
      await axios.delete(`/api/tables/${selectedGuest.tableNumber}/guests/${selectedGuest.guestName}`);
      await axios.post(`/api/tables/${newTableNumber}/guests`, { name: selectedGuest.guestName, dietary: '', notes: '' });
      closeContextMenu();
      fetchTables();
    } catch (error) {
      alert('Eroare la mutarea invitatului!');
    }
  };

  // ── Table capacity context menu ─────────────────────────────────
  const openTableMenu = (x, y, tableNumber, currentCapacity) => {
    setEditingCapacity(String(currentCapacity));
    setTableMenu({ tableNumber, x, y });
  };
  const closeTableMenu = () => setTableMenu(null);

  const handleTableTouchStart = (e, tableNumber, capacity) => {
    const touch = e.touches[0];
    const x = touch.clientX, y = touch.clientY;
    tableLongPressRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      openTableMenu(x, y, tableNumber, capacity);
      tableLongPressRef.current = null;
    }, 600);
  };
  const cancelTableLongPress = () => {
    if (tableLongPressRef.current) { clearTimeout(tableLongPressRef.current); tableLongPressRef.current = null; }
  };

  const handleUpdateCapacity = async () => {
    if (!tableMenu) return;
    const cap = parseInt(editingCapacity);
    if (!cap || cap < 1) { alert('Capacitate invalidă!'); return; }
    try {
      await axios.put(`/api/tables/${tableMenu.tableNumber}`, { capacity: cap });
      closeTableMenu();
      fetchTables();
    } catch (error) {
      alert('Eroare la modificarea capacității!');
    }
  };

  // ── Guest CRUD ──────────────────────────────────────────────────
  const handleAddGuest = async (tableNumber) => {
    if (!newGuest.name.trim()) { alert('Te rog introdu un nume!'); return; }
    try {
      await axios.post(`/api/tables/${tableNumber}/guests`, newGuest);
      setNewGuest({ name: '', dietary: '', notes: '' });
      fetchTables();
    } catch (error) {
      alert('Eroare la adăugarea invitatului!');
    }
  };

  const handleEditGuest = async (tableNumber, oldName, newName) => {
    if (!newName.trim()) { alert('Te rog introdu un nume!'); return; }
    try {
      await axios.delete(`/api/tables/${tableNumber}/guests/${oldName}`);
      await axios.post(`/api/tables/${tableNumber}/guests`, { name: newName, dietary: '', notes: '' });
      setEditingGuestId(null);
      setEditingGuestName('');
      fetchTables();
    } catch (error) {
      alert('Eroare la modificarea invitatului!');
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTableForm.tableNumber) { alert('Te rog introdu numărul mesei!'); return; }
    try {
      await axios.post('/api/tables', {
        tableNumber: parseInt(newTableForm.tableNumber),
        capacity: parseInt(newTableForm.capacity)
      });
      // Persist global location for newly created table
      const stored = JSON.parse(localStorage.getItem('tableLocations') || '{}');
      stored[newTableForm.tableNumber] = globalLocation;
      localStorage.setItem('tableLocations', JSON.stringify(stored));

      setNewTableForm({ tableNumber: '', capacity: 8 });
      fetchTables();
      alert('Masă creată cu succes!');
    } catch (error) {
      alert('Eroare la crearea mesei!');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ width: '36px', height: '36px', border: '2px solid rgba(90,157,106,0.15)', borderTop: '2px solid #5a9d6a', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 20px' }} />
        <p style={{ color: '#5a9d6a', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: '300' }}>Se încarcă</p>
      </div>
    );
  }

  const TABS = [
    { key: 'tables',      label: `Mese (${tables.length})` },
    { key: 'addGuest',    label: '+ Invitat' },
    { key: 'createTable', label: '+ Masă' },
  ];

  const menuW = 230, menuH = 400;
  const cmX = contextMenu ? (contextMenu.x + menuW > window.innerWidth  ? contextMenu.x - menuW : contextMenu.x) : 0;
  const cmY = contextMenu ? (contextMenu.y + menuH > window.innerHeight ? contextMenu.y - menuH : contextMenu.y) : 0;
  const tmX = tableMenu ? (tableMenu.x + 260 > window.innerWidth  ? tableMenu.x - 260 : tableMenu.x) : 0;
  const tmY = tableMenu ? (tableMenu.y + 200 > window.innerHeight ? tableMenu.y - 200 : tableMenu.y) : 0;

  return (
    <div className="container responsive" style={{ paddingTop: '50px', paddingBottom: '80px' }}>

      {/* Header */}
      <div className="header" style={{ paddingTop: '50px', paddingBottom: '36px', marginBottom: '32px' }}>
        <PlaneSVG  className="decor-plane"   style={{ top: '8px',   right: '5%' }} />
        <PlaneSVG  className="decor-plane-2" style={{ bottom: '16px', left: '4%', width: '52px', height: '52px' }} />
        <ParachuteSVG className="decor-chute" style={{ top: '16px', left: '7%' }} />
        <p style={{ fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.55, marginBottom: '14px', fontWeight: '500' }}>
          Maria &amp; Andrei
        </p>
        <h1 className="handwriting" style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', marginBottom: '0' }}>
          Panou Admin
        </h1>
        <div className="ornament-divider" style={{ margin: '22px auto 0' }}>
          <span>✦</span>
        </div>
      </div>

      {/* ── Global location toggle ─────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '16px',
          background: 'rgba(255,255,255,0.85)',
          padding: '14px 28px', borderRadius: '20px',
          border: '1px solid rgba(90,157,106,0.14)',
          boxShadow: '0 4px 20px rgba(90,157,106,0.08)'
        }}>
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.5, margin: '0 0 2px' }}>
              Locație globală mese
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2a3a33', margin: 0, letterSpacing: '0.5px' }}>
              {globalLocation === 'exterior' ? 'Afară' : 'Interior'}
            </p>
          </div>

          <div
            onClick={toggleGlobalLocation}
            title="Schimbă locația pentru toate mesele"
            style={{
              width: '56px', height: '28px', borderRadius: '14px',
              background: globalLocation === 'interior'
                ? 'linear-gradient(135deg, #5a9d6a, #7db885)'
                : 'linear-gradient(135deg, #c9a96e, #ddb96e)',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.4s ease',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{
              position: 'absolute', top: '4px',
              left: globalLocation === 'interior' ? '30px' : '4px',
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)'
            }} />
          </div>

          <span style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.45 }}>
            {globalLocation === 'exterior' ? 'Interior' : 'Afară'}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex', background: 'rgba(232,243,237,0.5)', borderRadius: '16px',
          padding: '5px', gap: '4px', border: '1px solid rgba(90,157,106,0.1)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)'
        }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              background: activeTab === key ? 'linear-gradient(135deg, #5a9d6a, #7db885)' : 'transparent',
              color: activeTab === key ? '#fff' : '#5a9d6a',
              border: 'none', padding: '10px 22px', borderRadius: '12px',
              fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.3s ease', letterSpacing: '1.5px', textTransform: 'uppercase',
              boxShadow: activeTab === key ? '0 4px 14px rgba(90,157,106,0.28)' : 'none', whiteSpace: 'nowrap'
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Add Guest form ──────────────────────────────────────── */}
      {activeTab === 'addGuest' && (
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.55, marginBottom: '10px', textAlign: 'center' }}>
            Gestionare
          </p>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontStyle: 'italic', fontSize: '2rem', color: '#3d7a50', textAlign: 'center', marginBottom: '28px' }}>
            Adaugă Invitat
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedTableForGuest) {
              handleAddGuest(parseInt(selectedTableForGuest));
              setSelectedTableForGuest('');
              setNewGuest({ name: '', dietary: '', notes: '' });
            }
          }}>
            <select value={selectedTableForGuest} onChange={(e) => setSelectedTableForGuest(e.target.value)}>
              <option value="">Selectează o masă...</option>
              {tables.map((table) => (
                <option key={table._id} value={table.tableNumber}>
                  Masa {table.tableNumber} ({table.guests.length}/{table.capacity} invitați)
                </option>
              ))}
            </select>
            <input type="text" placeholder="Nume invitat" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} />
            <input type="text" placeholder="Restricții alimentare (opțional)" value={newGuest.dietary} onChange={(e) => setNewGuest({ ...newGuest, dietary: e.target.value })} />
            <textarea placeholder="Note (opțional)" value={newGuest.notes} onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })} rows="3" style={{ marginBottom: '8px' }} />
            <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Adaugă Invitat</button>
          </form>
        </div>
      )}

      {/* ── Create Table form ───────────────────────────────────── */}
      {activeTab === 'createTable' && (
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.55, marginBottom: '10px', textAlign: 'center' }}>
            Gestionare
          </p>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontStyle: 'italic', fontSize: '2rem', color: '#3d7a50', textAlign: 'center', marginBottom: '28px' }}>
            Masă Nouă
          </h2>
          <form onSubmit={handleCreateTable}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.7, fontWeight: '600' }}>
              Numărul mesei
            </label>
            <input
              type="number"
              placeholder="ex. 5"
              value={newTableForm.tableNumber}
              onChange={(e) => setNewTableForm({ ...newTableForm, tableNumber: e.target.value })}
              style={{ marginTop: 0 }}
            />

            <label style={{ display: 'block', marginTop: '8px', marginBottom: '4px', fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.7, fontWeight: '600' }}>
              Capacitate (număr de locuri)
            </label>
            <input
              type="number"
              placeholder="ex. 8"
              value={newTableForm.capacity}
              onChange={(e) => setNewTableForm({ ...newTableForm, capacity: e.target.value })}
              min="1"
              style={{ marginTop: 0 }}
            />

            <p style={{ fontSize: '0.72rem', color: '#5a9d6a', opacity: 0.5, marginTop: '8px', fontStyle: 'italic' }}>
              Locație implicită: <strong>{globalLocation === 'exterior' ? 'Afară' : 'Interior'}</strong> (din setarea globală)
            </p>

            <button type="submit" style={{ marginTop: '20px', width: '100%' }}>Crează Masă</button>
          </form>
        </div>
      )}

      {/* ── Tables list ─────────────────────────────────────────── */}
      {activeTab === 'tables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tables.map((table) => {
            const fillPct = Math.min((table.guests.length / table.capacity) * 100, 100);
            const isFull = table.guests.length >= table.capacity;

            return (
              <div key={table._id} className="card" style={{ padding: '32px 28px' }}>

                {/* Table header — right-click or long-press to edit capacity */}
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    openTableMenu(e.clientX, e.clientY, table.tableNumber, table.capacity);
                  }}
                  onTouchStart={(e) => handleTableTouchStart(e, table.tableNumber, table.capacity)}
                  onTouchEnd={cancelTableLongPress}
                  onTouchMove={cancelTableLongPress}
                  style={{ cursor: 'context-menu', userSelect: 'none', WebkitUserSelect: 'none', marginBottom: '8px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <h2 style={{ fontFamily: "'Caveat', cursive", fontStyle: 'italic', fontSize: '2.1rem', color: '#3d7a50', margin: 0, lineHeight: '1' }}>
                      Masa {table.tableNumber}
                    </h2>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.5 }}>
                      apăsați lung pentru a edita
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.6, fontWeight: '400', marginTop: '4px' }}>
                    {table.guests.length} / {table.capacity} invitați
                  </p>
                </div>

                {/* Capacity bar */}
                <div style={{ marginBottom: '24px', marginTop: '12px' }}>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(90,157,106,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${fillPct}%`, background: isFull ? 'linear-gradient(90deg,#c62828,#e53935)' : 'linear-gradient(90deg,#5a9d6a,#7db885)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                {/* Guest list */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg,rgba(232,243,237,0.4),rgba(255,255,255,0.7))', borderRadius: '14px', border: '1px solid rgba(90,157,106,0.08)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <p style={{ fontSize: '0.68rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.6, fontWeight: '600' }}>
                      Invitați
                    </p>
                    {table.guests.length > 0 && (
                      <p style={{ fontSize: '0.62rem', color: '#5a9d6a', opacity: 0.38, fontStyle: 'italic' }}>
                        click dreapta / apăsați lung
                      </p>
                    )}
                  </div>

                  {table.guests.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {table.guests.map((guest, idx) => (
                        <li
                          key={idx}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openContextMenu(e.clientX, e.clientY, guest.name, table.tableNumber);
                          }}
                          onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, guest.name, table.tableNumber); }}
                          onTouchEnd={(e) => { e.stopPropagation(); cancelLongPress(); }}
                          onTouchMove={(e) => { e.stopPropagation(); cancelLongPress(); }}
                          style={{ padding: '12px 16px', background: '#fff', borderRadius: '10px', border: '1px solid rgba(90,157,106,0.08)', cursor: 'context-menu', userSelect: 'none', WebkitUserSelect: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
                        >
                          {editingGuestId === `${table.tableNumber}-${idx}` ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="text" value={editingGuestName}
                                onChange={(e) => setEditingGuestName(e.target.value)}
                                style={{ flex: 1, padding: '7px 10px', fontSize: '0.9rem', borderRadius: '8px', margin: 0 }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditGuest(table.tableNumber, guest.name, editingGuestName);
                                  if (e.key === 'Escape') setEditingGuestId(null);
                                }}
                              />
                              <button onClick={() => handleEditGuest(table.tableNumber, guest.name, editingGuestName)}
                                style={{ background: 'linear-gradient(135deg,#5a9d6a,#7db885)', color: '#fff', padding: '7px 14px', fontSize: '0.72rem', borderRadius: '8px', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                                Salvează
                              </button>
                              <button onClick={() => setEditingGuestId(null)}
                                style={{ background: 'transparent', color: '#999', border: '1px solid rgba(0,0,0,0.12)', padding: '7px 12px', fontSize: '0.72rem', borderRadius: '8px', boxShadow: 'none', letterSpacing: '1px' }}>
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div>
                              <strong style={{ color: '#2a3a33', fontSize: '0.95rem', fontWeight: '600' }}>{guest.name}</strong>
                              {guest.dietary && <p style={{ fontSize: '0.78rem', color: '#5a9d6a', marginTop: '2px', opacity: 0.7 }}>{guest.dietary}</p>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#aab', fontStyle: 'italic', fontSize: '0.88rem', opacity: 0.7 }}>Niciun invitat adăugat</p>
                  )}
                </div>

                {/* Inline add guest */}
                {!isFull && (
                  <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', border: '1px dashed rgba(90,157,106,0.25)' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.55, marginBottom: '12px', fontWeight: '600' }}>
                      Adaugă Invitat
                    </p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <input
                        type="text" placeholder="Nume"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                        style={{ margin: 0, flex: '1 auto', width: 'auto', minWidth: 0 }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGuest(table.tableNumber); } }}
                      />
                      <button onClick={() => handleAddGuest(table.tableNumber)} style={{ padding: '14px 20px', fontSize: '0.75rem', letterSpacing: '1.5px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Adaugă
                      </button>
                    </div>
                  </div>
                )}

                {isFull && (
                  <p style={{ textAlign: 'center', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c62828', opacity: 0.6, fontWeight: '500' }}>
                    Masă completă
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Guest context menu ──────────────────────────────────── */}
      {contextMenu && selectedGuest && (
        <>
          <div onClick={closeContextMenu} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
          <div style={{ position: 'fixed', top: `${cmY}px`, left: `${cmX}px`, background: '#fff', border: '1px solid rgba(90,157,106,0.15)', borderRadius: '16px', boxShadow: '0 16px 48px rgba(90,157,106,0.16),0 2px 8px rgba(0,0,0,0.06)', zIndex: 1000, minWidth: '220px', overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', background: 'rgba(232,243,237,0.45)', borderBottom: '1px solid rgba(90,157,106,0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.62rem', color: '#5a9d6a', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>Opțiuni</p>
              <p style={{ margin: '3px 0 0', fontSize: '0.95rem', color: '#2a3a33', fontWeight: '700' }}>{selectedGuest.guestName}</p>
            </div>

            {/* Move */}
            <div style={{ padding: '10px 18px 6px', borderBottom: '1px solid rgba(90,157,106,0.06)' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.6rem', color: '#5a9d6a', letterSpacing: '2.5px', textTransform: 'uppercase', opacity: 0.45, fontWeight: '600' }}>Mută la...</p>
              {(() => {
                const available = tables.filter(t => t.tableNumber !== selectedGuest.tableNumber && t.guests.length < t.capacity);
                return available.length > 0 ? (
                  <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {available.map(t => (
                      <div key={t._id} onClick={() => handleMoveGuest(t.tableNumber)}
                        style={{ padding: '7px 4px', cursor: 'pointer', color: '#2a3a33', fontSize: '0.88rem', transition: 'color 0.15s', borderBottom: '1px solid rgba(90,157,106,0.04)', display: 'flex', justifyContent: 'space-between' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#5a9d6a'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#2a3a33'}>
                        <span>Masa {t.tableNumber}</span>
                        <span style={{ fontSize: '0.78rem', opacity: 0.45 }}>{t.guests.length}/{t.capacity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: '#aaa', fontStyle: 'italic', paddingBottom: '6px', margin: 0 }}>Nu există locuri disponibile</p>
                );
              })()}
            </div>

            <div onClick={handleEditFromContextMenu}
              style={{ padding: '12px 18px', cursor: 'pointer', color: '#5a9d6a', fontSize: '0.88rem', fontWeight: '500', transition: 'background 0.15s', borderBottom: '1px solid rgba(90,157,106,0.06)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232,243,237,0.45)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              Editează
            </div>

            <div onClick={handleDeleteFromContextMenu}
              style={{ padding: '12px 18px', cursor: 'pointer', color: '#c62828', fontSize: '0.88rem', fontWeight: '500', transition: 'background 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(198,40,40,0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              Șterge
            </div>
          </div>
        </>
      )}

      {/* ── Table capacity context menu ─────────────────────────── */}
      {tableMenu && (
        <>
          <div onClick={closeTableMenu} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{ position: 'fixed', top: `${tmY}px`, left: `${tmX}px`, background: '#fff', border: '1px solid rgba(90,157,106,0.15)', borderRadius: '18px', boxShadow: '0 16px 48px rgba(90,157,106,0.16),0 2px 8px rgba(0,0,0,0.06)', zIndex: 999, padding: '24px', minWidth: '240px' }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.55, marginBottom: '4px' }}>
              Masa {tableMenu.tableNumber}
            </p>
            <p style={{ fontSize: '1rem', fontWeight: '700', color: '#2a3a33', marginBottom: '20px' }}>
              Modifică capacitatea
            </p>

            <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5a9d6a', opacity: 0.6, marginBottom: '6px', fontWeight: '600' }}>
              Număr de locuri
            </label>
            <input
              type="number"
              value={editingCapacity}
              onChange={(e) => setEditingCapacity(e.target.value)}
              min="1"
              max="100"
              autoFocus
              style={{ margin: 0, textAlign: 'center', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateCapacity();
                if (e.key === 'Escape') closeTableMenu();
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleUpdateCapacity} style={{ flex: 1, padding: '12px' }}>Salvează</button>
              <button onClick={closeTableMenu} style={{ flex: 0, padding: '12px 16px', background: 'transparent', color: '#5a9d6a', border: '1px solid rgba(90,157,106,0.3)', boxShadow: 'none' }}>Anulează</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
