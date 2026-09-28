// API Service for Volleyball Tournament

const API_BASE = '/api';

export const api = {
  // Tournament Info
  getTournament: async () => {
    const res = await fetch(`${API_BASE}/tournament`);
    if (!res.ok) throw new Error('Error al cargar datos del torneo');
    return res.json();
  },

  updateTournament: async (data, token) => {
    const res = await fetch(`${API_BASE}/tournament`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar datos del torneo');
    return res.json();
  },

  // Teams & Players
  getTeams: async () => {
    const res = await fetch(`${API_BASE}/teams`);
    if (!res.ok) throw new Error('Error al cargar equipos');
    return res.json();
  },

  updateTeam: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar equipo');
    return res.json();
  },

  // Matches
  getMatches: async () => {
    const res = await fetch(`${API_BASE}/matches`);
    if (!res.ok) throw new Error('Error al cargar partidos');
    return res.json();
  },

  updateMatch: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/matches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar partido');
    return res.json();
  },

  // Standings & Qualified
  getStandings: async () => {
    const res = await fetch(`${API_BASE}/standings`);
    if (!res.ok) throw new Error('Error al cargar posiciones');
    return res.json();
  },

  getQualified: async () => {
    const res = await fetch(`${API_BASE}/qualified`);
    if (!res.ok) throw new Error('Error al cargar clasificados');
    return res.json();
  },

  // Playoffs
  getPlayoffs: async () => {
    const res = await fetch(`${API_BASE}/playoffs`);
    if (!res.ok) throw new Error('Error al cargar playoffs');
    return res.json();
  },

  updatePlayoffMatch: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/playoffs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar playoff');
    return res.json();
  },

  generatePlayoffs: async (token) => {
    const res = await fetch(`${API_BASE}/playoffs/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al generar llaves de playoffs');
    }
    return res.json();
  },

  // Admin Auth
  loginAdmin: async (password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Contraseña incorrecta');
    }
    return res.json();
  },

  // Reset to demo data
  resetDatabase: async (token) => {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error al restaurar base de datos');
    return res.json();
  }
};
