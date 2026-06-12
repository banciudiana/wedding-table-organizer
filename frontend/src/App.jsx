import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Table from './pages/Table';
import AdminPanel from './pages/AdminPanel';
import './styles/global.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faf9, #eef5f1)' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table/:tableNumber" element={<Table />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;
