/* Shared UI primitives — Stepper, Section, Field, Button etc. */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const STEP_LABELS = [
  { k: 'formule',     n: 1, label: 'Formule',     ic: '🎉' },
  { k: 'date',        n: 2, label: 'Date',        ic: '📅' },
  { k: 'enfant',      n: 3, label: 'L’enfant',  ic: '🤩' },
  { k: 'coordonnees', n: 4, label: 'Parent',      ic: '✍️' },
  { k: 'recap',       n: 5, label: 'Récap',       ic: '📋' },
  { k: 'paiement',    n: 6, label: 'Paiement',    ic: '💳' },
];

function Stepper({ current, onJump, completed }) {
  return (
    <div className="rsv-stepper">
      {STEP_LABELS.map((s, i) => {
        const isDone = completed.includes(s.k);
        const isActive = current === s.k;
        const clickable = isDone;
        return (
          <React.Fragment key={s.k}>
            <button
              type="button"
              className={`rsv-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => clickable && onJump(s.k)}
              disabled={!clickable && !isActive}
              aria-current={isActive}
            >
              <span className="rsv-step-dot">
                {isDone && !isActive ? '✓' : s.n}
              </span>
              <span className="rsv-step-lbl">{s.label}</span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <span className={`rsv-step-bar ${isDone ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepHeader({ eyebrow, title, accent, sub }) {
  return (
    <div className="rsv-step-header">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="rsv-step-title">
        {title}{' '}{accent && <span className="accent">{accent}</span>}
      </h2>
      {sub && <p className="rsv-step-sub">{sub}</p>}
    </div>
  );
}

function NavBar({ onBack, onNext, nextLabel = 'Continuer', backLabel = 'Retour', disabled, hint }) {
  return (
    <div className="rsv-navbar">
      <div className="rsv-navbar-left">
        {onBack && (
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            <span style={{fontSize:'1.1em',lineHeight:1}}>‹</span>{backLabel}
          </button>
        )}
      </div>
      {hint && <div className="rsv-navbar-hint">{hint}</div>}
      <div className="rsv-navbar-right">
        {onNext && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
            disabled={disabled}
          >
            {nextLabel}<span style={{fontSize:'1.1em',lineHeight:1}}>›</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, error, children, span }) {
  return (
    <div className={`rsv-field ${span === 2 ? 'span-2' : ''} ${error ? 'has-error' : ''}`}>
      <label>{label}</label>
      {children}
      {error ? (
        <div className="rsv-field-err">{error}</div>
      ) : hint ? (
        <div className="rsv-field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

function Card({ children, className = '', ...rest }) {
  return <div className={`rsv-card ${className}`} {...rest}>{children}</div>;
}

Object.assign(window, { Stepper, StepHeader, NavBar, Field, Card, STEP_LABELS });
