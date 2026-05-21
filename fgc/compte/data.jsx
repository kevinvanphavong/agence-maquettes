/* Mock user data + helpers for the account dashboard */

const USER = {
  firstName: 'Sophie',
  lastName: 'Martin',
  email: 'sophie@fgc.fr',
  phone: '06 12 34 56 78',
  birthdate: '1988-04-23',
  city: 'Blois',
  joined: '2024-09-14',
  avatar: null, // initials shown instead
  memberLevel: 'Bowling Gold',
  preferences: {
    newsletter: true,
    smsReminders: true,
    birthdayGift: true,
  },
};

const CHILDREN = [
  {
    id: 'c1',
    firstName: 'Léa',
    birthdate: '2017-06-12',
    favoriteActivity: 'Bowling',
    allergies: 'Aucune connue',
    lastParty: '2025-06-14',
  },
  {
    id: 'c2',
    firstName: 'Tom',
    birthdate: '2014-11-03',
    favoriteActivity: 'Arcade',
    allergies: 'Intolérance au lactose',
    lastParty: null,
  },
];

const RESERVATIONS = [
  {
    id: 'FGC-RX42KP',
    type: 'anniversaire',
    status: 'confirmé',
    formule: 'Super Bowler',
    formuleColor: '#ffd93d',
    formuleIcon: '🏆',
    date: addDays(12),
    timeLabel: '14h30 – 17h00',
    childName: 'Léa',
    kidsCount: 10,
    totalPrice: 225,
    depositPaid: 50,
    leftToPay: 175,
    bookedAt: addDays(-9),
  },
  {
    id: 'FGC-PA7HMC',
    type: 'pack',
    status: 'confirmé',
    formule: 'Pass Confort',
    formuleColor: '#ff2d87',
    formuleIcon: '🎯',
    date: addDays(25),
    timeLabel: '20h00',
    peopleCount: 4,
    totalPrice: 107.6,
    depositPaid: 0,
    leftToPay: 107.6,
    bookedAt: addDays(-3),
  },
  {
    id: 'FGC-MN3BTQ',
    type: 'anniversaire',
    status: 'terminé',
    formule: 'New Bowler',
    formuleColor: '#c9d1d9',
    formuleIcon: '🎳',
    date: addDays(-45),
    timeLabel: '14h00 – 16h00',
    childName: 'Léa',
    kidsCount: 8,
    totalPrice: 148,
    depositPaid: 50,
    leftToPay: 0,
    bookedAt: addDays(-72),
    rating: 5,
  },
  {
    id: 'FGC-KL9ZTH',
    type: 'pack',
    status: 'terminé',
    formule: 'Pack Afterwork',
    formuleColor: '#ff2d87',
    formuleIcon: '🍕',
    date: addDays(-90),
    timeLabel: '19h30',
    peopleCount: 6,
    totalPrice: 68,
    depositPaid: 0,
    leftToPay: 0,
    bookedAt: addDays(-95),
    rating: 4,
  },
  {
    id: 'FGC-WS1FGB',
    type: 'reservation',
    status: 'annulé',
    formule: 'SILVER',
    formuleColor: '#c9d1d9',
    formuleIcon: '🥈',
    date: addDays(-110),
    timeLabel: '20h30',
    peopleCount: 8,
    totalPrice: 151.2,
    depositPaid: 0,
    leftToPay: 0,
    bookedAt: addDays(-130),
    refunded: true,
  },
];

const LOYALTY = {
  cardType: 'Carte 8 parties',
  totalParties: 8,
  usedParties: 3,
  remainingParties: 5,
  expiresAt: addDays(280),
  purchaseDate: addDays(-85),
  purchasePrice: 52,
  perPartyValue: 6.5,
  usage: [
    { date: addDays(-12), activity: 'Bowling adulte', count: 1 },
    { date: addDays(-34), activity: 'Bowling adulte', count: 1 },
    { date: addDays(-58), activity: 'Bowling adulte', count: 1 },
  ],
};

const PAYMENT_METHODS = [
  {
    id: 'pm1',
    brand: 'visa',
    last4: '4242',
    expiry: '12/28',
    holder: 'SOPHIE MARTIN',
    isDefault: true,
  },
  {
    id: 'pm2',
    brand: 'mastercard',
    last4: '5588',
    expiry: '04/27',
    holder: 'SOPHIE MARTIN',
    isDefault: false,
  },
];

const INVOICES = [
  { id: 'F2025-04231', date: addDays(-9), amount: 50, label: 'Acompte anniversaire Léa · Super Bowler', status: 'payée', method: 'Visa •••• 4242' },
  { id: 'F2025-03998', date: addDays(-45), amount: 98, label: 'Solde anniversaire Léa · New Bowler', status: 'payée', method: 'CB sur place' },
  { id: 'F2025-03450', date: addDays(-72), amount: 50, label: 'Acompte anniversaire Léa · New Bowler', status: 'payée', method: 'Visa •••• 4242' },
  { id: 'F2025-03012', date: addDays(-90), amount: 68, label: 'Pack Afterwork', status: 'payée', method: 'CB sur place' },
  { id: 'F2025-02400', date: addDays(-85), amount: 52, label: 'Carte 8 parties bowling', status: 'payée', method: 'Visa •••• 4242' },
];

const NOTIFICATIONS = [
  { id: 'n1', type: 'reminder', read: false, at: addDays(-1), title: 'Anniversaire de Léa dans 12 jours', body: 'Pensez à confirmer le nombre final d\'enfants 48h avant la fête.', cta: 'Voir la réservation', target: 'reservations' },
  { id: 'n2', type: 'success', read: false, at: addDays(-3), title: 'Pack Confort réservé', body: 'Votre réservation FGC-PA7HMC est confirmée pour le ' + formatDate(addDays(25)) + '.', cta: 'Voir le détail', target: 'reservations' },
  { id: 'n3', type: 'gift', read: true, at: addDays(-12), title: 'Joyeux anniversaire ! 🎁', body: 'Profitez d\'une partie de bowling offerte ce mois-ci avec le code BIRTHDAY-2025.', cta: 'Voir mon cadeau', target: 'fidelite' },
  { id: 'n4', type: 'info', read: true, at: addDays(-30), title: 'Nouvelle activité : Blindtest', body: 'Découvrez notre nouvelle box blindtest, dès 46€/session jusqu\'à 8 joueurs.', cta: 'Découvrir', target: null },
  { id: 'n5', type: 'success', read: true, at: addDays(-45), title: 'Merci pour votre visite !', body: 'L\'anniversaire de Léa s\'est bien passé ? Laissez-nous un avis pour aider les autres familles.', cta: 'Laisser un avis', target: 'reservations' },
];

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatDateLong(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function priceFr(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}
function ageFromBirthdate(iso) {
  if (!iso) return null;
  const b = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
function daysUntil(iso) {
  const d = new Date(iso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / (24 * 3600 * 1000));
}
function initials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
}
function relativeFromNow(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const day = 24 * 3600 * 1000;
  const days = Math.floor(diffMs / day);
  if (days < 1) return 'aujourd\'hui';
  if (days < 2) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

Object.assign(window, {
  USER, CHILDREN, RESERVATIONS, LOYALTY, PAYMENT_METHODS, INVOICES, NOTIFICATIONS,
  formatDate, formatDateShort, formatDateLong, priceFr, ageFromBirthdate, daysUntil, initials, relativeFromNow,
});
