import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

export default function Table() {
  const { tableNumber } = useParams();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const guest = routerLocation.state?.guest;

  const tableLocations = (() => {
    try { return JSON.parse(localStorage.getItem('tableLocations') || '{}'); } catch { return {}; }
  })();
  const globalLocation = localStorage.getItem('globalLocation') || 'exterior';
  const tableLocation = tableLocations[tableNumber] || globalLocation;

  const [imgSrc, setImgSrc] = useState(`/images/masa${tableNumber}_${tableLocation}.jpg`);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    if (imgSrc.endsWith('.jpg')) {
      setImgSrc(`/images/masa${tableNumber}_${tableLocation}.png`);
    } else {
      setImgFailed(true);
    }
  };

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get(`/api/tables/${tableNumber}`);
        setTableData(response.data);
      } catch (err) {
        setError('Nu am putut încărca informațiile mesei.');
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, [tableNumber]);

  if (loading) {
    return (
      <div className="container responsive" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{
          width: '36px', height: '36px',
          border: '2px solid rgba(90,157,106,0.15)',
          borderTop: '2px solid #5a9d6a',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{
          color: '#5a9d6a', letterSpacing: '4px',
          textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: '300'
        }}>
          Se încarcă
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container responsive" style={{ maxWidth: '500px', marginTop: '80px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#c62828', marginBottom: '24px' }}>{error}</p>
          <button onClick={() => navigate('/')}>Înapoi acasă</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container responsive" style={{ maxWidth: '680px', paddingTop: '40px', paddingBottom: '80px' }}>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          color: '#5a9d6a',
          border: '1px solid rgba(90,157,106,0.3)',
          padding: '8px 18px',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: '500',
          boxShadow: 'none',
          marginBottom: '56px',
          width: 'auto'
        }}
      >
        &#8592; Înapoi
      </button>

      {/* Welcome section — compact, image is the focal point */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        {guest ? (
          <>
            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: '#5a9d6a',
              fontWeight: '500',
              opacity: 0.55,
              marginBottom: '10px'
            }}>
              Bine ai venit
            </p>

            <h1 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)',
              fontWeight: '700',
              color: '#3d7a50',
              lineHeight: '1.1',
              marginBottom: '0',
              fontStyle: 'italic'
            }}>
              {guest.name}
            </h1>

            <div className="ornament-divider" style={{ margin: '14px auto' }}>
              <span>✦</span>
            </div>

            <p style={{
              fontSize: '0.7rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#5a9d6a',
              fontWeight: '300',
              marginBottom: '4px',
              opacity: 0.65
            }}>
              Locul tău este la
            </p>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.8rem',
              color: '#5a9d6a',
              fontWeight: '700',
              fontStyle: 'italic',
              lineHeight: '1.1'
            }}>
              Masa {tableNumber}
            </p>
          </>
        ) : (
          <>
            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: '#5a9d6a',
              opacity: 0.5,
              marginBottom: '8px'
            }}>
              Detalii
            </p>
            <h1 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontWeight: '700',
              color: '#3d7a50',
              fontStyle: 'italic'
            }}>
              Masa {tableNumber}
            </h1>
          </>
        )}
      </div>

      {/* Table image */}
      <div className="table-image-container">
        {!imgFailed ? (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={`Masa ${tableNumber} — ${tableLocation === 'interior' ? 'Interior' : 'Afară'}`}
            onError={handleImgError}
          />
        ) : (
          <div className="table-image-placeholder">
            <div style={{
              width: '60px', height: '60px',
              borderRadius: '50%',
              border: '1px solid rgba(90,157,106,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(232,243,237,0.5)'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="rgba(90,157,106,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p style={{
              color: '#5a9d6a',
              fontSize: '0.75rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.5,
              fontWeight: '300'
            }}>
              Masa {tableNumber}
            </p>
            <p style={{
              color: '#5a9d6a',
              fontSize: '0.68rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              opacity: 0.35,
              fontWeight: '300'
            }}>
              {tableLocation === 'interior' ? 'Interior' : 'Afară'}
            </p>
          </div>
        )}
      </div>

      {/* Location label below image */}
      <p style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#5a9d6a',
        opacity: 0.4,
        fontWeight: '400'
      }}>
        {tableLocation === 'interior' ? 'Interior' : 'Afară'}
      </p>

    </div>
  );
}
