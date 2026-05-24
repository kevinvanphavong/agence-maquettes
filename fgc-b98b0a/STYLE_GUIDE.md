# STYLE_GUIDE.md — Family Games Center · Charte visuelle pour génération d'images IA

> Fichier de référence à coller (ou résumer) dans un prompt ChatGPT / Midjourney / Gemini / DALL·E / Sora / Flux pour générer de nouvelles affiches **dans le même style** que la série « Affiches offres 2026 » du Family Games Center.

---

## 1. IDENTITÉ DU STYLE — résumé en une phrase

> **Affiche promotionnelle verticale style "Pixar / Disney 3D" cartoon stylisé, ambiance bowling-bar néon nocturne, personnages multi-ethniques très expressifs aux grands yeux, typographie 3D extrudée violet sur badges jaunes arrondis, feux d'artifice et néons multicolores, fond sombre dominé par le violet profond.**

---

## 2. DIRECTION ARTISTIQUE (à coller dans le prompt)

```
Vibrant 3D cartoon illustration in the style of modern Pixar / Disney /
DreamWorks animated movie posters. Stylized semi-realistic characters with
slightly exaggerated proportions, oversized expressive eyes with glossy
highlights, big white smiles, joyful open-mouth laughter, raised fists and
"yes!" body language. Cinematic studio lighting with strong rim lights in
magenta, cyan and gold. Glossy textures, soft subsurface scattering on skin,
realistic fabric folds on hoodies and denim. High-detail render, 8k, sharp,
dramatic depth of field, slight bloom around neon sources.
```

### À éviter explicitement
- ❌ photoréalisme strict (pas de vraies photos)
- ❌ style anime / manga
- ❌ style flat / vectoriel plat / 2D minimaliste
- ❌ ambiance jour, lumière naturelle, extérieur
- ❌ couleurs pastel délavées ou monochromes
- ❌ texte fin sans extrusion 3D

---

## 3. PALETTE DE COULEURS

### Couleurs principales (à utiliser systématiquement)

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| **Violet profond** | Deep Purple | `#2A1458` → `#3D1B6B` | Fond dominant, badges secondaires, typo principale |
| **Jaune doré** | Golden Yellow | `#F5C518` → `#FFD93D` | Badges titres principaux, accents lumineux |
| **Magenta / Rose vif** | Hot Pink | `#E91E63` → `#FF2D87` | Prix, soulignages, néons, accents |
| **Crème** | Warm Cream | `#FFF4E0` → `#F8EDD8` | Badges sous-titres, fond pills |
| **Noir bleuté** | Midnight Blue | `#0A0A1F` → `#1A0F3D` | Vignette extérieure, bandeau bas |

### Couleurs néons (ambiance arrière-plan)
- Cyan électrique `#00E5FF`
- Magenta néon `#FF00C8`
- Violet UV `#9D00FF`
- Bleu électrique `#3B5BFF`
- Or chaud `#FFB800` (feux d'artifice)
- Vert acide `#39FF14` (parcimonieux)

### Règle de composition couleur
- **70%** violet/bleu nuit (fond + ambiance)
- **20%** jaune doré + crème (badges, titres)
- **10%** magenta + cyan (accents lumineux, prix, néons)

---

## 4. TYPOGRAPHIE

### Titre principal — toujours sur badge jaune
- **Style** : Sans-serif ultra-bold, **EXTRUDÉ 3D**, légèrement incliné/perspective
- **Casse** : MAJUSCULES uniquement
- **Couleur du texte** : `#3D1B6B` (violet profond)
- **Effet** : ombre portée violette + relief 3D doré clair sur les arêtes
- **Polices proches** : *Obelix Pro*, *Lilita One*, *Bowlby One*, *Luckiest Guy*, *Sniglet Black*, ou rendu 3D custom type "movie title"
- **Prompt suggéré** : `bold 3D extruded chunky cartoon title font, deep purple letters, golden bevel edges, drop shadow, slight perspective`

### Sous-titre / liste de features — sur badge crème ou jaune fin
- Sans-serif gras, MAJUSCULES, couleur violet `#3D1B6B`
- Séparateurs : **point rond magenta** ` • `
- Exemple : `GOÛTER • PODIUM & MÉDAILLES • BOWLING & ARCADE`

### Prix / Accroche chiffrée
- Police sans-serif **noire grasse italique** ou bold, en **magenta** `#E91E63`
- Souvent doublée d'un **prix barré** plus petit à droite : ~~89€~~
- Toujours mise en avant : `20€`, `4,90€`, `7,50€`, `68€`

### Mention d'appel à l'action (bas du badge violet)
- Sans-serif bold, **JAUNE** `#F5C518` sur fond violet
- Encadrée de deux ornements `≈{ ` et ` }≈` (petits éclats jaunes / confettis stylisés)
- Exemples : `≈{ DÈS 6 ANS }≈`, `≈{ JEUDI & VENDREDI }≈`, `≈{ INSCRIPTION À L'ACCUEIL }≈`

### Texte courant (bandeau bas)
- Sans-serif regular/medium, blanc ou crème, casse normale ou small caps

---

## 5. STRUCTURE DE COMPOSITION (gabarit type)

### Format
- **Vertical** : 1122 × 1402 px (ratio ~4:5) pour réseaux sociaux / affiches
- **Horizontal** : 1920 × 1080 px pour bandeaux web / écrans
- **Double vertical** : juxtaposition de deux affiches verticales pour formats larges

### Hiérarchie verticale (de haut en bas)

```
┌──────────────────────────────────────┐
│  [ logo Family Games Center, en      │ ← optionnel haut-droit
│    haut à droite, petit ]            │
│                                      │
│         ✨ FEUX D'ARTIFICE ✨        │
│      (arrière-plan, néons, bowling)  │
│                                      │
│   👥 GROUPE DE PERSONNAGES 3D        │ ← 5 à 9 personnages
│      multi-ethniques, joyeux         │   bras levés, sourires
│      tenant le produit / activité    │
│                                      │
│   ╔══════════════════════════╗       │
│   ║   TITRE 3D EXTRUDÉ       ║       │ ← badge jaune arrondi
│   ║   (sur 1-2 lignes)       ║       │
│   ╚══════════════════════════╝       │
│                                      │
│   ┌──────────────────────────┐       │
│   │ SOUS-TITRE • DÉTAIL •    │       │ ← badge crème pill
│   │ DÉTAIL                   │       │
│   └──────────────────────────┘       │
│                                      │
│   ╔══════════════════════════╗       │
│   ║ ≈{ ACCROCHE / PRIX }≈    ║       │ ← badge violet
│   ║ Détail complémentaire    │       │
│   ╚══════════════════════════╝       │
│                                      │
├──────────────────────────────────────┤
│ 📅 OUVERT 7J/7 │ 🥤 SNACK & BAR │ ☺ │ ← bandeau bas violet
│ AMBIANCE & FUN │ 🎉 ANNIVERSAIRES…  │   (uniquement sur version
├──────────────────────────────────────┤   "complète", pas toujours)
│ Retrouvez nos infos sur :            │
│      🌐 FAMILYGAMESCENTER.FR         │ ← pill jaune URL
└──────────────────────────────────────┘
```

---

## 6. BADGES — règles précises

### Badge titre (jaune)
- Forme : **rectangle très arrondi** (border-radius ~80px), proche du "stadium"
- Remplissage : **dégradé radial doré** `#FFD93D` (centre) → `#E8A92C` (bords)
- Bordure : liseré sombre `#3D1B6B` (2-4px) + bordure jaune clair interne (highlight)
- Ombre portée : multiple, douce, violette sombre
- Petites **étoiles violettes ou magenta** parfois sur les côtés du badge

### Badge sous-titre (crème)
- Forme : **pill** (border-radius très élevé / 50%)
- Remplissage : crème `#F8EDD8`
- Bordure jaune doré fine
- Texte violet sombre majuscules

### Badge accroche (violet)
- Forme : **rectangle arrondi**
- Remplissage : violet profond `#3D1B6B` avec léger dégradé interne
- Bordure jaune doré fine
- Texte jaune et/ou blanc

### Pill URL (jaune)
- Très arrondi, icône globe 🌐 à gauche, URL en violet bold

---

## 7. PERSONNAGES — directives de casting & rendu

### Composition humaine
- **Groupe de 4 à 9 personnages** selon l'affiche
- **Diversité ethnique systématique** : afro-descendant, asiatique, latino, caucasien, métis — toujours **mélangés**
- **Mix de genres** équilibré
- **Tranches d'âge** :
  - Affiches "anniversaires enfants" → **enfants 6-10 ans**
  - Affiches "cocktails / afterwork / karaoké" → **jeunes adultes 25-35 ans**
  - Affiches snacks / bowling à volonté → **jeunes 18-30 ans**
  - Affiches "Pack Afterwork" → **tenue business casual** (chemise, blazer ouvert)
  - Affiches "cocktails" → **tenue de soirée chic** (robes, blazers)

### Direction des personnages
- **Yeux énormes, brillants**, avec 2-3 highlights blancs
- **Sourires éclatants** dents blanches visibles
- **Bouches ouvertes** de rire / cri de joie pour la moitié des persos
- **Poses dynamiques** : bras levés, poings fermés "yes!", peace sign, doigt pointé vers le produit
- **Cheveux volumineux et texturés** (afros, boucles, mèches dynamiques au vent)
- **Vêtements** : hoodies colorés (violet, rose, jaune, vert, bleu denim), chemises, robes pailletées (soirée)

### Personnage central
- Toujours **un personnage focal** au centre, plus grand, légèrement en avant
- Tient l'objet principal de l'offre (carte de membre, verre, fléchette, gâteau d'anniversaire…)

---

## 8. DÉCOR & ARRIÈRE-PLAN

### Lieu (toujours intérieur, nocturne)
- **Bowling** : piste en bois verni avec reflets néon, quilles, boules colorées au sol
- **Bar / pub** : étagères de bouteilles floues en fond, suspensions ampoules Edison
- **Salle d'arcade** : bornes lumineuses, écrans, néons rétro
- **Salle karaoké** : boule disco, écran lyrics, banquettes cuir, néons
- **Salle fléchettes** : cibles, écrans de score "PLAYER 1 / 501"

### Effets d'ambiance (TOUJOURS présents)
- 🎆 **Feux d'artifice** colorés en arrière-plan (magenta, cyan, doré, vert)
- 🎉 **Confettis** colorés qui tombent / explosent
- ✨ **Néons multicolores** sur les murs (lignes, formes géométriques)
- 💡 **Bokeh lumineux** flou en profondeur
- 🌟 **Étoiles scintillantes** et particules brillantes
- 💨 **Léger brouillard / fumée** au sol pour la profondeur

### Éclairage
- **Source principale** : rim light magenta + cyan sur les contours des persos
- **Key light** chaude doré sur les visages
- **Fill light** violet ambient
- **Reflets miroir** dorés sur sols vernis

---

## 9. EFFETS GRAPHIQUES & ORNEMENTS

- **Ornement éclats jaunes** `≈{ ... }≈` autour des phrases courtes (looks comme petits feux d'artifice)
- **Petites étoiles** violettes ou magenta (5 branches, pleines) près des badges
- **Confettis** colorés vectoriels (rectangles fins, triangles, ronds) éparpillés
- **Lignes de vitesse / rayons lumineux** depuis le centre du décor vers l'extérieur (perspective forcée)
- **Splashes liquides** colorés pour les affiches boissons (jus, smoothies, cocktails)

---

## 10. BANDEAU BAS (versions horizontales / complètes)

Fond violet `#1A0F3D`. Aligné horizontalement, 4 pictos + texte :

```
📅 OUVERT 7J/7  │  🥤 SNACK & BAR  │  ☺ AMBIANCE & FUN GARANTIS  │  🎉 ANNIVERSAIRES • EVG/EVJF • ÉVÉNEMENTS
```

Puis, ligne du dessous, centrée :
```
RETROUVEZ TOUTES NOS INFOS ET RÉSERVEZ SUR :   [ 🌐 FAMILYGAMESCENTER.FR ]
```

---

## 11. LOGO

- **Nom** : `Family GAMES Center`
- **Style** : "Family" en script rose/rouge cursif, **"GAMES"** en gros bold rouge avec contour blanc, "Center" en petit dessous
- Accompagné de petites **icônes circulaires** (boule de bowling, fléchette, queue de billard)
- **Position** : en haut à droite, taille ~10-12% de la largeur

---

## 12. PROMPT-TYPE PRÊT À COPIER (ChatGPT / DALL·E / Midjourney)

### Template universel

```
Vertical promotional poster (4:5 ratio), Pixar/Disney style 3D cartoon
illustration. [DESCRIPTION DU SUJET ET DES PERSONNAGES — voir variations].

Setting: night-time bowling alley & bar with glowing neon lights, colorful
fireworks bursting in the background, confetti raining, polished wood floor
reflecting magenta and cyan neons, bokeh lights.

Characters: ethnically diverse group, oversized expressive eyes with glossy
highlights, huge joyful open-mouth smiles, raised fists, dynamic celebratory
poses. Stylized semi-realistic 3D rendering, soft subsurface skin, detailed
hair, fabric folds on colorful hoodies (purple, pink, yellow, green, denim).

Color palette: deep purple #2A1458 background, golden yellow #FFD93D accents,
hot pink #E91E63 highlights, magenta and cyan neon glow, cream warm whites.

Foreground typography: large 3D extruded chunky cartoon title in deep purple
letters with golden bevel edges, sitting on a rounded golden-yellow badge
with dark purple outline, slight perspective. Below it: a cream pill-shaped
badge with purple all-caps subtitle separated by pink dots. Below that: a
deep-purple rounded rectangle badge with a yellow call-to-action flanked by
small yellow firework ornaments ≈{ }≈.

Title text: "[TITRE]"
Subtitle text: "[SOUS-TITRE • DÉTAIL • DÉTAIL]"
Call-to-action: "[≈{ ACCROCHE }≈]"
Price callout (if any): "[XX€]" in bold magenta italic.

Cinematic studio lighting, rim lights magenta and cyan, slight bloom,
8k highly detailed, festive joyful atmosphere.
```

### Variation : enfants anniversaire
> *Sujet* : `8 happy diverse children aged 6-10, one boy standing on a golden podium with a medal around his neck, others cheering around him, one girl holding a slice of birthday cake with a lit candle, colorful balloons floating, bowling pins on the side`

### Variation : afterwork pack
> *Sujet* : `5 young adult colleagues in business casual (open shirts, blazers, ties loosened), one man in the center holding up a tall 2.5L beer giraffe tower, others cheering with beer glasses and a cocktail, pizzas visible in foreground`

### Variation : cocktails
> *Sujet* : `5 elegant adults at a chic bar, dressed in cocktail attire (sequin dresses, blazers), clinking colorful cocktail glasses (red, blue, yellow, mojito green) with fruit garnishes and mint, splashes of colorful liquid frozen in air, ice cubes floating, citrus slices`

### Variation : snacks sucrés
> *Sujet* : `4 young friends with huge excited expressions, holding waffles dripping with chocolate sauce and whipped cream, surrounded by a table covered in crepes with Nutella, brioches, milkshakes with whipped cream, strawberries`

### Variation : smoothies & milkshakes
> *Sujet* : `5 cool friends wearing sunglasses, smiling, holding fruit smoothies and milkshakes (strawberry pink, mango orange, chocolate brown, vanilla cream), exploding splash of colorful fruit juice on the left side with flying strawberries, banana, mango, dragon fruit, coconut`

### Variation : bowling à volonté
> *Sujet* : `9 young adults jumping in mid-air with arms raised in celebration, in front of a glowing bowling lane, bowling pins and colorful balls in foreground, motion blur on jumping legs`

### Variation : karaoké / blind test
> *Sujet* : `7 friends in a private karaoke room, disco ball overhead, two singing into microphones in the center (a man and a woman), others cheering with drinks raised, lyrics screen on the left wall, sequin tops and denim jackets`

### Variation : fléchettes digitales
> *Sujet* : `4 friends in a bar, one man in the center throwing a red dart toward the viewer with a confident smile, digital dartboards and score screens "PLAYER 1 - 501" glowing in the background, fireworks behind`

### Variation : billards
> *Sujet* : `5 friends around a pool table, one man in the center leaning over the green felt aiming with a cue stick, billiard balls (8-ball, striped, solid) scattered, others cheering behind him`

### Variation : carte membre bowling
> *Sujet* : `6 friends gathered around a central man in a purple hoodie holding up a colorful rainbow gradient membership card with bowling pins printed on it, bowling lane behind, colorful bowling balls and shoes (blue, red, green) in foreground`

---

## 13. COHÉRENCE INTER-AFFICHES (série)

Pour que toutes les affiches se reconnaissent comme une **même série** :
1. **Toujours** : fond violet sombre + feux d'artifice + néons
2. **Toujours** : un badge titre jaune 3D au centre-bas
3. **Toujours** : sous-titre crème + accroche violette en dessous
4. **Toujours** : personnages 3D Pixar-style multi-ethniques au-dessus des badges
5. **Optionnel** : logo Family Games Center en haut à droite + bandeau bas violet

**Astuce** : utiliser le même *seed* sur Midjourney/Flux pour conserver le style entre générations, ou demander explicitement « same art style and color palette as the previous image ».

---

## 14. CHECK-LIST AVANT VALIDATION D'UNE IMAGE GÉNÉRÉE

- [ ] Fond violet sombre + néons multicolores ?
- [ ] Feux d'artifice OU confettis visibles ?
- [ ] Personnages 3D style Pixar (pas anime, pas flat) ?
- [ ] Diversité ethnique respectée (au moins 3 origines visibles) ?
- [ ] Yeux énormes + sourires éclatants ?
- [ ] Badge titre jaune 3D extrudé en violet ?
- [ ] Sous-titre sur badge crème avec points magenta ?
- [ ] Accroche violette + jaune avec ornements `≈{ }≈` ?
- [ ] Prix en magenta italique si applicable ?
- [ ] Format vertical 4:5 OU horizontal 16:9 ?

---

*Fin du fichier. Coller tout ou partie de ce guide dans un prompt IA, en l'accompagnant de la **section 12 (Prompt-Type)** personnalisée avec le sujet voulu.*
