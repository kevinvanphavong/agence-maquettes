/* Steps 4-7: Coordonnées parent / Récap / Paiement / Confirmation */

/* ============================================================
   STEP 4 — Coordonnées du parent
   ============================================================ */
function StepCoordonnees({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  function set(k, v) {
    update({ [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  }
  function validate() {
    const e = {};
    if (!data.parentFirstName?.trim()) e.parentFirstName = 'Prénom requis';
    if (!data.parentLastName?.trim()) e.parentLastName = 'Nom requis';
    if (!data.parentEmail?.trim()) e.parentEmail = 'Email requis';
    else if (!/^\S+@\S+\.\S+$/.test(data.parentEmail)) e.parentEmail = 'Email invalide';
    if (!data.parentPhone?.trim()) e.parentPhone = 'Téléphone requis';
    else if (data.parentPhone.replace(/\D/g, '').length < 10) e.parentPhone = 'Numéro à 10 chiffres';
    if (!data.acceptCGV) e.acceptCGV = 'Vous devez accepter les conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleNext() { if (validate()) onNext(); }

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 4 · Le parent organisateur"
        title="Vos"
        accent="coordonnées."
        sub="On vous envoie la confirmation par email, et on vous joint en cas d'imprévu."
      />

      <Card className="rsv-form-card">
        <div className="rsv-form-grid">
          <Field label="Prénom du parent" error={errors.parentFirstName}>
            <input
              type="text"
              placeholder="Sophie"
              value={data.parentFirstName || ''}
              onChange={(e) => set('parentFirstName', e.target.value)}
            />
          </Field>
          <Field label="Nom du parent" error={errors.parentLastName}>
            <input
              type="text"
              placeholder="Martin"
              value={data.parentLastName || ''}
              onChange={(e) => set('parentLastName', e.target.value)}
            />
          </Field>
          <Field label="Email" error={errors.parentEmail}>
            <input
              type="email"
              placeholder="sophie.martin@exemple.fr"
              value={data.parentEmail || ''}
              onChange={(e) => set('parentEmail', e.target.value)}
            />
          </Field>
          <Field label="Téléphone mobile" error={errors.parentPhone}>
            <input
              type="tel"
              placeholder="06 12 34 56 78"
              value={data.parentPhone || ''}
              onChange={(e) => set('parentPhone', e.target.value)}
            />
          </Field>
          <Field label="Comment nous avez-vous connu ? (optionnel)" span={2}>
            <select value={data.source || ''} onChange={(e) => set('source', e.target.value)}>
              <option value="">— Choisir —</option>
              <option value="amis">Bouche à oreille / amis</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="google">Recherche Google</option>
              <option value="passage">En passant devant</option>
              <option value="autre">Autre</option>
            </select>
          </Field>
          <Field label="Message pour l'équipe (optionnel)" span={2}>
            <textarea
              placeholder="Demande spéciale, surprise à organiser, accessibilité…"
              value={data.message || ''}
              onChange={(e) => set('message', e.target.value)}
            />
          </Field>
        </div>

        <div className="rsv-checkbox-row">
          <label className={`rsv-checkbox ${errors.acceptCGV ? 'has-error' : ''}`}>
            <input
              type="checkbox"
              checked={!!data.acceptCGV}
              onChange={(e) => set('acceptCGV', e.target.checked)}
            />
            <span className="rsv-checkbox-box">{data.acceptCGV ? '✓' : ''}</span>
            <span>J'accepte les <a href="#" onClick={(e)=>e.preventDefault()}>conditions générales de réservation</a> et la politique d'annulation (acompte remboursé jusqu'à 7 jours avant la fête).</span>
          </label>
          <label className="rsv-checkbox">
            <input
              type="checkbox"
              checked={!!data.acceptNewsletter}
              onChange={(e) => set('acceptNewsletter', e.target.checked)}
            />
            <span className="rsv-checkbox-box">{data.acceptNewsletter ? '✓' : ''}</span>
            <span>Je souhaite recevoir les bons plans & offres Family Games Center par email (optionnel).</span>
          </label>
          {errors.acceptCGV && <div className="rsv-field-err" style={{paddingLeft:34}}>{errors.acceptCGV}</div>}
        </div>
      </Card>

      <NavBar
        onBack={onBack}
        onNext={handleNext}
        nextLabel="Voir le récap"
      />
    </div>
  );
}

/* ============================================================
   STEP 5 — Récap
   ============================================================ */
function StepRecap({ data, onNext, onBack, onJump }) {
  const formule = FORMULES.find(f => f.id === data.formuleId);
  const total = formule.price * (+data.kidsCount);
  const remaining = total - DEPOSIT;

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 5 · Tout est en ordre ?"
        title="Un dernier"
        accent="check ?"
        sub="Vérifiez chaque détail. Tout peut encore être modifié en revenant sur l'étape concernée."
      />

      <div className="rsv-recap-grid">
        <div>
          <Card className="rsv-recap-block">
            <div className="rsv-recap-block-head">
              <h3>🎉 La fête</h3>
              <button type="button" className="rsv-edit" onClick={() => onJump('formule')}>Modifier</button>
            </div>
            <div className="rsv-recap-row">
              <span>Formule</span>
              <strong style={{ color: formule.color }}>{formule.icon} {formule.name}</strong>
            </div>
            <div className="rsv-recap-row">
              <span>Prix par enfant</span>
              <strong>{formatPrice(formule.price)}</strong>
            </div>
            <div className="rsv-recap-row">
              <span>Durée</span>
              <strong>{formule.duration}</strong>
            </div>
            {data.bonusActivity && (
              <div className="rsv-recap-row">
                <span>Activité bonus</span>
                <strong>{data.bonusActivity === 'vr' ? '🥽 Réalité Virtuelle' : '🎤 Karaoké privatisé'}</strong>
              </div>
            )}
          </Card>

          <Card className="rsv-recap-block">
            <div className="rsv-recap-block-head">
              <h3>📅 Quand</h3>
              <button type="button" className="rsv-edit" onClick={() => onJump('date')}>Modifier</button>
            </div>
            <div className="rsv-recap-row">
              <span>Date</span>
              <strong style={{textTransform:'capitalize'}}>{formatDateLong(new Date(data.date))}</strong>
            </div>
            <div className="rsv-recap-row">
              <span>Créneau</span>
              <strong>{TIME_SLOTS.find(s => s.v === data.timeSlot)?.label}</strong>
            </div>
          </Card>

          <Card className="rsv-recap-block">
            <div className="rsv-recap-block-head">
              <h3>🤩 L'enfant</h3>
              <button type="button" className="rsv-edit" onClick={() => onJump('enfant')}>Modifier</button>
            </div>
            <div className="rsv-recap-row">
              <span>Prénom</span><strong>{data.childName}</strong>
            </div>
            <div className="rsv-recap-row">
              <span>Âge fêté</span><strong>{data.childAge} ans</strong>
            </div>
            <div className="rsv-recap-row">
              <span>Nombre d'enfants</span><strong>{data.kidsCount} enfants</strong>
            </div>
            {data.cakeNote && (
              <div className="rsv-recap-row"><span>Gâteau</span><strong>{data.cakeNote}</strong></div>
            )}
            {data.allergies && (
              <div className="rsv-recap-row"><span>Allergies</span><strong>{data.allergies}</strong></div>
            )}
          </Card>

          <Card className="rsv-recap-block">
            <div className="rsv-recap-block-head">
              <h3>✍️ Parent organisateur</h3>
              <button type="button" className="rsv-edit" onClick={() => onJump('coordonnees')}>Modifier</button>
            </div>
            <div className="rsv-recap-row"><span>Nom</span><strong>{data.parentFirstName} {data.parentLastName}</strong></div>
            <div className="rsv-recap-row"><span>Email</span><strong>{data.parentEmail}</strong></div>
            <div className="rsv-recap-row"><span>Téléphone</span><strong>{data.parentPhone}</strong></div>
          </Card>
        </div>

        <div className="rsv-recap-aside">
          <Card className="rsv-total-card">
            <div className="rsv-total-eyebrow">Détail des coûts</div>
            <div className="rsv-total-line">
              <span>{formule.name} × {data.kidsCount} enfants</span>
              <span>{formatPrice(formule.price * (+data.kidsCount))}</span>
            </div>
            <div className="rsv-total-line muted">
              <span>L'enfant héros</span>
              <span>Offert 🎁</span>
            </div>
            <div className="rsv-total-divider" />
            <div className="rsv-total-grand">
              <span>Total fête</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="rsv-total-divider" />
            <div className="rsv-total-deposit">
              <div className="rsv-total-deposit-label">
                <span className="rsv-pill-now">À payer maintenant</span>
                <div className="rsv-total-deposit-hint">Acompte de réservation</div>
              </div>
              <div className="rsv-total-deposit-val">{formatPrice(DEPOSIT)}</div>
            </div>
            <div className="rsv-total-rest">
              <span>Reste à régler sur place</span>
              <span>{formatPrice(remaining)}</span>
            </div>
            <div className="rsv-total-note">
              🔒 Paiement sécurisé. L'acompte est remboursé en cas d'annulation jusqu'à 7 jours avant la date.
            </div>
          </Card>
        </div>
      </div>

      <NavBar
        onBack={onBack}
        onNext={onNext}
        nextLabel={`Payer ${formatPrice(DEPOSIT)} d'acompte`}
      />
    </div>
  );
}

/* ============================================================
   STEP 6 — Paiement de l'acompte 50€
   ============================================================ */
function StepPaiement({ data, update, onPay, onBack }) {
  const [errors, setErrors] = useState({});
  const formule = FORMULES.find(f => f.id === data.formuleId);

  function set(k, v) {
    update({ [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  }

  function fmtCard(v) {
    return v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})/g, '$1 ').trim();
  }
  function fmtExpiry(v) {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length < 3) return d;
    return d.slice(0,2) + '/' + d.slice(2);
  }

  function validate() {
    const e = {};
    if (data.paymentMethod === 'card') {
      if (!data.cardName?.trim()) e.cardName = 'Nom requis';
      if (!data.cardNumber || !luhnCheck(data.cardNumber)) e.cardNumber = 'Numéro de carte invalide';
      if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) e.cardExpiry = 'MM/AA';
      else {
        const [mm, yy] = data.cardExpiry.split('/').map(Number);
        if (mm < 1 || mm > 12) e.cardExpiry = 'Mois invalide';
        const now = new Date();
        const expDate = new Date(2000 + yy, mm, 0);
        if (expDate < now) e.cardExpiry = 'Carte expirée';
      }
      if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) e.cardCvc = '3 chiffres';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePay() {
    if (!validate()) return;
    onPay();
  }

  const method = data.paymentMethod || 'card';

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 6 · Paiement sécurisé"
        title="Acompte de"
        accent="50€ pour valider."
        sub="Le solde sera réglé sur place le jour de la fête. Paiement crypté SSL."
      />

      <div className="rsv-pay-grid">
        <Card className="rsv-form-card rsv-pay-form">
          <div className="rsv-method-row">
            {[
              { v: 'card', l: 'Carte bancaire', ic: '💳' },
              { v: 'sepa', l: 'Virement SEPA', ic: '🏦', soon: true },
              { v: 'paypal', l: 'PayPal', ic: '🅿️', soon: true },
            ].map(m => (
              <button
                type="button"
                key={m.v}
                className={`rsv-method ${method === m.v ? 'selected' : ''} ${m.soon ? 'soon' : ''}`}
                onClick={() => !m.soon && set('paymentMethod', m.v)}
                disabled={m.soon}
              >
                <span className="rsv-method-ic">{m.ic}</span>
                <span className="rsv-method-l">{m.l}</span>
                {m.soon && <span className="rsv-method-soon">Bientôt</span>}
              </button>
            ))}
          </div>

          <div className="rsv-cc-preview" aria-hidden="true">
            <div className="rsv-cc-row">
              <span className="rsv-cc-chip" />
              <span className="rsv-cc-brand">{detectBrand(data.cardNumber)}</span>
            </div>
            <div className="rsv-cc-num">{data.cardNumber || '•••• •••• •••• ••••'}</div>
            <div className="rsv-cc-bot">
              <div>
                <span className="rsv-cc-lbl">Titulaire</span>
                <span className="rsv-cc-val">{data.cardName || 'PRÉNOM NOM'}</span>
              </div>
              <div>
                <span className="rsv-cc-lbl">Expire</span>
                <span className="rsv-cc-val">{data.cardExpiry || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          <div className="rsv-form-grid">
            <Field label="Nom sur la carte" span={2} error={errors.cardName}>
              <input
                type="text"
                placeholder="SOPHIE MARTIN"
                value={data.cardName || ''}
                onChange={(e) => set('cardName', e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Numéro de carte" span={2} error={errors.cardNumber}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={data.cardNumber || ''}
                onChange={(e) => set('cardNumber', fmtCard(e.target.value))}
              />
            </Field>
            <Field label="Date d'expiration" error={errors.cardExpiry}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={data.cardExpiry || ''}
                onChange={(e) => set('cardExpiry', fmtExpiry(e.target.value))}
              />
            </Field>
            <Field label="CVC / CVV" error={errors.cardCvc} hint="Au dos de la carte">
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                value={data.cardCvc || ''}
                onChange={(e) => set('cardCvc', e.target.value.replace(/\D/g,'').slice(0,4))}
              />
            </Field>
          </div>

          <div className="rsv-secure-row">
            <div className="rsv-secure"><span>🔒</span> SSL 256-bit</div>
            <div className="rsv-secure"><span>🛡️</span> 3D Secure</div>
            <div className="rsv-secure"><span>✅</span> PCI-DSS</div>
          </div>
        </Card>

        <Card className="rsv-pay-summary">
          <div className="rsv-pay-summary-head">
            <div className="rsv-pay-summary-icon" style={{ background: formule.color, color: formule.colorDark }}>{formule.icon}</div>
            <div>
              <div className="rsv-pay-summary-eyebrow">Formule</div>
              <div className="rsv-pay-summary-name">{formule.name}</div>
            </div>
          </div>
          <div className="rsv-pay-summary-line"><span>Date</span><strong style={{textTransform:'capitalize'}}>{formatDateLong(new Date(data.date)).split(' ').slice(0,3).join(' ')}</strong></div>
          <div className="rsv-pay-summary-line"><span>Créneau</span><strong>{TIME_SLOTS.find(s=>s.v===data.timeSlot)?.label}</strong></div>
          <div className="rsv-pay-summary-line"><span>Enfants</span><strong>{data.kidsCount}</strong></div>
          <div className="rsv-pay-summary-line"><span>Total fête</span><strong>{formatPrice(formule.price * (+data.kidsCount))}</strong></div>
          <div className="rsv-pay-summary-divider" />
          <div className="rsv-pay-summary-now">
            <span>À payer maintenant</span>
            <span className="rsv-pay-summary-now-val">{formatPrice(DEPOSIT)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary rsv-pay-btn"
            onClick={handlePay}
          >
            🔒 Payer {formatPrice(DEPOSIT)}
          </button>
          <div className="rsv-pay-mini-note">Reste {formatPrice(formule.price * (+data.kidsCount) - DEPOSIT)} à régler sur place.</div>
        </Card>
      </div>

      <NavBar onBack={onBack} backLabel="Modifier" />
    </div>
  );
}

function detectBrand(num) {
  if (!num) return '';
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'MASTERCARD';
  if (/^3[47]/.test(d)) return 'AMEX';
  return '';
}

/* ============================================================
   STEP 7 — Confirmation
   ============================================================ */
function StepConfirmation({ data, onRestart }) {
  const formule = FORMULES.find(f => f.id === data.formuleId);
  const total = formule.price * (+data.kidsCount);
  const remaining = total - DEPOSIT;
  const [copied, setCopied] = useState(false);

  function copyRef() {
    navigator.clipboard?.writeText(data.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rsv-screen rsv-confirm">
      <div className="rsv-confetti" aria-hidden="true">
        {Array.from({length: 60}).map((_, i) => (
          <span key={i} style={{
            left: `${Math.random() * 100}%`,
            background: ['#ffd93d','#ff2d87','#00e5ff','#ff00c8','#39ff14'][i%5],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2.4 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }} />
        ))}
      </div>

      <div className="rsv-confirm-burst">🎉</div>
      <div className="title-badge rsv-confirm-badge">C'est validé&nbsp;!</div>
      <p className="rsv-confirm-lead">
        L'anniversaire de <strong>{data.childName}</strong> est réservé.<br/>
        Un email de confirmation vient d'être envoyé à <strong>{data.parentEmail}</strong>.
      </p>

      <Card className="rsv-confirm-card">
        <div className="rsv-confirm-ref">
          <div className="rsv-confirm-ref-l">Référence de réservation</div>
          <div className="rsv-confirm-ref-v">
            <span>{data.bookingRef}</span>
            <button type="button" className="rsv-confirm-copy" onClick={copyRef}>
              {copied ? '✓ Copié' : 'Copier'}
            </button>
          </div>
        </div>

        <div className="rsv-confirm-grid">
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Formule</span>
            <span className="rsv-confirm-item-v">{formule.icon} {formule.name}</span>
          </div>
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Date</span>
            <span className="rsv-confirm-item-v" style={{textTransform:'capitalize'}}>{formatDateLong(new Date(data.date))}</span>
          </div>
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Créneau</span>
            <span className="rsv-confirm-item-v">{TIME_SLOTS.find(s=>s.v===data.timeSlot)?.label}</span>
          </div>
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Invités</span>
            <span className="rsv-confirm-item-v">{data.kidsCount} enfants</span>
          </div>
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Acompte payé</span>
            <span className="rsv-confirm-item-v" style={{color:'var(--yellow)'}}>{formatPrice(DEPOSIT)} ✓</span>
          </div>
          <div className="rsv-confirm-item">
            <span className="rsv-confirm-item-l">Reste sur place</span>
            <span className="rsv-confirm-item-v">{formatPrice(remaining)}</span>
          </div>
        </div>

        <div className="rsv-confirm-next">
          <div className="rsv-confirm-next-t">📬 Ce qui arrive ensuite</div>
          <ul>
            <li><strong>J−7</strong> · Email de rappel avec le plan d'accès et les conseils pour le jour J</li>
            <li><strong>J−2</strong> · SMS de confirmation finale, dernière chance de modifier le nombre d'enfants</li>
            <li><strong>Jour J</strong> · Arrivée 15 min avant, accueil par notre animateur, paiement du solde</li>
          </ul>
        </div>

        <div className="rsv-confirm-cta">
          <a href="formules.html" className="btn btn-ghost">Voir les autres formules</a>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimer la confirmation</button>
        </div>
        <button type="button" className="rsv-confirm-restart" onClick={onRestart}>← Refaire une réservation (démo)</button>
      </Card>
    </div>
  );
}

Object.assign(window, { StepCoordonnees, StepRecap, StepPaiement, StepConfirmation });
