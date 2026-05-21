/* Data + helpers for the booking tunnel — exposed on window for cross-file scope */

const FORMULES = [
  {
    id: 'newbowler',
    name: 'New Bowler',
    tagline: 'La première fête de bowling — taillée pour les plus jeunes',
    price: 18.5,
    duration: '2h',
    minKids: 6,
    ageRange: '6 à 8 ans',
    color: '#c9d1d9',
    colorDark: '#7a8493',
    icon: '🎳',
    chip: 'Découverte',
    features: [
      { ic: '🎳', t: '1 partie de bowling', s: 'Avec chaussures incluses · gouttières relevées' },
      { ic: '🕹️', t: '1 jeton arcade par enfant', s: 'À dépenser librement après le bowling' },
      { ic: '🍰', t: 'Goûter d’anniversaire complet', s: 'Gâteau, boissons, bonbons' },
      { ic: '✨', t: 'Service VIP anniversaire', s: 'Coupe-file, table dédiée, référent, médailles, polaroïd' },
    ],
  },
  {
    id: 'superbowler',
    name: 'Super Bowler',
    tagline: 'La formule la plus demandée — plus de jeu, plus de fun',
    price: 22.5,
    duration: '2h30',
    minKids: 6,
    ageRange: '8 à 10 ans',
    color: '#ffd93d',
    colorDark: '#e8a92c',
    icon: '🏆',
    chip: 'Best-seller',
    popular: true,
    features: [
      { ic: '🎳', t: '2 parties de bowling', s: 'Chaussures incluses · animation score' },
      { ic: '🕹️', t: '2 jetons arcade par enfant', s: 'Plus de jeux pour tout le groupe' },
      { ic: '🍰', t: 'Goûter d’anniversaire complet', s: 'Gâteau, boissons, bonbons' },
      { ic: '✨', t: 'Service VIP anniversaire', s: 'Coupe-file, table dédiée, référent, médailles, polaroïd' },
    ],
  },
  {
    id: 'probowler',
    name: 'Pro Bowler',
    tagline: 'L’expérience ultime — bowling, arcade et VR',
    price: 26.5,
    duration: '3h',
    minKids: 6,
    ageRange: '10 à 12 ans',
    color: '#ff2d87',
    colorDark: '#c0185b',
    icon: '💎',
    chip: 'Premium',
    features: [
      { ic: '🎳', t: '2 parties de bowling', s: 'Chaussures incluses · pistes privatisées' },
      { ic: '🕹️', t: '2 jetons arcade par enfant', s: 'Pour profiter de la salle arcade' },
      { ic: '🥽', t: '1 session de réalité virtuelle', s: 'Salle VR dédiée, agent référent sur place' },
      { ic: '🍰', t: 'Goûter d’anniversaire complet', s: 'Gâteau, boissons, bonbons' },
      { ic: '✨', t: 'Service VIP anniversaire', s: 'Coupe-file, table dédiée, référent, médailles, polaroïd' },
    ],
  },
];

const VIP_SERVICE = [
  { ic: '🚪', t: 'Coupe-file à l’accueil' },
  { ic: '🎂', t: 'Table d’anniversaire dédiée' },
  { ic: '🎳', t: 'Piste préparée à l’arrivée' },
  { ic: '🧑‍🎨', t: 'Référent dédié au groupe' },
  { ic: '🏅', t: 'Remise des médailles' },
  { ic: '📸', t: 'Photo polaroïd souvenir' },
];

const TIME_SLOTS = [
  { v: '10:00', label: '10h00 – 12h00', period: 'Matin' },
  { v: '14:00', label: '14h00 – 16h00', period: 'Après-midi' },
  { v: '14:30', label: '14h30 – 16h30', period: 'Après-midi' },
  { v: '16:00', label: '16h00 – 18h00', period: 'Après-midi' },
  { v: '16:30', label: '16h30 – 18h30', period: 'Goûter' },
  { v: '17:00', label: '17h00 – 19h00', period: 'Goûter' },
];

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES = ['L','M','M','J','V','S','D'];

const DEPOSIT = 50;

function formatPrice(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function genBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'FGC-';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function formatDateLong(d) {
  if (!d) return '';
  const date = new Date(d);
  const days = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  return `${days[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()].toLowerCase()} ${date.getFullYear()}`;
}

function luhnCheck(num) {
  const s = num.replace(/\s/g, '');
  if (!/^\d{12,19}$/.test(s)) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

Object.assign(window, {
  FORMULES, VIP_SERVICE, TIME_SLOTS, MONTH_NAMES, DAY_NAMES, DEPOSIT,
  formatPrice, genBookingRef, formatDateLong, luhnCheck,
});
