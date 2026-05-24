/* Steps 1-3: Formule selection / Date & créneau / Détails enfant */

/* ============================================================
   STEP 1 — Choix de la formule
   ============================================================ */
function StepFormule({ data, update, onNext }) {
  const selected = data.formuleId;

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 1 · La formule"
        title="Quel pack pour le"
        accent="grand jour ?"
        sub="Trois formules clés en main — à partir de 6 enfants. Les prix sont par enfant invité, l'enfant qui fête son anniversaire est offert."
      />

      <div className="rsv-formules">
        {FORMULES.map((f) => {
          const isSel = selected === f.id;
          return (
            <button
              type="button"
              key={f.id}
              className={`rsv-formule ${isSel ? 'selected' : ''} ${f.popular ? 'popular' : ''}`}
              onClick={() => update({ formuleId: f.id })}
              style={{
                '--f-color': f.color,
                '--f-color-dark': f.colorDark,
              }}
            >
              {f.popular && <span className="rsv-formule-flag">★ Le plus populaire</span>}
              <span className="rsv-formule-chip">{f.chip}</span>
              <div className="rsv-formule-icon">{f.icon}</div>
              <div className="rsv-formule-name">{f.name}</div>
              <div className="rsv-formule-tagline">{f.tagline}</div>
              <div className="rsv-formule-price">
                <span className="rsv-formule-price-val">{f.price.toString().replace('.', ',')}</span>
                <span className="rsv-formule-price-cur">€</span>
                <span className="rsv-formule-price-unit">/enfant</span>
              </div>
              <div className="rsv-formule-duration">⏱️ {f.duration} · dès {f.minKids} enfants · âge conseillé {f.ageRange}</div>
              <ul className="rsv-formule-feats">
                {f.features.map((feat, i) => (
                  <li key={i}>
                    <span className="rsv-formule-feat-ic">{feat.ic}</span>
                    <div>
                      <div className="rsv-formule-feat-t">{feat.t}</div>
                      <div className="rsv-formule-feat-s">{feat.s}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <span className="rsv-formule-radio">
                {isSel ? <span className="rsv-formule-radio-dot">✓</span> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rsv-deposit-banner">
        <div className="rsv-deposit-banner-ic">🔒</div>
        <div>
          <div className="rsv-deposit-banner-t">Acompte de 50€ pour valider la réservation</div>
          <div className="rsv-deposit-banner-s">Le solde se règle sur place le jour de l'anniversaire. Annulation gratuite jusqu'à 7 jours avant.</div>
        </div>
      </div>

      <NavBar
        onNext={onNext}
        nextLabel="Choisir la date"
        disabled={!selected}
        hint={selected ? `Formule ${FORMULES.find(f=>f.id===selected).name} sélectionnée` : 'Sélectionnez une formule pour continuer'}
      />
    </div>
  );
}

/* ============================================================
   STEP 2 — Date & créneau
   ============================================================ */
function StepDate({ data, update, onNext, onBack }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const minDate = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 7); return d; }, [today]);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = data.date ? new Date(data.date) : minDate;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const monthGrid = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const last = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7; // make Monday=0
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  function selectDate(d) {
    if (!d) return;
    if (d < minDate) return;
    update({ date: d.toISOString().slice(0, 10) });
  }

  const selectedDate = data.date ? new Date(data.date) : null;
  const canContinue = !!data.date && !!data.timeSlot;

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 2 · Date & créneau"
        title="Quand venez-vous"
        accent="faire la fête ?"
        sub="Réservation possible à partir de 7 jours à l'avance. Plus de visibilité, plus de chance d'avoir LA date parfaite."
      />

      <div className="rsv-date-grid">
        <Card className="rsv-cal">
          <div className="rsv-cal-head">
            <button
              type="button"
              className="rsv-cal-nav"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              disabled={viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() === today.getMonth()}
              aria-label="Mois précédent"
            >‹</button>
            <div className="rsv-cal-title">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </div>
            <button
              type="button"
              className="rsv-cal-nav"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              aria-label="Mois suivant"
            >›</button>
          </div>
          <div className="rsv-cal-days">
            {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d) => (
              <div key={d} className="rsv-cal-dayname">{d}</div>
            ))}
            {monthGrid.map((d, i) => {
              if (!d) return <div key={i} className="rsv-cal-cell empty" />;
              const isPast = d < minDate;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const iso = d.toISOString().slice(0, 10);
              const isSel = data.date === iso;
              return (
                <button
                  key={i}
                  type="button"
                  className={`rsv-cal-cell ${isPast ? 'past' : ''} ${isSel ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}
                  disabled={isPast}
                  onClick={() => selectDate(d)}
                >
                  <span className="rsv-cal-num">{d.getDate()}</span>
                  {isWeekend && !isPast && <span className="rsv-cal-tag">★</span>}
                </button>
              );
            })}
          </div>
          <div className="rsv-cal-legend">
            <span><i className="lg-pa" /> Indisponible</span>
            <span><i className="lg-we" /> Week-end (recommandé)</span>
            <span><i className="lg-se" /> Sélectionné</span>
          </div>
        </Card>

        <Card className="rsv-slots">
          <div className="rsv-slots-head">
            <div className="rsv-slots-title">Créneau</div>
            <div className="rsv-slots-sub">
              {selectedDate ? formatDateLong(selectedDate) : 'Choisissez d’abord une date'}
            </div>
          </div>
          <div className="rsv-slots-list">
            {TIME_SLOTS.map((slot) => {
              const isSel = data.timeSlot === slot.v;
              const isDisabled = !selectedDate;
              return (
                <button
                  type="button"
                  key={slot.v}
                  className={`rsv-slot ${isSel ? 'selected' : ''}`}
                  onClick={() => update({ timeSlot: slot.v })}
                  disabled={isDisabled}
                >
                  <span className="rsv-slot-period">{slot.period}</span>
                  <span className="rsv-slot-time">{slot.label}</span>
                  <span className="rsv-slot-radio">{isSel ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <NavBar
        onBack={onBack}
        onNext={onNext}
        disabled={!canContinue}
        hint={canContinue
          ? `${formatDateLong(selectedDate)} — ${TIME_SLOTS.find(s=>s.v===data.timeSlot)?.label}`
          : 'Sélectionnez une date et un créneau'}
      />
    </div>
  );
}

/* ============================================================
   STEP 3 — Détails enfant
   ============================================================ */
function StepEnfant({ data, update, onNext, onBack }) {
  const formule = FORMULES.find(f => f.id === data.formuleId);
  const minKids = formule?.minKids || 6;
  const [errors, setErrors] = useState({});

  function set(k, v) {
    update({ [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  }

  function validate() {
    const e = {};
    if (!data.childName?.trim()) e.childName = 'Le prénom de l’enfant est requis';
    if (!data.childAge) e.childAge = 'Indiquez l’âge';
    else if (+data.childAge < 4 || +data.childAge > 14) e.childAge = 'Entre 4 et 14 ans';
    if (!data.kidsCount) e.kidsCount = 'Indiquez le nombre d’enfants';
    else if (+data.kidsCount < minKids) e.kidsCount = `Minimum ${minKids} enfants pour cette formule`;
    else if (+data.kidsCount > 25) e.kidsCount = 'Maximum 25 enfants (au-delà, contactez-nous)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() { if (validate()) onNext(); }

  const totalPrice = useMemo(() => {
    if (!formule || !data.kidsCount) return null;
    return formule.price * (+data.kidsCount);
  }, [formule, data.kidsCount]);

  return (
    <div className="rsv-screen">
      <StepHeader
        eyebrow="Étape 3 · Le héros du jour"
        title="Parlez-nous"
        accent="de l’enfant."
        sub="Quelques détails pour personnaliser la fête — gâteau, décoration, médaille, animation."
      />

      <Card className="rsv-form-card">
        <div className="rsv-form-grid">
          <Field label="Prénom de l'enfant" error={errors.childName}>
            <input
              type="text"
              placeholder="Léo, Camille, Inès…"
              value={data.childName || ''}
              onChange={(e) => set('childName', e.target.value)}
            />
          </Field>
          <Field label="Âge fêté" error={errors.childAge}>
            <div className="rsv-age-picker">
              {[4,5,6,7,8,9,10,11,12,13,14].map(a => (
                <button
                  type="button"
                  key={a}
                  className={`rsv-age ${+data.childAge === a ? 'selected' : ''}`}
                  onClick={() => set('childAge', a)}
                >{a}<span>ans</span></button>
              ))}
            </div>
          </Field>
          <Field
            label={`Nombre d'enfants (héros inclus)`}
            error={errors.kidsCount}
            hint={`Minimum ${minKids} enfants pour la formule ${formule?.name}. L'enfant qui fête est inclus dans le compte.`}
          >
            <div className="rsv-count-picker">
              <button type="button" className="rsv-count-btn" onClick={() => set('kidsCount', Math.max(minKids, (+data.kidsCount || minKids) - 1))}>−</button>
              <input
                type="number"
                min={minKids}
                max={25}
                value={data.kidsCount || ''}
                placeholder={minKids}
                onChange={(e) => set('kidsCount', e.target.value)}
              />
              <button type="button" className="rsv-count-btn" onClick={() => set('kidsCount', Math.min(25, (+data.kidsCount || minKids) + 1))}>+</button>
            </div>
          </Field>
          <Field label="Souhait spécifique sur le gâteau (optionnel)" span={2}>
            <input
              type="text"
              placeholder="Ex : thème Pokémon, sans gluten, prénom à écrire…"
              value={data.cakeNote || ''}
              onChange={(e) => set('cakeNote', e.target.value)}
            />
          </Field>
          <Field label="Allergies / régimes (optionnel)" span={2}>
            <input
              type="text"
              placeholder="Ex : allergie cacahuète, intolérance lactose, végétarien…"
              value={data.allergies || ''}
              onChange={(e) => set('allergies', e.target.value)}
            />
          </Field>
        </div>

        {totalPrice && (
          <div className="rsv-running-total">
            <div>
              <div className="rsv-running-total-l">Estimation pour {data.kidsCount} enfants</div>
              <div className="rsv-running-total-s">Formule {formule.name} · {formule.price.toString().replace('.',',')}€/enfant</div>
            </div>
            <div className="rsv-running-total-v">{formatPrice(totalPrice)}</div>
          </div>
        )}
      </Card>

      <NavBar
        onBack={onBack}
        onNext={handleNext}
        nextLabel="Vos coordonnées"
        disabled={!data.childName || !data.childAge || !data.kidsCount}
      />
    </div>
  );
}

Object.assign(window, { StepFormule, StepDate, StepEnfant });
