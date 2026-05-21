# Maquettes de refonte — prospects

Démonstrations interactives de refonte de site web + back office, à présenter aux prospects.

## Contenu du dossier

- `index.html` — page portfolio qui présente les trois maquettes (la page d'accueil)
- `kids-paradise.html` — maquette Kid's Paradise (site + back office)
- `laser-game.html` — maquette Laser Game Evolution Blois (site + back office)
- `fgc/` — maquette Family Games Center (site multi-pages, 16 pages, point d'entrée `fgc/index.html`)

---

## Publier en ligne avec GitHub Pages

Objectif : obtenir une URL publique du type `https://kevinvanphavong.github.io/agence-maquettes/` à envoyer aux prospects.

### Étape 1 — Créer le dépôt sur GitHub

1. Va sur **github.com/new**
2. Nom du dépôt : `agence-maquettes`
3. Coche **Public**
4. **Ne coche PAS** « Add a README file » (le dossier en a déjà un)
5. Clique **Create repository**

### Étape 2 — Pousser le dossier

Ouvre le Terminal et colle tout ce bloc d'un coup :

```bash
cd ~/Desktop/agence-maquettes
git init
git add .
git commit -m "Maquettes de refonte — prospects"
git branch -M main
git remote add origin https://github.com/kevinvanphavong/agence-maquettes.git
git push -u origin main
```

> Si Git demande un mot de passe : GitHub n'accepte plus le mot de passe classique. Utilise un **Personal Access Token** (github.com → Settings → Developer settings → Personal access tokens) à la place du mot de passe. Plus simple encore : installe GitHub CLI et lance `gh auth login` une fois, l'authentification est ensuite automatique.

### Étape 3 — Activer GitHub Pages

1. Sur la page du dépôt : onglet **Settings**
2. Menu de gauche : **Pages**
3. Section « Build and deployment » → Source : **Deploy from a branch**
4. Branch : **main** · dossier **/ (root)** → **Save**
5. Patiente environ 1 minute, puis recharge la page : l'URL publique s'affiche en haut.

### Étape 4 — Tes liens à partager

| Page | URL |
|---|---|
| Portfolio (les 3 maquettes) | `https://kevinvanphavong.github.io/agence-maquettes/` |
| Maquette Kid's Paradise | `https://kevinvanphavong.github.io/agence-maquettes/kids-paradise.html` |
| Maquette Laser Game | `https://kevinvanphavong.github.io/agence-maquettes/laser-game.html` |
| Maquette Family Games Center | `https://kevinvanphavong.github.io/agence-maquettes/fgc/` |

Envoie le lien portfolio pour une vue d'ensemble, ou le lien direct de la maquette concernée à chaque prospect.

---

## Mettre à jour les maquettes plus tard

Après toute modification d'un fichier, depuis le dossier :

```bash
cd ~/Desktop/agence-maquettes
git add .
git commit -m "Mise à jour des maquettes"
git push
```

Le site en ligne se met à jour tout seul en moins d'une minute.

---

*Données illustratives — maquettes réalisées pour la prospection commerciale.*
