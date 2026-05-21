/* Account dashboard sections (part 1): Dashboard, Réservations, Enfants */

/* ============================================================
   1) DASHBOARD
   ============================================================ */
function SectionDashboard({ onJump, welcome }) {
  const nextResa = RESERVATIONS
    .filter(r => r.status === 'confirmé' && new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const upcoming = RESERVATIONS.filter(r => r.status === 'confirmé').length;
  const totalGames = LOYALTY.usedParties;
  const remaining = LOYALTY.remainingParties;
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="acc-screen">
      {welcome && (
        <div className="acc-welcome">
          <div className="acc-welcome-burst">🎉</div>
          <div>
            <strong>Bienvenue au Family Games Center, {USER.firstName} !</strong>
            <span>Votre compte est créé. Profitez d'un cadeau de bienvenue le jour de votre prochaine visite.</span>
          </div>
        </div>
      )}

      <SectionHeader
        eyebrow={`Bonjour ${USER.firstName} 👋`}
        title="Bienvenue dans votre"
        accent="espace."
        sub="Tout sur vos réservations, votre fidélité et vos sorties au Family Games Center."
      />

      {nextResa && (
        <Card className="acc-next-resa">
          <div className="acc-next-resa-tag">Prochaine réservation</div>
          <div className="acc-next-resa-grid">
            <div>
              <div className="acc-next-resa-formule">
                <span className="acc-next-resa-icon" style={{ background: nextResa.formuleColor, color: '#2a1458' }}>{nextResa.formuleIcon}</span>
                <div>
                  <div className="acc-next-resa-eyebrow">
                    {nextResa.type === 'anniversaire' ? `Anniversaire de ${nextResa.childName}` :
                     nextResa.type === 'pack' ? 'Pack multi-activités' : 'Sortie groupe'}
                  </div>
                  <div className="acc-next-resa-name">{nextResa.formule}</div>
                </div>
              </div>
              <div className="acc-next-resa-detail">
                <div><span>📅</span> <strong style={{textTransform:'capitalize'}}>{formatDateLong(nextResa.date)}</strong></div>
                <div><span>⏱️</span> {nextResa.timeLabel}</div>
                <div><span>👥</span> {nextResa.kidsCount || nextResa.peopleCount} {nextResa.type === 'anniversaire' ? 'enfants' : 'personnes'}</div>
                <div><span>🎟️</span> Réf. <code>{nextResa.id}</code></div>
              </div>
            </div>
            <div className="acc-next-resa-side">
              <div className="acc-countdown">
                <div className="acc-countdown-n">{daysUntil(nextResa.date)}</div>
                <div className="acc-countdown-l">jour{daysUntil(nextResa.date) > 1 ? 's' : ''} restants</div>
              </div>
              <div className="acc-next-resa-money">
                <div><span>Acompte payé</span><strong style={{color:'#84cc16'}}>{priceFr(nextResa.depositPaid)}</strong></div>
                <div><span>Reste sur place</span><strong>{priceFr(nextResa.leftToPay)}</strong></div>
              </div>
              <div className="acc-next-resa-cta">
                <button type="button" className="btn btn-primary" onClick={() => onJump('reservations')}>Voir le détail</button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="acc-stats-grid">
        <Card className="acc-stat">
          <div className="acc-stat-ic">🎳</div>
          <div className="acc-stat-val">{totalGames + remaining}</div>
          <div className="acc-stat-label">Parties achetées sur carte</div>
          <button type="button" className="acc-stat-link" onClick={() => onJump('fidelite')}>Voir ma carte →</button>
        </Card>
        <Card className="acc-stat">
          <div className="acc-stat-ic">📅</div>
          <div className="acc-stat-val">{upcoming}</div>
          <div className="acc-stat-label">Réservation{upcoming > 1 ? 's' : ''} à venir</div>
          <button type="button" className="acc-stat-link" onClick={() => onJump('reservations')}>Toutes les voir →</button>
        </Card>
        <Card className="acc-stat">
          <div className="acc-stat-ic">👶</div>
          <div className="acc-stat-val">{CHILDREN.length}</div>
          <div className="acc-stat-label">Enfant{CHILDREN.length > 1 ? 's' : ''} enregistré{CHILDREN.length > 1 ? 's' : ''}</div>
          <button type="button" className="acc-stat-link" onClick={() => onJump('enfants')}>Gérer →</button>
        </Card>
        <Card className="acc-stat">
          <div className="acc-stat-ic">🔔</div>
          <div className="acc-stat-val">{unread}</div>
          <div className="acc-stat-label">Notification{unread > 1 ? 's' : ''} non lue{unread > 1 ? 's' : ''}</div>
          <button type="button" className="acc-stat-link" onClick={() => onJump('notifications')}>Consulter →</button>
        </Card>
      </div>

      <div className="acc-dashboard-row">
        <Card className="acc-quick-actions">
          <h3 className="acc-card-title">⚡ Actions rapides</h3>
          <div className="acc-quick-grid">
            <a href="reserver-anniversaire.html" className="acc-quick">
              <span className="acc-quick-ic" style={{background:'var(--pink-hot)'}}>🎂</span>
              <strong>Réserver un anniversaire</strong>
              <span>Pour {CHILDREN[0]?.firstName} ou un autre enfant</span>
            </a>
            <a href="formules.html#pass" className="acc-quick">
              <span className="acc-quick-ic" style={{background:'var(--yellow)',color:'var(--purple-light)'}}>🎯</span>
              <strong>Voir les Pass</strong>
              <span>Multi-activités à prix réduit</span>
            </a>
            <a href="tarifs.html" className="acc-quick">
              <span className="acc-quick-ic" style={{background:'var(--cyan)',color:'var(--purple-light)'}}>💳</span>
              <strong>Recharger ma carte</strong>
              <span>5, 8 ou 14 parties au choix</span>
            </a>
            <a href="contact.html" className="acc-quick">
              <span className="acc-quick-ic">📞</span>
              <strong>Nous contacter</strong>
              <span>Question, devis, événement</span>
            </a>
          </div>
        </Card>

        <Card className="acc-activity">
          <h3 className="acc-card-title">📜 Activité récente</h3>
          <ul className="acc-timeline">
            {RESERVATIONS.slice(0, 4).map((r, i) => (
              <li key={r.id}>
                <div className="acc-timeline-dot" style={{background: r.formuleColor}} />
                <div className="acc-timeline-body">
                  <div className="acc-timeline-title">
                    {r.type === 'anniversaire' ? `Anniversaire ${r.childName}` : r.formule}
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="acc-timeline-meta">{formatDate(r.date)} · {priceFr(r.totalPrice)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   2) RÉSERVATIONS
   ============================================================ */
function SectionReservations() {
  const [tab, setTab] = useState('upcoming');
  const [selected, setSelected] = useState(null);

  const upcoming = RESERVATIONS.filter(r => r.status === 'confirmé');
  const past = RESERVATIONS.filter(r => r.status === 'terminé' || r.status === 'annulé');
  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="acc-screen">
      <SectionHeader
        eyebrow="📅 Vos sorties"
        title="Mes"
        accent="réservations."
        sub="Toutes vos réservations passées et à venir, avec leurs détails et factures."
        actions={
          <a href="reserver-anniversaire.html" className="btn btn-primary">+ Nouvelle réservation</a>
        }
      />

      <div className="acc-tabs">
        <button type="button" className={`acc-tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => { setTab('upcoming'); setSelected(null); }}>
          À venir <span className="acc-tab-count">{upcoming.length}</span>
        </button>
        <button type="button" className={`acc-tab ${tab === 'past' ? 'active' : ''}`} onClick={() => { setTab('past'); setSelected(null); }}>
          Passées <span className="acc-tab-count">{past.length}</span>
        </button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="🎳"
          title={tab === 'upcoming' ? 'Aucune réservation à venir' : 'Aucune réservation passée'}
          sub={tab === 'upcoming' ? 'Profitez-en pour planifier votre prochaine sortie !' : 'Vos réservations terminées apparaîtront ici.'}
          cta={tab === 'upcoming' ? <a href="formules.html" className="btn btn-primary">Voir les formules</a> : null}
        />
      ) : (
        <div className="acc-resa-list">
          {list.map((r) => (
            <ResaCard key={r.id} r={r} expanded={selected === r.id} onToggle={() => setSelected(selected === r.id ? null : r.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResaCard({ r, expanded, onToggle }) {
  const days = daysUntil(r.date);
  return (
    <Card className={`acc-resa ${expanded ? 'expanded' : ''}`}>
      <div className="acc-resa-summary" onClick={onToggle} role="button">
        <div className="acc-resa-icon" style={{ background: r.formuleColor, color: '#2a1458' }}>{r.formuleIcon}</div>
        <div className="acc-resa-main">
          <div className="acc-resa-name">
            {r.type === 'anniversaire' ? `Anniversaire ${r.childName}` : r.formule}
            <StatusBadge status={r.status} />
          </div>
          <div className="acc-resa-meta">
            <span>{r.formule}</span><span>·</span>
            <span style={{textTransform:'capitalize'}}>{formatDate(r.date)}</span><span>·</span>
            <span>{r.timeLabel}</span><span>·</span>
            <span>{r.kidsCount || r.peopleCount} {r.type === 'anniversaire' ? 'enfants' : 'pers.'}</span>
          </div>
        </div>
        <div className="acc-resa-right">
          {r.status === 'confirmé' && days >= 0 && (
            <div className="acc-resa-countdown">
              <strong>J−{days}</strong>
              <span>restants</span>
            </div>
          )}
          <div className="acc-resa-price">{priceFr(r.totalPrice)}</div>
          <button type="button" className="acc-resa-chevron">{expanded ? '▴' : '▾'}</button>
        </div>
      </div>

      {expanded && (
        <div className="acc-resa-detail">
          <div className="acc-resa-detail-grid">
            <div className="acc-resa-detail-block">
              <h4>Informations</h4>
              <div className="acc-resa-row"><span>Référence</span><code>{r.id}</code></div>
              <div className="acc-resa-row"><span>Réservé le</span><strong>{formatDateShort(r.bookedAt)}</strong></div>
              <div className="acc-resa-row"><span>Date de la fête</span><strong style={{textTransform:'capitalize'}}>{formatDateLong(r.date)}</strong></div>
              <div className="acc-resa-row"><span>Créneau</span><strong>{r.timeLabel}</strong></div>
              {r.type === 'anniversaire' && (
                <div className="acc-resa-row"><span>Enfant</span><strong>{r.childName} · {r.kidsCount} invités</strong></div>
              )}
              {r.type !== 'anniversaire' && (
                <div className="acc-resa-row"><span>Participants</span><strong>{r.peopleCount} personnes</strong></div>
              )}
              {r.rating && (
                <div className="acc-resa-row"><span>Votre avis</span><strong>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</strong></div>
              )}
              {r.refunded && (
                <div className="acc-resa-row"><span>Acompte</span><strong style={{color:'#84cc16'}}>Remboursé</strong></div>
              )}
            </div>
            <div className="acc-resa-detail-block">
              <h4>Paiement</h4>
              <div className="acc-resa-row"><span>Total</span><strong>{priceFr(r.totalPrice)}</strong></div>
              {r.depositPaid > 0 && (
                <div className="acc-resa-row"><span>Acompte payé</span><strong style={{color:'#84cc16'}}>{priceFr(r.depositPaid)} ✓</strong></div>
              )}
              {r.leftToPay > 0 ? (
                <div className="acc-resa-row"><span>Reste sur place</span><strong style={{color:'var(--yellow)'}}>{priceFr(r.leftToPay)}</strong></div>
              ) : r.status !== 'annulé' && (
                <div className="acc-resa-row"><span>Solde</span><strong style={{color:'#84cc16'}}>Réglé intégralement ✓</strong></div>
              )}
            </div>
          </div>

          <div className="acc-resa-actions">
            {r.status === 'confirmé' && (
              <>
                <button type="button" className="btn btn-ghost">📄 Télécharger la confirmation</button>
                <button type="button" className="btn btn-ghost">✏️ Modifier le nombre d'invités</button>
                <button type="button" className="btn btn-ghost" style={{color:'#f87171',borderColor:'rgba(248,113,113,0.4)'}}>✕ Annuler la réservation</button>
              </>
            )}
            {r.status === 'terminé' && !r.rating && (
              <button type="button" className="btn btn-primary">⭐ Laisser un avis</button>
            )}
            {r.status === 'terminé' && (
              <button type="button" className="btn btn-ghost">📄 Télécharger la facture</button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================================================
   3) ENFANTS
   ============================================================ */
function SectionEnfants() {
  const [adding, setAdding] = useState(false);
  return (
    <div className="acc-screen">
      <SectionHeader
        eyebrow="👶 Vos petits champions"
        title="Mes"
        accent="enfants."
        sub="Enregistrez les profils de vos enfants pour réserver leur anniversaire en quelques clics, avec leurs préférences."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>+ Ajouter un enfant</button>
        }
      />

      {adding && (
        <Card className="acc-child-form">
          <h3 className="acc-card-title">Nouveau profil</h3>
          <div className="acc-form-grid">
            <div className="acc-field">
              <label>Prénom</label>
              <input type="text" placeholder="Camille" />
            </div>
            <div className="acc-field">
              <label>Date de naissance</label>
              <input type="date" />
            </div>
            <div className="acc-field">
              <label>Activité préférée</label>
              <select defaultValue="">
                <option value="">— Choisir —</option>
                <option>Bowling</option>
                <option>Arcade</option>
                <option>Réalité Virtuelle</option>
                <option>Karaoké</option>
                <option>Fléchettes</option>
              </select>
            </div>
            <div className="acc-field">
              <label>Allergies / régime</label>
              <input type="text" placeholder="Ex : intolérance au lactose" />
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:18,justifyContent:'flex-end'}}>
            <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>Annuler</button>
            <button type="button" className="btn btn-primary" onClick={() => setAdding(false)}>Enregistrer</button>
          </div>
        </Card>
      )}

      <div className="acc-children-grid">
        {CHILDREN.map((c) => (
          <Card key={c.id} className="acc-child">
            <div className="acc-child-head">
              <div className="acc-child-avatar">{c.firstName[0]}</div>
              <div>
                <div className="acc-child-name">{c.firstName}</div>
                <div className="acc-child-age">{ageFromBirthdate(c.birthdate)} ans · né(e) le {formatDateShort(c.birthdate)}</div>
              </div>
            </div>
            <div className="acc-child-fields">
              <div className="acc-child-row">
                <span>Activité préférée</span>
                <strong>{c.favoriteActivity}</strong>
              </div>
              <div className="acc-child-row">
                <span>Allergies</span>
                <strong>{c.allergies}</strong>
              </div>
              <div className="acc-child-row">
                <span>Dernier anniversaire fêté</span>
                <strong>{c.lastParty ? formatDate(c.lastParty) : 'Jamais'}</strong>
              </div>
            </div>
            <div className="acc-child-actions">
              <a href={`reserver-anniversaire.html#formule=${ageFromBirthdate(c.birthdate) <= 8 ? 'newbowler' : ageFromBirthdate(c.birthdate) <= 10 ? 'superbowler' : 'probowler'}`} className="btn btn-primary">🎂 Réserver l'anniversaire</a>
              <button type="button" className="btn btn-ghost">✏️ Modifier</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SectionDashboard, SectionReservations, SectionEnfants });
