/* Shared UI components for the account dashboard */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const SECTIONS = [
  { k: 'dashboard',     ic: '🏠',  label: 'Tableau de bord' },
  { k: 'reservations',  ic: '📅',  label: 'Mes réservations' },
  { k: 'enfants',       ic: '👶',  label: 'Mes enfants' },
  { k: 'fidelite',      ic: '🎳',  label: 'Carte fidélité' },
  { k: 'paiements',     ic: '💳',  label: 'Paiements & factures' },
  { k: 'notifications', ic: '🔔',  label: 'Notifications' },
  { k: 'profil',        ic: '⚙️',  label: 'Mon profil' },
];

function Sidebar({ current, onChange, unreadCount }) {
  return (
    <aside className="acc-sidebar">
      <div className="acc-user-card">
        <div className="acc-avatar">{initials(USER.firstName, USER.lastName)}</div>
        <div className="acc-user-info">
          <div className="acc-user-name">{USER.firstName} {USER.lastName}</div>
          <div className="acc-user-meta">
            <span className="acc-level-badge">⭐ {USER.memberLevel}</span>
          </div>
          <div className="acc-user-since">Membre depuis {new Date(USER.joined).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <nav className="acc-nav">
        {SECTIONS.map((s) => (
          <button
            key={s.k}
            type="button"
            className={`acc-nav-item ${current === s.k ? 'active' : ''}`}
            onClick={() => onChange(s.k)}
          >
            <span className="acc-nav-ic">{s.ic}</span>
            <span className="acc-nav-label">{s.label}</span>
            {s.k === 'notifications' && unreadCount > 0 && (
              <span className="acc-nav-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="acc-sidebar-footer">
        <a href="connexion.html" className="acc-logout" onClick={(e) => {
          if (!confirm('Vous déconnecter ?')) e.preventDefault();
          else {
            try { localStorage.removeItem('fgc_logged_in'); } catch (e) {}
          }
        }}>
          <span>↩</span> Se déconnecter
        </a>
      </div>
    </aside>
  );
}

function SectionHeader({ eyebrow, title, accent, sub, actions }) {
  return (
    <div className="acc-section-head">
      <div>
        <span className="section-eyebrow">{eyebrow}</span>
        <h1 className="acc-section-title">
          {title}{accent && <> <span className="accent">{accent}</span></>}
        </h1>
        {sub && <p className="acc-section-sub">{sub}</p>}
      </div>
      {actions && <div className="acc-section-actions">{actions}</div>}
    </div>
  );
}

function Card({ children, className = '', ...rest }) {
  return <div className={`acc-card ${className}`} {...rest}>{children}</div>;
}

function EmptyState({ icon, title, sub, cta }) {
  return (
    <div className="acc-empty">
      <div className="acc-empty-ic">{icon}</div>
      <div className="acc-empty-title">{title}</div>
      {sub && <div className="acc-empty-sub">{sub}</div>}
      {cta && <div className="acc-empty-cta">{cta}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    'confirmé':   { color: '#84cc16', bg: 'rgba(132,204,22,0.15)', ic: '✓' },
    'terminé':    { color: 'rgba(255,244,224,0.5)', bg: 'rgba(255,255,255,0.06)', ic: '✓' },
    'annulé':     { color: '#f87171', bg: 'rgba(248,113,113,0.12)', ic: '✕' },
    'en attente': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', ic: '⏱' },
  };
  const s = map[status] || map['confirmé'];
  return (
    <span className="acc-badge" style={{ color: s.color, background: s.bg, borderColor: s.color + '44' }}>
      <span>{s.ic}</span>{status}
    </span>
  );
}

Object.assign(window, { SECTIONS, Sidebar, SectionHeader, Card, EmptyState, StatusBadge });
