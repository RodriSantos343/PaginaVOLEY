import React from 'react';
import { 
  Trophy, 
  LayoutGrid, 
  Award, 
  GitFork, 
  ShieldCheck, 
  Lock, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdmin, onOpenAdminLogin, onLogoutAdmin }) {
  const tabs = [
    { id: 'principal', label: '1. Principal', icon: Trophy, desc: 'Info & Destacados' },
    { id: 'grupos', label: '2. Grupos y Resultados', icon: LayoutGrid, desc: '3 Grupos de 4' },
    { id: 'clasificados', label: '3. Tabla de Clasificados', icon: Award, desc: 'Los 8 Mejores' },
    { id: 'playoffs', label: '4. Ronda Clasificadora', icon: GitFork, desc: 'Cuartos, Semis, Final' },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setActiveTab('principal')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-glow">
            <span className="volleyball-emoji">🏐</span>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              COPA NOVA <span>2026</span>
            </div>
            <div className="brand-subtitle">Torneo Oficial • 12 Equipos de Voleibol</div>
          </div>
        </div>

        {/* 4 Tabs */}
        <nav className="navbar-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'tab-btn-active' : ''}`}
              >
                <Icon size={18} className="tab-icon" />
                <span className="tab-label">{tab.label}</span>
                {isActive && <span className="tab-active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Role Mode Button */}
        <div className="navbar-actions">
          {isAdmin ? (
            <div className="admin-pill-group">
              <span className="badge badge-success admin-status-badge">
                <ShieldCheck size={14} /> Admin Activo
              </span>
              <button 
                onClick={onLogoutAdmin}
                className="btn btn-sm btn-outline"
                title="Cerrar sesión de administrador"
              >
                <LogOut size={14} /> Salir
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAdminLogin}
              className="btn btn-sm btn-outline admin-login-btn"
              title="Acceso para registrar equipos, jugadores y marcadores"
            >
              <Lock size={14} /> Modo Administrador
            </button>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(7, 10, 18, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .navbar-content {
          max-width: 1380px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          user-select: none;
        }
        .brand-logo-glow {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2));
          border: 1px solid rgba(56, 189, 248, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
        }
        .volleyball-emoji {
          font-size: 24px;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.1;
        }
        .brand-title span {
          color: var(--color-primary);
        }
        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .navbar-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.7);
          padding: 4px 6px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .tab-btn-active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.8), rgba(37, 99, 235, 0.8));
          box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4);
        }
        .tab-active-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 3px;
          border-radius: 2px;
          background: var(--color-primary);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-pill-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-status-badge {
          background: rgba(16, 185, 129, 0.18);
          border-color: rgba(16, 185, 129, 0.5);
          color: #34d399;
          font-size: 0.75rem;
          padding: 6px 12px;
        }
        .admin-login-btn {
          background: rgba(56, 189, 248, 0.08);
          border-color: rgba(56, 189, 248, 0.25);
          color: var(--color-primary);
        }
        .admin-login-btn:hover {
          background: rgba(56, 189, 248, 0.16);
          border-color: var(--color-primary);
          color: #ffffff;
        }
        @media (max-width: 1024px) {
          .navbar-content {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }
          .navbar-tabs {
            width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
            border-radius: var(--radius-md);
            padding: 6px;
          }
        }
      `}</style>
    </header>
  );
}
