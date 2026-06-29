import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avionImg from '../../backgroundPhoto/avionMaiBunMaria.JPG';
import parasutistImg from '../../backgroundPhoto/paraMaria.JPG';
import '../styles/global.css';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (name.trim().length > 0) {
      fetchSuggestions(name);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [name]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      const response = await axios.get('/api/tables');
      const allGuests = [];
      response.data.forEach(table => {
        table.guests.forEach(guest => {
          if (guest.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            allGuests.push(guest.name);
          }
        });
      });
      setSuggestions([...new Set(allGuests)].slice(0, 8));
      setShowSuggestions(allGuests.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setName(suggestion);
    setShowSuggestions(false);
    setTimeout(() => performSearch(suggestion), 0);
  };

  const performSearch = async (nameToSearch) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/guests/search/${nameToSearch}`);
      if (response.data) {
        navigate(`/table/${response.data.tableNumber}`, { state: { guest: response.data } });
      }
    } catch (err) {
      setError('Nu te-am găsit în listă. Contactează organizatorul dacă crezi că e o greșeală.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container responsive" style={{ paddingTop: '50px', paddingBottom: '80px' }}>

      {/* Header with aviation decor */}
      <div className="header" style={{ paddingTop: '50px', paddingBottom: '40px', marginBottom: '36px' }}>

        <img src={parasutistImg} alt="" style={{
          position: 'absolute', top: '-10px', right: '2%',
          width: '100px', opacity: 0.18, pointerEvents: 'none'
        }} />

        <img src={avionImg} alt="" style={{
          position: 'absolute', bottom: '10px', left: '2%',
          width: '120px', opacity: 0.18, pointerEvents: 'none'
        }} />

        

        <h1 className="handwriting" style={{ fontSize: 'clamp(2.8rem, 8vw, 4.4rem)', marginBottom: '6px' }}>
          Bine ai venit!
        </h1>

        <p className="header-elegant" style={{ fontSize: '1.1rem', letterSpacing: '5px' }}>
          Maria &amp; Andrei
        </p>

        <div className="ornament-divider" style={{ margin: '22px auto 0' }}>
          <span>✦</span>
        </div>
      </div>

      {/* Search card */}
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <p style={{
          marginBottom: '28px',
          fontSize: '0.95rem',
          color: '#5a9d6a',
          textAlign: 'center',
          fontWeight: '300',
          letterSpacing: '0.5px',
          lineHeight: '1.7'
        }}>
          Introduceți numele pentru a afla la ce masă sunteți
        </p>

        <form onSubmit={(e) => { e.preventDefault(); performSearch(name); }}>
          {/* Input + dropdown in a relative wrapper so the dropdown anchors to the input */}
          <div style={{ position: 'relative', margin: '12px 0' }}>
            <input
              type="text"
              placeholder="Nume Prenume"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => name.trim().length > 0 && setShowSuggestions(true)}
              disabled={loading}
              autoFocus
              style={{ margin: 0, fontSize: '1.05rem', padding: '16px 18px', borderRadius: showSuggestions && suggestions.length > 0 ? '16px 16px 0 0' : undefined }}
            />

            {/* Autocomplete dropdown — anchored right below the input */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid rgba(90,157,106,0.25)',
                borderTop: 'none',
                borderRadius: '0 0 16px 16px',
                maxHeight: '260px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 12px 32px rgba(90,157,106,0.12)'
              }}>
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    style={{
                      padding: '13px 18px',
                      cursor: 'pointer',
                      borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(90,157,106,0.07)' : 'none',
                      color: '#2a3a33',
                      fontSize: '0.95rem',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232,243,237,0.55)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: 'rgba(198,40,40,0.05)',
              borderLeft: '3px solid rgba(198,40,40,0.5)',
              borderRadius: '0 10px 10px 0',
              fontSize: '0.9rem',
              color: '#b71c1c',
              lineHeight: '1.6'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || loading}
            style={{ marginTop: '24px', width: '100%', padding: '16px' }}
          >
            {loading ? 'Se caută...' : 'Spune-mi la ce masă sunt'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="ornament-divider" style={{ marginBottom: '16px' }}>
          <span>✦</span>
        </div>
        <p style={{ letterSpacing: '2px', fontSize: '0.85rem', opacity: 0.7 }}>
          Distrează-te alături de noi
        </p>
      </div>
    </div>
  );
}
