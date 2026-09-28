import React from 'react';
import { Shield, Users, RefreshCw, GitBranch, Database, CheckCircle2 } from 'lucide-react';

export default function AdminBanner({ onOpenTeamManager, onGeneratePlayoffs, onResetData, isGenerating, isResetting }) {
  return (
    <aside className="admin-banner-wrapper">
      <div className="admin-banner-container">
        <div className="admin-banner-left">
          <div className="admin-icon-box">
            <Shield size={20} className="admin-icon" />
          </div>
          <div>
            <div className="admin-banner-title">
              Panel de Administración Activo
              <span className="badge badge-success db-status-tag">
                <Database size={11} /> PostgreSQL Conectado
              </span>
            </div>
            <div className="admin-banner-desc">
              Tienes permisos para registrar equipos, jugadores, modificar marcadores y avanzar llaves.
            </div>
          </div>
        </div>

        <div className="admin-banner-actions">
          <button 
            onClick={onOpenTeamManager}
            className="btn btn-sm btn-outline admin-action-btn"
          >
            <Users size={15} /> Equipos y Jugadores
          </button>

          <button 
            onClick={onGeneratePlayoffs}
            disabled={isGenerating}
            className="btn btn-sm btn-primary admin-action-btn"
            title="Toma automáticamente a los 8 clasificados y genera los Cuartos de Final (1º vs 8º, etc.)"
          >
            <GitBranch size={15} /> {isGenerating ? 'Generando...' : 'Generar Cuartos (Top 8)'}
          </button>

          <button 
            onClick={onResetData}
            disabled={isResetting}
            className="btn btn-sm btn-danger admin-action-btn"
            title="Restaura los datos iniciales de prueba (12 equipos, grupos y playoffs)"
          >
            <RefreshCw size={14} className={isResetting ? 'spin' : ''} /> {isResetting ? 'Restaurando...' : 'Restaurar Demo'}
          </button>
        </div>
      </div>

      <style>{`
        .admin-banner-wrapper {
          background: linear-gradient(90deg, rgba(2, 132, 199, 0.18) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(16, 185, 129, 0.15) 100%);
          border-bottom: 1px solid rgba(56, 189, 248, 0.3);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
          animation: fadeIn 0.3s ease;
        }
        .admin-banner-container {
          max-width: 1380px;
          margin: 0 auto;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .admin-banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }
        .admin-banner-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .db-status-tag {
          font-size: 0.68rem;
          padding: 2px 8px;
        }
        .admin-banner-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .admin-banner-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .admin-action-btn {
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          padding: 7px 13px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </aside>
  );
}
