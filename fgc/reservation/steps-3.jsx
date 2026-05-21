/* Steps 8-9: 3D Secure challenge + bank processing + payment failure */

/* ============================================================
   STEP — 3D Secure challenge
   ============================================================ */
function Step3DS({ data, onSuccess, onFail, onBack, forcedOutcome }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [phase, setPhase] = useState('challenge'); // 'challenge' | 'verifying' | 'forwarding'
  const [error, setError] = useState(null);
  const [resendIn, setResendIn] = useState(58);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (phase !== 'challenge') return;
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, resendIn]);

  useEffect(() => {
    if (phase === 'challenge') {
      // focus first empty cell
      const i = code.findIndex((c) => c === '');
      inputsRef.current[i === -1 ? 5 : i]?.focus();
    }
  }, [phase]);

  function handleChange(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    setError(null);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
    if (next.every((c) => c !== '')) {
      // Submit
      setTimeout(() => submitCode(next.join('')), 150);
    }
  }
  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }
  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      e.preventDefault();
      setCode(text.split(''));
      setTimeout(() => submitCode(text), 150);
    }
  }

  function submitCode(value) {
    setPhase('verifying');
    setTimeout(() => {
      // outcome rules:
      //  - if forcedOutcome === 'fail-3ds' → code refused
      //  - else if value === '000000' → refused
      //  - else → go forwarding
      const fail3ds = forcedOutcome === 'fail-3ds' || value === '000000';
      if (fail3ds) {
        setPhase('challenge');
        setCode(['', '', '', '', '', '']);
        setError('Code incorrect. Vérifiez le SMS reçu et réessayez.');
        setTimeout(() => inputsRef.current[0]?.focus(), 100);
        return;
      }
      setPhase('forwarding');
      setTimeout(() => {
        // forward to bank — outcome depends on forcedOutcome
        if (forcedOutcome === 'fail-bank' || forcedOutcome === 'fail-timeout') {
          onFail(forcedOutcome === 'fail-timeout' ? 'timeout' : 'declined');
        } else {
          onSuccess();
        }
      }, 2200);
    }, 1200);
  }

  function resend() {
    if (resendIn > 0) return;
    setResendIn(58);
  }

  const masked = data.parentPhone
    ? data.parentPhone.replace(/\s/g, '').replace(/(\d{2})\d{4}(\d{2})$/, '$1 ** ** ** $2')
    : '•• •• •• •• ••';

  const last4 = (data.cardNumber || '').replace(/\s/g, '').slice(-4) || '••••';
  const brand = (function () {
    const d = (data.cardNumber || '').replace(/\s/g, '');
    if (/^4/.test(d)) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(d)) return 'MASTERCARD';
    if (/^3[47]/.test(d)) return 'AMEX';
    return 'CARTE';
  })();

  return (
    <div className="rsv-screen rsv-3ds-screen">
      <div className="rsv-bank-frame">
        <div className="rsv-bank-frame-top">
          <div className="rsv-bank-frame-url">
            <span className="rsv-bank-frame-lock">🔒</span>
            <span className="rsv-bank-frame-domain">3dsecure.banque.fr</span>
            <span className="rsv-bank-frame-ssl">SSL · 3D Secure 2</span>
          </div>
        </div>

        <div className="rsv-bank-frame-body">
          <div className="rsv-bank-frame-brand">
            <div className="rsv-bank-frame-logo">🏦</div>
            <div>
              <div className="rsv-bank-frame-bank">Votre banque</div>
              <div className="rsv-bank-frame-sub">Vérification de paiement</div>
            </div>
            <div className="rsv-bank-frame-shield">
              <span>3D</span>SECURE
            </div>
          </div>

          {phase === 'challenge' && (
            <>
              <h2 className="rsv-bank-title">Validez votre paiement</h2>
              <div className="rsv-bank-summary">
                <div className="rsv-bank-summary-line">
                  <span>Marchand</span>
                  <strong>FAMILY GAMES CENTER</strong>
                </div>
                <div className="rsv-bank-summary-line">
                  <span>Carte</span>
                  <strong>{brand} •••• {last4}</strong>
                </div>
                <div className="rsv-bank-summary-line big">
                  <span>Montant</span>
                  <strong>{formatPrice(DEPOSIT)}</strong>
                </div>
              </div>

              <p className="rsv-bank-text">
                Un code de confirmation à 6 chiffres a été envoyé par SMS au <strong>{masked}</strong>.
              </p>

              <div className="rsv-otp">
                {code.map((c, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={c}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className={`rsv-otp-cell ${error ? 'error' : ''} ${c ? 'filled' : ''}`}
                  />
                ))}
              </div>

              {error && <div className="rsv-bank-error">⚠ {error}</div>}

              <div className="rsv-bank-resend">
                {resendIn > 0 ? (
                  <span>Nouveau code dans <strong>00:{resendIn.toString().padStart(2, '0')}</strong></span>
                ) : (
                  <button type="button" onClick={resend} className="rsv-bank-resend-btn">Renvoyer un code</button>
                )}
              </div>

              <div className="rsv-bank-actions">
                <button type="button" className="rsv-bank-cancel" onClick={onBack}>Annuler le paiement</button>
              </div>

              <div className="rsv-bank-tip">
                💡 <strong>Astuce démo</strong> : tapez n'importe quel code pour valider, tapez <code>000000</code> pour simuler un refus.
              </div>
            </>
          )}

          {phase === 'verifying' && (
            <div className="rsv-bank-loading">
              <div className="rsv-bank-spinner" />
              <div className="rsv-bank-loading-t">Vérification du code…</div>
              <div className="rsv-bank-loading-s">Ne fermez pas cette fenêtre.</div>
            </div>
          )}

          {phase === 'forwarding' && (
            <div className="rsv-bank-loading">
              <div className="rsv-bank-spinner" />
              <div className="rsv-bank-loading-t">Communication avec votre banque…</div>
              <div className="rsv-bank-loading-s">Autorisation en cours. Cela peut prendre quelques secondes.</div>
              <div className="rsv-bank-progress">
                <div className="rsv-bank-progress-step done">✓ Code vérifié</div>
                <div className="rsv-bank-progress-step active">
                  <span className="rsv-bank-dot" />
                  Autorisation bancaire
                </div>
                <div className="rsv-bank-progress-step">Confirmation</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STEP — Payment failure
   ============================================================ */
function StepEchec({ data, reason, onRetry, onChangeMethod, onBack }) {
  const formule = FORMULES.find(f => f.id === data.formuleId);
  const last4 = (data.cardNumber || '').replace(/\s/g, '').slice(-4) || '••••';

  const reasons = {
    declined: {
      ic: '🚫',
      title: 'Paiement refusé par votre banque',
      lead: 'Votre banque n\'a pas autorisé le débit de 50€. Aucun montant n\'a été prélevé.',
      causes: [
        'Solde ou plafond de paiement insuffisant',
        'Carte bloquée ou opposition en cours',
        'Paiement en ligne désactivé pour cette carte',
        'Limite de paiements à l\'étranger atteinte',
      ],
      code: 'ERR_CARD_DECLINED',
    },
    'fail-3ds': {
      ic: '🔐',
      title: 'Validation 3D Secure échouée',
      lead: 'Le code de sécurité n\'a pas pu être vérifié après plusieurs tentatives. Aucun montant n\'a été prélevé.',
      causes: [
        'Code à 6 chiffres incorrect',
        'Délai de validation dépassé (5 minutes)',
        'Application mobile bancaire non disponible',
      ],
      code: 'ERR_3DS_FAILED',
    },
    timeout: {
      ic: '⏱️',
      title: 'Délai d\'attente dépassé',
      lead: 'Votre banque n\'a pas répondu à temps. La transaction a été annulée. Aucun montant n\'a été prélevé.',
      causes: [
        'Connexion internet instable pendant la validation',
        'Maintenance temporaire de votre banque',
        'Trop d\'attente sur la page 3D Secure',
      ],
      code: 'ERR_GATEWAY_TIMEOUT',
    },
  };
  const r = reasons[reason] || reasons.declined;

  return (
    <div className="rsv-screen rsv-echec">
      <div className="rsv-echec-burst">{r.ic}</div>
      <h1 className="rsv-echec-title">{r.title}</h1>
      <p className="rsv-echec-lead">{r.lead}</p>

      <Card className="rsv-echec-card">
        <div className="rsv-echec-reassure">
          <span className="rsv-echec-reassure-ic">✓</span>
          <div>
            <div className="rsv-echec-reassure-t">Votre réservation est en attente, pas perdue</div>
            <div className="rsv-echec-reassure-s">Toutes vos informations sont sauvegardées. Le créneau est tenu encore <strong>30 minutes</strong> le temps que vous réessayiez.</div>
          </div>
        </div>

        <div className="rsv-echec-detail">
          <h3>Détails de la tentative</h3>
          <div className="rsv-echec-row"><span>Date</span><strong>{new Date().toLocaleString('fr-FR')}</strong></div>
          <div className="rsv-echec-row"><span>Carte utilisée</span><strong>•••• •••• •••• {last4}</strong></div>
          <div className="rsv-echec-row"><span>Montant</span><strong>{formatPrice(DEPOSIT)} (non débité)</strong></div>
          <div className="rsv-echec-row"><span>Code d'erreur</span><strong style={{fontFamily:'monospace',fontSize:'0.85rem'}}>{r.code}</strong></div>
        </div>

        <div className="rsv-echec-causes">
          <h3>Causes possibles</h3>
          <ul>
            {r.causes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        <div className="rsv-echec-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            🔄 Réessayer le paiement
          </button>
          <button type="button" className="btn btn-ghost" onClick={onChangeMethod}>
            💳 Changer de carte
          </button>
        </div>

        <div className="rsv-echec-help">
          <div className="rsv-echec-help-t">Besoin d'aide ?</div>
          <div className="rsv-echec-help-grid">
            <a href="tel:0254748521" className="rsv-echec-help-item">
              <span className="rsv-echec-help-ic">📞</span>
              <div>
                <strong>02 54 74 85 21</strong>
                <span>Du lundi au samedi, 14h-minuit</span>
              </div>
            </a>
            <a href="mailto:contact@familygamescenter.fr" className="rsv-echec-help-item">
              <span className="rsv-echec-help-ic">✉️</span>
              <div>
                <strong>contact@familygamescenter.fr</strong>
                <span>Réponse sous 24h ouvrées</span>
              </div>
            </a>
          </div>
          <p className="rsv-echec-help-note">
            Vous pouvez aussi nous appeler pour finaliser la réservation par téléphone — paiement par chèque ou espèces accepté sur place.
          </p>
        </div>

        <button type="button" className="rsv-confirm-restart" onClick={onBack}>
          ← Revenir au récap
        </button>
      </Card>
    </div>
  );
}

Object.assign(window, { Step3DS, StepEchec });
