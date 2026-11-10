/* Kit de composants des maquettes Vong Studio · version 1 du 10/11/2026
   Briques testées (tests/test-kit.mjs) : horaires du jour, bandeau « ouvert aujourd'hui »,
   calendrier, créneaux, carte de formule, récapitulatif avec acompte, confirmation + agenda.
   Aucun style imposé : chaque maquette habille les classes .vk-* avec ses propres jetons CSS
   (voir vong-kit.css pour la base minimale : tailles tactiles, focus, états).
   Sans dépendance, sans serveur. À copier tel quel dans le dossier de la maquette. */
(function (global) {
  "use strict";

  /* ---------- Calendrier officiel ----------
     Vacances scolaires 2026-2027. Source : export officiel
     https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-A.ics (-B, -C), lu le 10/11/2026.
     Dans l'export, la fin est le jour de reprise : ici on garde le dernier jour de vacances (veille de reprise).
     Pont de l'Ascension : un seul jour dans l'export (vendredi 7 mai 2027). */
  var VACANCES = {
    A: [["2026-10-17", "2026-11-01", "vacances de la Toussaint"], ["2026-12-19", "2027-01-03", "vacances de Noël"],
        ["2027-02-13", "2027-02-28", "vacances d'hiver"], ["2027-04-10", "2027-04-25", "vacances de printemps"],
        ["2027-05-07", "2027-05-07", "pont de l'Ascension"], ["2027-07-03", "2027-09-01", "vacances d'été"]],
    B: [["2026-10-17", "2026-11-01", "vacances de la Toussaint"], ["2026-12-19", "2027-01-03", "vacances de Noël"],
        ["2027-02-20", "2027-03-07", "vacances d'hiver"], ["2027-04-17", "2027-05-02", "vacances de printemps"],
        ["2027-05-07", "2027-05-07", "pont de l'Ascension"], ["2027-07-03", "2027-09-01", "vacances d'été"]],
    C: [["2026-10-17", "2026-11-01", "vacances de la Toussaint"], ["2026-12-19", "2027-01-03", "vacances de Noël"],
        ["2027-02-06", "2027-02-21", "vacances d'hiver"], ["2027-04-03", "2027-04-18", "vacances de printemps"],
        ["2027-05-07", "2027-05-07", "pont de l'Ascension"], ["2027-07-03", "2027-09-01", "vacances d'été"]]
  };
  /* Jours fériés : https://calendrier.api.gouv.fr/jours-feries/metropole/2026.json et 2027.json (lus le 10/11/2026) */
  var FERIES = {
    "2026-11-01": "Toussaint", "2026-11-11": "11 Novembre", "2026-12-25": "Noël",
    "2027-01-01": "Jour de l'an", "2027-03-29": "lundi de Pâques", "2027-05-01": "1er Mai", "2027-05-06": "Ascension",
    "2027-05-08": "8 Mai", "2027-05-17": "lundi de Pentecôte", "2027-07-14": "14 Juillet", "2027-08-15": "15 Août",
    "2027-11-01": "Toussaint", "2027-11-11": "11 Novembre", "2027-12-25": "Noël"
  };
  var LIMITE = "2027-08-31"; /* au-delà : pas de données officielles chargées, le calendrier s'arrête */

  var JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  var JOURS_L = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  /* ---------- Dates ---------- */
  function cle(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function deCle(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function plus(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function jourSeul(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dateLongue(d) { return JOURS_L[d.getDay()] + " " + (d.getDate() === 1 ? "1er" : d.getDate()) + " " + MOIS[d.getMonth()]; }
  /* Heures décimales : 14.5 = 14 h 30 ; 25 = 1 h du matin le lendemain */
  function heure(x) {
    var h = Math.floor(x) % 24, m = Math.round((x - Math.floor(x)) * 60);
    if (h === 0 && m === 0 && x >= 24) return "minuit";
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }
  function heureCourte(x) { var h = Math.floor(x) % 24, m = Math.round((x - Math.floor(x)) * 60); return h + "h" + (m ? String(m).padStart(2, "0") : ""); }
  function euros(x) {
    var r = Math.round(x * 100) / 100, s = (r % 1 ? r.toFixed(2) : String(r)).replace(".", ",");
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  }
  function hache(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Horaires ----------
     config = {
       zone: "B",
       hors:  [dim, lun, mar, mer, jeu, ven, sam],   chaque jour : null (fermé) ou [[ouverture, fermeture], ...]
       vac:   idem pendant les vacances (facultatif : sinon = hors),
       ferie: "samedi" | "dimanche" | "ferme" | [[o,f]]  règle des jours fériés (facultatif : sinon le jour normal),
       fermetures: { "2026-12-25": "Noël", ... }     fermetures exceptionnelles lues sur le site,
       exceptions: { "2026-12-24": [[10,16]] }        horaires particuliers lus sur le site,
       aConfirmer: true si une partie des horaires vient d'une source incertaine (affiche la mention),
       motifsFermeture: { 1: "privatisations uniquement" }  motif affiché pour un jour de semaine sans horaires (facultatif, 10/11/2026)
     } */
  function Horaires(config) {
    this.c = config;
    this.vacances = config.vacances || VACANCES[config.zone || "B"];
  }
  Horaires.prototype.vacance = function (d) {
    var k = cle(d);
    for (var i = 0; i < this.vacances.length; i++) if (k >= this.vacances[i][0] && k <= this.vacances[i][1]) return this.vacances[i][2];
    return null;
  };
  Horaires.prototype.ferie = function (d) { return FERIES[cle(d)] || null; };
  /* Renvoie { ouvert, plages, motif, periode } pour un jour donné */
  Horaires.prototype.jour = function (d) {
    var k = cle(d), c = this.c, vac = this.vacance(d), fer = this.ferie(d), plages;
    if (k > LIMITE) return { ouvert: false, plages: [], motif: "dates pas encore publiées", periode: "" };
    if (c.fermetures && c.fermetures[k]) return { ouvert: false, plages: [], motif: c.fermetures[k], periode: vac || "" };
    if (c.exceptions && c.exceptions[k]) plages = c.exceptions[k];
    else if (fer && c.ferie) {
      if (c.ferie === "ferme") return { ouvert: false, plages: [], motif: fer + " (fermé)", periode: vac || "" };
      if (c.ferie === "samedi") plages = (vac && c.vac ? c.vac : c.hors)[6];
      else if (c.ferie === "dimanche") plages = (vac && c.vac ? c.vac : c.hors)[0];
      else plages = c.ferie;
    } else plages = (vac && c.vac ? c.vac : c.hors)[d.getDay()];
    if (!plages || !plages.length) return { ouvert: false, plages: [], motif: (c.motifsFermeture && c.motifsFermeture[d.getDay()]) || "jour de fermeture", periode: vac || "" };
    return { ouvert: true, plages: plages, motif: fer || "", periode: vac || "" };
  };
  Horaires.prototype.texteJour = function (d) {
    var j = this.jour(d);
    if (!j.ouvert) return "Fermé";
    return j.plages.map(function (p) { return heure(p[0]) + " – " + heure(p[1]); }).join(" et ");
  };
  /* Statut à l'instant t (Date) : ouvert maintenant, ouvre plus tard, fermé + prochaine ouverture */
  Horaires.prototype.statut = function (t) {
    var d = jourSeul(t), h = t.getHours() + t.getMinutes() / 60, j = this.jour(d), i, p;
    /* nuit après minuit : plage de la veille qui déborde (ex. [14, 26]) */
    var veille = this.jour(plus(d, -1));
    if (veille.ouvert) for (i = 0; i < veille.plages.length; i++) {
      p = veille.plages[i];
      if (p[1] > 24 && h < p[1] - 24) return { etat: "ouvert", texte: "Ouvert jusqu'à " + heure(p[1]), jour: veille };
    }
    if (j.ouvert) for (i = 0; i < j.plages.length; i++) {
      p = j.plages[i];
      if (h >= p[0] && h < p[1]) return { etat: "ouvert", texte: "Ouvert jusqu'à " + heure(p[1]), jour: j };
      if (h < p[0]) return { etat: "bientot", texte: "Ouvre aujourd'hui à " + heure(p[0]), jour: j };
    }
    for (i = 1; i <= 14; i++) {
      var n = plus(d, i), jn = this.jour(n);
      if (jn.ouvert) {
        var quand = i === 1 ? "demain" : JOURS_L[n.getDay()] + (i > 6 ? " " + n.getDate() + " " + MOIS[n.getMonth()] : "");
        return { etat: "ferme", texte: "Fermé · rouvre " + quand + " à " + heure(jn.plages[0][0]), jour: j };
      }
    }
    return { etat: "ferme", texte: "Fermé", jour: j };
  };

  /* ---------- Bandeau « ouvert aujourd'hui » ----------
     el : conteneur ; options : { horaires, maintenant (Date, pour les tests), lienHoraires: "#horaires" } */
  function bandeau(el, o) {
    var t = o.maintenant || new Date(), s = o.horaires.statut(t), j = o.horaires.jour(jourSeul(t));
    el.className = "vk-bandeau vk-" + s.etat;
    el.setAttribute("role", "status");
    var detail = j.ouvert ? "Aujourd'hui : " + o.horaires.texteJour(jourSeul(t)) : "";
    var periode = j.periode ? " · " + j.periode : (j.motif && j.ouvert ? " · " + j.motif : "");
    el.innerHTML = '<span class="vk-pastille" aria-hidden="true"></span><strong>' + esc(s.texte) + "</strong>" +
      (detail ? '<span class="vk-detail">' + esc(detail + periode) + "</span>" : "") +
      (o.horaires.c.aConfirmer ? ' <span class="vk-mention">à confirmer</span>' : "") +
      (o.lienHoraires ? ' <a class="vk-lien" href="' + esc(o.lienHoraires) + '">Toute la semaine</a>' : "");
    return s;
  }

  /* ---------- Calendrier ----------
     options : { horaires, debut (Date), choisi (Date|null), regle(d) -> null | "motif" (jour refusé pour cette activité),
                 surChoix(d), mois: nombre de mois navigables (défaut 6) }
     Clavier : flèches, Début/Fin, Page préc./suiv. ; jours fermés lisibles (motif) mais non choisissables. */
  function calendrier(el, o) {
    var aujourd = jourSeul(o.debut || new Date()), vue = new Date(aujourd.getFullYear(), aujourd.getMonth(), 1);
    var choisi = o.choisi ? jourSeul(o.choisi) : null, focus = choisi || aujourd, maxMois = o.mois || 6;
    var fin = new Date(aujourd.getFullYear(), aujourd.getMonth() + maxMois, 0);
    if (cle(fin) > LIMITE) fin = deCle(LIMITE);
    function etat(d) {
      if (d < aujourd) return { ok: false, motif: "passé" };
      if (d > fin) return { ok: false, motif: "pas encore ouvert à la réservation" };
      var j = o.horaires.jour(d);
      if (!j.ouvert) return { ok: false, motif: j.motif || "fermé" };
      var r = o.regle ? o.regle(d) : null;
      if (r) return { ok: false, motif: r };
      return { ok: true, motif: j.motif || j.periode || "" };
    }
    function rendre() {
      var an = vue.getFullYear(), m = vue.getMonth(), premier = new Date(an, m, 1), decal = (premier.getDay() + 6) % 7;
      var nb = new Date(an, m + 1, 0).getDate(), h = [];
      var prec = new Date(an, m, 0) >= aujourd, suiv = new Date(an, m + 1, 1) <= fin;
      h.push('<div class="vk-cal-tete"><button type="button" class="vk-cal-nav" data-nav="-1" aria-label="Mois précédent"' + (prec ? "" : " disabled") + '>‹</button>' +
        '<strong aria-live="polite">' + MOIS[m] + " " + an + '</strong><button type="button" class="vk-cal-nav" data-nav="1" aria-label="Mois suivant"' + (suiv ? "" : " disabled") + ">›</button></div>");
      h.push('<div class="vk-cal-grille" role="group" aria-label="Jours de ' + MOIS[m] + " " + an + '">');
      ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."].forEach(function (j) { h.push('<span class="vk-cal-js" aria-hidden="true">' + j + "</span>"); });
      for (var i = 0; i < decal; i++) h.push('<span class="vk-cal-vide" aria-hidden="true"></span>');
      for (var n = 1; n <= nb; n++) {
        var d = new Date(an, m, n), e = etat(d), k = cle(d), cls = "vk-jour";
        if (!e.ok) cls += " vk-ferme";
        if (choisi && k === cle(choisi)) cls += " vk-choisi";
        if (k === cle(aujourd)) cls += " vk-auj";
        if (o.horaires.vacance(d)) cls += " vk-vac";
        if (o.horaires.ferie(d)) cls += " vk-fer";
        var lab = " " + MOIS[m] + ", " + JOURS_L[d.getDay()] + (e.motif ? ", " + e.motif : "") + (e.ok ? "" : ", indisponible");
        h.push('<button type="button" class="' + cls + '" data-j="' + k + '"' +
          (e.ok ? "" : ' aria-disabled="true"') + ' aria-pressed="' + !!(choisi && k === cle(choisi)) + '"' +
          ' tabindex="' + (k === cle(focus) ? 0 : -1) + '">' + n + '<span class="vk-sr">' + esc(lab) + "</span></button>");
      }
      h.push("</div>");
      h.push('<p class="vk-cal-info" aria-live="polite"></p>');
      h.push('<p class="vk-cal-legende"><span class="vk-l-vac"></span> vacances scolaires · <span class="vk-l-fer"></span> jour férié · barré : fermé</p>');
      el.innerHTML = h.join("");
      el.classList.add("vk-calendrier");
    }
    function info(t) { var p = el.querySelector(".vk-cal-info"); if (p) p.textContent = t; }
    function choisir(d) {
      var e = etat(d);
      if (!e.ok) { info(dateLongue(d) + " : " + e.motif + ". Choisissez un autre jour."); return; }
      choisi = d; focus = d; rendre();
      info(dateLongue(d) + " · " + o.horaires.texteJour(d) + (e.motif ? " · " + e.motif : "") + (o.horaires.c.aConfirmer ? " · horaires à confirmer" : ""));
      if (o.surChoix) o.surChoix(d);
      var b = el.querySelector('[data-j="' + cle(d) + '"]'); if (b) b.focus();
    }
    el.addEventListener("click", function (ev) {
      var nav = ev.target.closest("[data-nav]");
      if (nav && !nav.disabled) { vue = new Date(vue.getFullYear(), vue.getMonth() + +nav.dataset.nav, 1); rendre(); return; }
      var b = ev.target.closest("[data-j]"); if (b) choisir(deCle(b.dataset.j));
    });
    el.addEventListener("keydown", function (ev) {
      var b = ev.target.closest("[data-j]"); if (!b) return;
      var d = deCle(b.dataset.j), pas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, PageUp: -30, PageDown: 30 }[ev.key];
      if (ev.key === "Home") pas = -((d.getDay() + 6) % 7);
      if (ev.key === "End") pas = 6 - ((d.getDay() + 6) % 7);
      if (pas === undefined) return;
      ev.preventDefault();
      var n = plus(d, pas); if (n < aujourd || n > fin) return;
      focus = n; vue = new Date(n.getFullYear(), n.getMonth(), 1); rendre();
      var c = el.querySelector('[data-j="' + cle(n) + '"]'); if (c) c.focus();
    });
    rendre();
    return { choisir: choisir, etat: etat, get choisi() { return choisi; } };
  }

  /* ---------- Créneaux ----------
     options : { horaires, date, duree (h), pas (h, défaut 0.5), dernierDebut (h, ex. 18 pour un anniversaire),
                 places(date, debut) -> nombre (0 = complet) : disponibilités d'EXEMPLE, maintenant (Date) }
     Renvoie la liste ; un créneau complet reste affiché et désactivé, jamais remplacé en silence. */
  function creneaux(o) {
    var j = o.horaires.jour(o.date), res = [], pas = o.pas || 0.5, now = o.maintenant || new Date();
    var memeJour = cle(now) === cle(o.date), hNow = now.getHours() + now.getMinutes() / 60;
    if (!j.ouvert) return res;
    j.plages.forEach(function (p) {
      for (var t = p[0]; t + o.duree <= p[1] + 1e-9; t += pas) {
        if (o.dernierDebut !== undefined && t > o.dernierDebut) break;
        var passe = memeJour && t <= hNow + 0.25;
        var n = o.places ? o.places(o.date, t) : null;
        res.push({ debut: t, fin: t + o.duree, texte: heureCourte(t), places: n, complet: n === 0, passe: passe });
      }
    });
    return res;
  }
  function rendreCreneaux(el, liste, o) {
    if (!liste.length) { el.innerHTML = '<p class="vk-vide">' + esc(o.vide || "Aucun créneau ce jour-là. Choisissez un autre jour.") + "</p>"; return; }
    el.className = "vk-creneaux";
    el.innerHTML = liste.map(function (c, i) {
      var off = c.complet || c.passe, sous = c.passe ? "passé" : c.complet ? "complet" : (c.places !== null ? c.places + (o.unite || " libres") : "");
      return '<button type="button" class="vk-creneau' + (off ? " vk-off" : "") + (o.choisi === c.debut ? " vk-choisi" : "") +
        '" data-i="' + i + '"' + (off ? ' aria-disabled="true"' : "") + ' aria-pressed="' + (o.choisi === c.debut) + '">' +
        "<strong>" + c.texte + "</strong>" + (sous ? "<span>" + esc(sous) + "</span>" : "") + "</button>";
    }).join("");
    el.onclick = function (ev) {
      var b = ev.target.closest("[data-i]"); if (!b) return;
      var c = liste[+b.dataset.i];
      if (c.complet || c.passe) { if (o.surRefus) o.surRefus(c); return; }
      o.choisi = c.debut; rendreCreneaux(el, liste, o); if (o.surChoix) o.surChoix(c);
    };
  }

  /* ---------- Carte de formule ----------
     f = { id, nom, prix, unite ("par enfant"), details: [..], exemple: bool, aPartirDe: bool, note } */
  function carteFormule(f, choisie) {
    return '<button type="button" class="vk-formule' + (choisie ? " vk-choisi" : "") + '" data-formule="' + esc(f.id) + '" aria-pressed="' + !!choisie + '">' +
      '<span class="vk-f-nom">' + esc(f.nom) + "</span>" +
      '<span class="vk-f-prix">' + (f.aPartirDe ? "dès " : "") + euros(f.prix) + (f.unite ? ' <small>' + esc(f.unite) + "</small>" : "") +
      (f.exemple ? ' <span class="vk-mention">exemple</span>' : "") + "</span>" +
      (f.details && f.details.length ? '<span class="vk-f-details">' + f.details.map(esc).join(" · ") + "</span>" : "") +
      (f.note ? '<span class="vk-f-note">' + esc(f.note) + "</span>" : "") + "</button>";
  }

  /* ---------- Récapitulatif avec acompte ----------
     r = { lignes: [{ libelle, quantite, prixUnitaire, exemple }], tauxAcompte: 0.3, acompteExemple: true,
           acompteFixe: nombre (remplace le taux), date, heureTexte } */
  function calculRecap(r) {
    var total = 0, ex = false;
    r.lignes.forEach(function (l) { total += l.quantite * l.prixUnitaire; if (l.exemple) ex = true; });
    total = Math.round(total * 100) / 100;
    var acompte = r.acompteFixe !== undefined ? r.acompteFixe : Math.round(total * (r.tauxAcompte || 0) * 100) / 100;
    return { total: total, acompte: acompte, reste: Math.round((total - acompte) * 100) / 100, exemple: ex, acompteExemple: !!r.acompteExemple };
  }
  function recapitulatif(el, r) {
    var c = calculRecap(r), h = ['<dl class="vk-recap">'];
    r.lignes.forEach(function (l) {
      h.push("<dt>" + esc(l.libelle) + (l.quantite !== 1 ? " × " + l.quantite : "") + (l.exemple ? ' <span class="vk-mention">exemple</span>' : "") +
        "</dt><dd>" + euros(l.quantite * l.prixUnitaire) + "</dd>");
    });
    h.push('<dt class="vk-total">Total</dt><dd class="vk-total">' + euros(c.total) + "</dd>");
    h.push('<dt class="vk-acompte">Acompte à payer maintenant' + (r.tauxAcompte && r.acompteFixe === undefined ? " (" + Math.round(r.tauxAcompte * 100) + " %)" : "") +
      (c.acompteExemple ? ' <span class="vk-mention">exemple</span>' : "") + '</dt><dd class="vk-acompte">' + euros(c.acompte) + "</dd>");
    h.push("<dt>Reste à régler sur place</dt><dd>" + euros(c.reste) + "</dd></dl>");
    h.push('<p class="vk-simule">Paiement simulé : rien n\'est débité, rien n\'est enregistré.</p>');
    el.innerHTML = h.join("");
    return c;
  }

  /* ---------- Confirmation + agenda ---------- */
  function numero(prefixe) { return (prefixe || "RES") + "-" + String(Date.now()).slice(-6); }
  function fichierAgenda(e) { /* e = { titre, date (Date), debut (h), duree (h), lieu, numero } */
    function f(h) {
      var d = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate(), 0, Math.round(h * 60));
      return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "T" +
        String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0") + "00";
    }
    var txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Apercu Vong Studio//FR", "BEGIN:VEVENT", "UID:" + e.numero + "@apercu",
      "DTSTAMP:" + f(0), "DTSTART:" + f(e.debut), "DTEND:" + f(e.debut + e.duree), "SUMMARY:" + e.titre, "LOCATION:" + (e.lieu || ""),
      "DESCRIPTION:Réservation " + e.numero + " (aperçu, paiement simulé)", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return txt;
  }
  function confirmation(el, e) {
    el.innerHTML = '<div class="vk-confirmation" role="status" tabindex="-1"><p class="vk-c-titre">C\'est réservé</p>' +
      '<p>Réservation <strong>' + esc(e.numero) + "</strong> · " + esc(dateLongue(e.date)) + " à " + heure(e.debut) + "</p>" +
      (e.resume ? "<p>" + esc(e.resume) + "</p>" : "") +
      '<button type="button" class="vk-agenda">Ajouter à mon agenda</button>' +
      '<p class="vk-simule">Aperçu : paiement simulé, aucune réservation n\'est enregistrée.</p></div>';
    el.querySelector(".vk-agenda").onclick = function () {
      var u = URL.createObjectURL(new Blob([fichierAgenda(e)], { type: "text/calendar" })), a = document.createElement("a");
      a.href = u; a.download = e.numero + ".ics"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
    };
    el.querySelector(".vk-confirmation").focus();
  }

  /* ---------- Message d'erreur (toujours sous le bouton) ---------- */
  function erreur(bouton, texte) {
    var id = bouton.id ? bouton.id + "-err" : "", p = bouton.nextElementSibling;
    if (!p || !p.classList.contains("vk-erreur")) { p = document.createElement("p"); p.className = "vk-erreur"; p.setAttribute("role", "alert"); bouton.after(p); }
    if (id) { p.id = id; bouton.setAttribute("aria-describedby", id); }
    p.textContent = texte || ""; p.hidden = !texte;
  }

  global.VongKit = {
    VACANCES: VACANCES, FERIES: FERIES, LIMITE: LIMITE, JOURS: JOURS, JOURS_L: JOURS_L, MOIS: MOIS,
    cle: cle, deCle: deCle, plus: plus, jourSeul: jourSeul, dateLongue: dateLongue, heure: heure, heureCourte: heureCourte,
    euros: euros, hache: hache, esc: esc,
    Horaires: Horaires, bandeau: bandeau, calendrier: calendrier, creneaux: creneaux, rendreCreneaux: rendreCreneaux,
    carteFormule: carteFormule, calculRecap: calculRecap, recapitulatif: recapitulatif,
    numero: numero, fichierAgenda: fichierAgenda, confirmation: confirmation, erreur: erreur
  };
})(window);
