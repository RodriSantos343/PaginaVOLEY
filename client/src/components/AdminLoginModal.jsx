import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLogin }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(password);
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Contraseña incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge">
              <Lock size={18} />
            </div>
            <div>
              <h3>Acceso de Administrador</h3>
              <p className="modal-subtitle">Ingresa la clave para gestionar resultados, equipos y llaves</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="form-error-banner animate-fade-in">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password-input">Contraseña de Administrador</label>
            <div className="password-input-wrap">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Ingresa la contraseña..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="input-hint">
              Contraseña predeterminada del sistema: <code>admin123</code>
            </span>
          </div>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={loading || !password} className="btn btn-primary">
              <ShieldCheck size={16} /> {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-modal-box {
          max-width: 460px;
        }
        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.15);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .modal-title-row h3 {
          font-size: 1.15rem;
          color: #ffffff;
        }
        .modal-subtitle {
          font-size: 0.76rem;
          color: var(--text-dim);
        }
        .admin-login-form {
          margin-top: 16px;
        }
        .password-input-wrap {
          position: relative;
        }
        .password-input-wrap .form-input {
          padding-right: 44px;
        }
        .toggle-pw-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-pw-btn:hover {
          color: #ffffff;
        }
        .input-hint {
          font-size: 0.74rem;
          color: var(--text-dim);
          margin-top: 6px;
        }
        .input-hint code {
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--color-primary);
        }
        .form-error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .modal-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
