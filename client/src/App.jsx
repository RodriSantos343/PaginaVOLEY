import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AdminBanner from './components/AdminBanner';
import TabHome from './components/TabHome';
import TabGroups from './components/TabGroups';
import TabQualified from './components/TabQualified';
import TabPlayoffs from './components/TabPlayoffs';
import AdminLoginModal from './components/AdminLoginModal';
import EditMatchModal from './components/EditMatchModal';
import TeamManagerModal from './components/TeamManagerModal';
import { api } from './api';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('principal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  
  // Data states
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState({ A: [], B: [], C: [] });
  const [qualifiedData, setQualifiedData] = useState({ top8: [], thirdPlacesRanking: [], eliminated: [] });
  const [playoffs, setPlayoffs] = useState({ cuartos: [], semis: [], tercero: [], final: [] });
  const [loading, setLoading] = useState(true);

  // Modals
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editMatchModalOpen, setEditMatchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isPlayoffModal, setIsPlayoffModal] = useState(false);

  // Operations
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check saved admin session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('voley_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  // Fetch all data from PostgreSQL
  const fetchData = useCallback(async () => {
    try {
      const [tournRes, teamsRes, matchesRes, standingsRes, qualRes, playRes] = await Promise.all([
        api.getTournament().catch(() => null),
        api.getTeams().catch(() => []),
        api.getMatches().catch(() => []),
        api.getStandings().catch(() => ({ A: [], B: [], C: [] })),
        api.getQualified().catch(() => ({ top8: [], thirdPlacesRanking: [], eliminated: [] })),
        api.getPlayoffs().catch(() => ({ cuartos: [], semis: [], tercero: [], final: [] })),
      ]);

      if (tournRes) setTournament(tournRes);
      if (teamsRes) setTeams(teamsRes);
      if (matchesRes) setMatches(matchesRes);
      if (standingsRes) setStandings(standingsRes);
      if (qualRes) setQualifiedData(qualRes);
      if (playRes) setPlayoffs(playRes);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('Error al conectar con la base de datos PostgreSQL', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Admin Auth Handlers
  const handleAdminLogin = async (password) => {
    const res = await api.loginAdmin(password);
    if (res.success && res.token) {
      setAdminToken(res.token);
      setIsAdmin(true);
      localStorage.setItem('voley_admin_token', res.token);
      showToast('¡Sesión de administrador iniciada!', 'success');
    }
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    setIsAdmin(false);
    localStorage.removeItem('voley_admin_token');
    showToast('Sesión de administrador cerrada. Modo Espectador activo.', 'info');
  };

  // Match edit handler
  const handleOpenEditMatch = (match, isPlayoff = false) => {
    setSelectedMatch(match);
    setIsPlayoffModal(isPlayoff);
    setEditMatchModalOpen(true);
  };

  const handleSaveMatch = async (matchId, payload, isPlayoff) => {
    if (isPlayoff) {
      await api.updatePlayoffMatch(matchId, payload, adminToken);
      showToast('Marcador de playoff actualizado en PostgreSQL', 'success');
    } else {
      await api.updateMatch(matchId, payload, adminToken);
      showToast('Resultado de fase de grupos guardado en PostgreSQL', 'success');
    }
    // Refresh all tables and brackets
    await fetchData();
  };

  // Team & Players edit handler
  const handleSaveTeam = async (teamId, payload) => {
    await api.updateTeam(teamId, payload, adminToken);
    showToast('Equipo y jugadores guardados en PostgreSQL', 'success');
    await fetchData();
  };

  // Generate quarterfinals from Top 8
  const handleGeneratePlayoffs = async () => {
    if (!isAdmin) {
      setAdminModalOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      await api.generatePlayoffs(adminToken);
      showToast('¡Llaves de Cuartos de Final sembradas con éxito!', 'success');
      await fetchData();
      setActiveTab('playoffs');
    } catch (err) {
      showToast(err.message || 'Error al generar llaves', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset database to official demo
  const handleResetData = async () => {
    if (!isAdmin) {
      setAdminModalOpen(true);
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas restaurar los datos de prueba oficiales? Se reiniciarán marcadores y llaves con el fixture de demostración.')) {
      return;
    }

    try {
      setIsResetting(true);
      await api.resetDatabase(adminToken);
      showToast('Base de datos PostgreSQL restaurada correctamente', 'success');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error al restaurar base de datos', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animate-fade-in`}>
          {toast.type === 'success' && <CheckCircle2 size={16} />}
          {toast.type === 'error' && <AlertCircle size={16} />}
          {toast.type === 'info' && <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Admin Action Bar (if logged in) */}
      {isAdmin && (
        <AdminBanner
          onOpenTeamManager={() => setTeamModalOpen(true)}
          onGeneratePlayoffs={handleGeneratePlayoffs}
          onResetData={handleResetData}
          isGenerating={isGenerating}
          isResetting={isResetting}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content-container">
        {loading ? (
          <div className="loading-state-box">
            <Loader2 size={40} className="spin text-cyan" />
            <p>Conectando con PostgreSQL y cargando torneo...</p>
          </div>
        ) : (
          <>
            {activeTab === 'principal' && (
              <TabHome
                tournament={tournament}
                teams={teams}
                matches={matches}
                qualifiedData={qualifiedData}
                onSelectTab={setActiveTab}
                isAdmin={isAdmin}
                onEditMatch={(m) => handleOpenEditMatch(m, false)}
              />
            )}

            {activeTab === 'grupos' && (
              <TabGroups
                standings={standings}
                matches={matches}
                isAdmin={isAdmin}
                onEditMatch={(m) => handleOpenEditMatch(m, false)}
              />
            )}

            {activeTab === 'clasificados' && (
              <TabQualified
                qualifiedData={qualifiedData}
                isAdmin={isAdmin}
                onGeneratePlayoffs={handleGeneratePlayoffs}
                onSelectTab={setActiveTab}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'playoffs' && (
              <TabPlayoffs
                playoffs={playoffs}
                isAdmin={isAdmin}
                onEditPlayoffMatch={(m) => handleOpenEditMatch(m, true)}
                onGeneratePlayoffs={handleGeneratePlayoffs}
                isGenerating={isGenerating}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-logo">🏐</span>
            <div>
              <strong>COPA NOVA 2026</strong>
              <p>Torneo Oficial para 12 Equipos • React.js & PostgreSQL</p>
            </div>
          </div>
          <div className="footer-right">
            <span>Servidor PostgreSQL Activo en Puerto 5432</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLogin={handleAdminLogin}
      />

      <EditMatchModal
        isOpen={editMatchModalOpen}
        onClose={() => setEditMatchModalOpen(false)}
        match={selectedMatch}
        onSave={handleSaveMatch}
        isPlayoff={isPlayoffModal}
      />

      <TeamManagerModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        teams={teams}
        onSaveTeam={handleSaveTeam}
      />

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content-container {
          flex: 1;
          max-width: 1380px;
          width: 100%;
          margin: 0 auto;
          padding: 28px 24px;
        }
        .loading-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          gap: 16px;
          color: var(--text-muted);
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }
        .toast-success {
          background: rgba(16, 185, 129, 0.92);
          color: #ffffff;
        }
        .toast-error {
          background: rgba(239, 68, 68, 0.92);
          color: #ffffff;
        }
        .toast-info {
          background: rgba(56, 189, 248, 0.92);
          color: #04101e;
        }

        /* Footer */
        .footer-bar {
          background: rgba(7, 10, 18, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px 24px;
          margin-top: 40px;
        }
        .footer-content {
          max-width: 1380px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 0.85rem;
          color: var(--text-dim);
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-left strong {
          color: #ffffff;
          display: block;
        }
        .footer-logo {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}
