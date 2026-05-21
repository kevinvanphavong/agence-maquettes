/* Main app — orchestration & state machine */

const ORDER = ['formule', 'date', 'enfant', 'coordonnees', 'recap', 'paiement', 'confirmation'];

function ReservationApp() {
  const [step, setStep] = useState('formule');
  const [completed, setCompleted] = useState([]);
  const [data, setData] = useState(() => {
    let initialFormule = 'superbowler';
    if (typeof window !== 'undefined') {
      const m = window.location.hash.match(/formule=(\w+)/);
      if (m && ['newbowler','superbowler','probowler'].includes(m[1])) {
        initialFormule = m[1];
      }
    }
    return { formuleId: initialFormule, paymentMethod: 'card' };
  });
  const [direction, setDirection] = useState(1);
  const [failureReason, setFailureReason] = useState(null);
  const scrollRef = useRef(null);

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "showHero": true,
    "showTrustStrip": true,
    "paymentOutcome": "success"
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const update = useCallback((patch) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  function goNext() {
    const idx = ORDER.indexOf(step);
    if (idx < ORDER.length - 1) {
      const next = ORDER[idx + 1];
      setDirection(1);
      setCompleted((c) => c.includes(step) ? c : [...c, step]);
      setStep(next);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
  function goBack() {
    const idx = ORDER.indexOf(step);
    if (idx > 0) {
      setDirection(-1);
      setStep(ORDER[idx - 1]);
    }
  }
  function jumpTo(target) {
    if (!completed.includes(target) && target !== step) return;
    setDirection(ORDER.indexOf(target) > ORDER.indexOf(step) ? 1 : -1);
    setStep(target);
  }
  function restart() {
    setStep('formule');
    setCompleted([]);
    setData({ formuleId: 'superbowler', paymentMethod: 'card' });
  }

  // 3DS / failure routing
  function handlePay() {
    setDirection(1);
    setCompleted((c) => c.includes('paiement') ? c : [...c, 'paiement']);
    setStep('3ds');
  }
  function handle3DSSuccess() {
    const ref = genBookingRef();
    update({ bookingRef: ref, paidAt: new Date().toISOString() });
    setDirection(1);
    setStep('confirmation');
  }
  function handle3DSFail(reason) {
    setFailureReason(reason);
    setDirection(1);
    setStep('echec');
  }
  function handleRetryFrom3DS() {
    setDirection(-1);
    setStep('3ds');
  }
  function handleChangeMethod() {
    setDirection(-1);
    setStep('paiement');
    // clear card sensitive fields, keep the rest
    update({ cardNumber: '', cardExpiry: '', cardCvc: '' });
  }
  function handleBackToRecap() {
    setDirection(-1);
    setStep('recap');
  }

  // Hide stepper on terminal/sub screens
  const showStepper = !['confirmation', '3ds', 'echec'].includes(step);

  return (
    <div className="rsv-wrap" ref={scrollRef}>
      {step === 'formule' && t.showHero && (
        <header className="rsv-hero">
          <div className="rsv-hero-inner">
            <div className="breadcrumb">
              <a href="formules.html">Nos Formules</a>
              <span className="sep">›</span>
              <span>Réserver un anniversaire</span>
            </div>
            <span className="section-eyebrow">🎂 Réservation en ligne</span>
            <h1 className="hero-title">
              L'anniversaire de rêve, <span className="pop">en 6 étapes.</span>
            </h1>
            <p className="hero-sub">
              Réservez un anniversaire enfant New Bowler, Super Bowler ou Pro Bowler au Family Games Center, service VIP inclus. Acompte de 50€ pour bloquer la date, le reste se règle sur place. Annulation gratuite jusqu'à 7 jours avant.
            </p>
            <div className="rsv-hero-trust">
              <div className="rsv-hero-trust-item"><span>⭐ 4,9/5</span><span>sur 320+ anniversaires</span></div>
              <div className="rsv-hero-trust-item"><span>🎉 Dès 6 ans</span><span>jusqu'à 14 ans</span></div>
              <div className="rsv-hero-trust-item"><span>🔒 Acompte 50€</span><span>remboursé J-7</span></div>
            </div>
          </div>
        </header>
      )}

      {showStepper && (
        <div className="rsv-stepper-wrap">
          <div className="rsv-stepper-inner">
            <Stepper current={step} onJump={jumpTo} completed={completed} />
          </div>
        </div>
      )}

      <main className="rsv-main">
        <div className={`rsv-stage rsv-anim-${direction > 0 ? 'fwd' : 'back'}`} key={step}>
          {step === 'formule' && (
            <StepFormule data={data} update={update} onNext={goNext} />
          )}
          {step === 'date' && (
            <StepDate data={data} update={update} onNext={goNext} onBack={goBack} />
          )}
          {step === 'enfant' && (
            <StepEnfant data={data} update={update} onNext={goNext} onBack={goBack} />
          )}
          {step === 'coordonnees' && (
            <StepCoordonnees data={data} update={update} onNext={goNext} onBack={goBack} />
          )}
          {step === 'recap' && (
            <StepRecap data={data} onNext={goNext} onBack={goBack} onJump={jumpTo} />
          )}
          {step === 'paiement' && (
            <StepPaiement data={data} update={update} onPay={handlePay} onBack={goBack} />
          )}
          {step === '3ds' && (
            <Step3DS
              data={data}
              onSuccess={handle3DSSuccess}
              onFail={handle3DSFail}
              onBack={() => setStep('paiement')}
              forcedOutcome={t.paymentOutcome}
            />
          )}
          {step === 'echec' && (
            <StepEchec
              data={data}
              reason={failureReason}
              onRetry={handleRetryFrom3DS}
              onChangeMethod={handleChangeMethod}
              onBack={handleBackToRecap}
            />
          )}
          {step === 'confirmation' && (
            <StepConfirmation data={data} onRestart={restart} />
          )}
        </div>
      </main>

      {t.showTrustStrip && !['confirmation', '3ds', 'echec'].includes(step) && (
        <section className="rsv-trust-strip">
          <div className="rsv-trust-strip-inner">
            <div className="rsv-trust">
              <div className="rsv-trust-ic">🔒</div>
              <div>
                <div className="rsv-trust-t">Paiement 100% sécurisé</div>
                <div className="rsv-trust-s">Cryptage SSL 256-bit · 3D Secure</div>
              </div>
            </div>
            <div className="rsv-trust">
              <div className="rsv-trust-ic">↩️</div>
              <div>
                <div className="rsv-trust-t">Annulation gratuite</div>
                <div className="rsv-trust-s">Acompte remboursé jusqu'à 7 jours avant</div>
              </div>
            </div>
            <div className="rsv-trust">
              <div className="rsv-trust-ic">📞</div>
              <div>
                <div className="rsv-trust-t">Une question&nbsp;?</div>
                <div className="rsv-trust-s"><a href="tel:0254748521" style={{color:'var(--yellow)'}}>02 54 74 85 21</a></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection title="Affichage">
            <window.TweakToggle
              label="Bandeau d'intro (étape 1)"
              value={t.showHero}
              onChange={(v) => setTweak('showHero', v)}
            />
            <window.TweakToggle
              label="Bande de réassurance (bas de page)"
              value={t.showTrustStrip}
              onChange={(v) => setTweak('showTrustStrip', v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Démo paiement">
            <window.TweakSelect
              label="Scénario banque"
              value={t.paymentOutcome}
              onChange={(v) => setTweak('paymentOutcome', v)}
              options={[
                { value: 'success', label: '✓ Paiement validé' },
                { value: 'fail-3ds', label: '✗ Code 3DS refusé' },
                { value: 'fail-bank', label: '✗ Banque refuse' },
                { value: 'fail-timeout', label: '✗ Timeout banque' },
              ]}
            />
          </window.TweakSection>
          <window.TweakSection title="Démo flow">
            <window.TweakButton onClick={() => {
              setData({
                formuleId: 'superbowler',
                date: (() => { const d = new Date(); d.setDate(d.getDate() + 21); return d.toISOString().slice(0,10); })(),
                timeSlot: '14:30',
                childName: 'Léa',
                childAge: 8,
                kidsCount: 10,
                cakeNote: 'Thème licorne, avec son prénom',
                allergies: '',
                parentFirstName: 'Sophie',
                parentLastName: 'Martin',
                parentEmail: 'sophie.martin@exemple.fr',
                parentPhone: '06 12 34 56 78',
                acceptCGV: true,
                paymentMethod: 'card',
                cardName: 'SOPHIE MARTIN',
                cardNumber: '4242 4242 4242 4242',
                cardExpiry: '12/28',
                cardCvc: '123',
              });
              setCompleted(['formule','date','enfant','coordonnees','recap']);
            }}>
              Pré-remplir tous les champs
            </window.TweakButton>
            <window.TweakRadio
              label="Sauter à l'étape"
              value={step}
              onChange={(v) => { setStep(v); }}
              options={[
                {value:'formule', label:'1'},
                {value:'date', label:'2'},
                {value:'enfant', label:'3'},
                {value:'coordonnees', label:'4'},
                {value:'recap', label:'5'},
                {value:'paiement', label:'6'},
              ]}
            />
            <window.TweakRadio
              label="Écrans bancaires"
              value={step}
              onChange={(v) => {
                if (v === 'echec') setFailureReason('declined');
                setStep(v);
              }}
              options={[
                {value:'3ds', label:'3D Secure'},
                {value:'echec', label:'Échec'},
                {value:'confirmation', label:'Succès'},
              ]}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ReservationApp />);
