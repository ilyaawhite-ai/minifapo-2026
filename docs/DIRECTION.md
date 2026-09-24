# Fai Folau — Direction artistique

> « Moins d'éléments, plus d'émotion. »

## 1. Direction : « Le sillage »

Le site est construit comme une traversée. Il ne s'agit pas d'un template de festival
habillé de motifs, mais d'un **carnet de bord contemporain** : chaque section est une
*escale* numérotée, repérée par un nom et des coordonnées réelles.

La page suit un mouvement physique :

| Escale | Section | Ambiance |
|---|---|---|
| — | Hero | La surface — l'horizon, la mer |
| 01 | Le voyage | On descend dans l'océan — nuit, silence, un tracé |
| 02 | Wallis & Futuna | On accoste — la lumière, la terre |
| 03 | Le festival | Le rassemblement — clair, simple |
| 04 | Programme | L'écume — lisible avant tout |
| 05 | Participants | Le basalte — les personnes au premier plan |
| 06 | Transmission | La fibre — le rythme ralentit |
| 07 | L'invitation | Le crépuscule — une dernière image, une porte ouverte |

## 2. Concept visuel

Deux éléments seulement, utilisés partout :

- **L'horizon** — une ligne d'un pixel. Dans le hero, le mot FAI FOLAU est *posé* sur
  l'horizon : les lettres deviennent des îles. Sous la ligne, la houle.
- **Le sillage** — la route réelle de Wallis à Futuna (~230 km vers l'ouest-sud-ouest),
  tracée au scroll dans « Le voyage ». Les coordonnées de l'en-tête défilent de
  13°17′S · 176°10′O à 14°17′S · 178°09′O pendant la traversée.

Les deux îles sont traitées par la **forme**, pas par la décoration :

- **Wallis est horizontale** — île basse, lagon : image panoramique 21:9, texte en largeur.
- **Futuna est verticale** — îles hautes, forêt, mont Puke (524 m) : image en hauteur.

## 3. Palette

Tirée des matières du territoire. Aucune couleur « tropicale ».

| Jeton | Hex | Origine |
|---|---|---|
| `--nuit` | `#0A1C23` | L'océan profond, la nuit |
| `--ocean` | `#123641` | L'eau au-delà du récif |
| `--lagon` | `#5E9C98` | Le lagon, volontairement atténué |
| `--brume` | `#C9D3CF` | Le ciel chargé d'humidité |
| `--sable` | `#F2EDE4` | Sable corallien — fond principal |
| `--ecume` | `#FAF8F4` | L'écume — texte sur fond sombre |
| `--fibre` | `#B89E78` | Fibres végétales, tressage |
| `--vegetal` | `#2F3B2C` | La forêt de Futuna |
| `--basalte` | `#1A1917` | La roche volcanique |
| **`--terre`** | **`#9C4A2F`** | **Accent unique** — la terre latéritique rouge de Wallis |

L'accent `--terre` n'apparaît que sur : le point du voyageur, les « 230 km », l'onglet de
jour actif, les numéros du festival, le survol des boutons. Jamais en aplat.

## 4. Typographie

- **Archivo** (variable, largeur 62–125 %) — police principale.
  - En largeur *expanded* (125 %) et en capitales pour FAI FOLAU : une typographie
    étirée comme l'horizon. Le mot devient un élément graphique (hero, voyage, pied de page).
  - En largeur normale pour les textes : très lisible, neutre, précise.
- **Instrument Serif** — voix expressive : phrases contemplatives, noms en langue
  locale (*ʻUvea*, *Alo*, *Sigave*), mots mis en relief en italique.

Hiérarchie : titres très grands (jusqu'à 300 px), textes courts, étiquettes en capitales
espacées (le « carnet de bord »), chiffres tabulaires pour les heures et coordonnées.

Les noms wallisiens et futuniens sont balisés `lang="wls"` / `lang="fud"`.

## 5. Structure narrative

Le visiteur *ressent* avant de *comprendre* :

1. **Hero** — un mot, une phrase : « La mer ne sépare pas. Elle relie. »
2. **Le voyage** — six phrases, une à la fois, pendant que la route se trace.
   Le sens de Fai Folau n'est révélé qu'à la fin : « Faire le voyage. »
3. **Wallis & Futuna** — deux identités, un territoire.
4. **Le festival** — trois réponses : ce qui s'y passe, qui participe, pourquoi.
5. **Programme** — heure · quoi · où.
6. **Participants** — portraits éditoriaux et index typographique.
7. **Transmission** — quatre phrases lentes, une citation.
8. **L'invitation** — une image, un bouton.

## 6. Stratégie d'images

Aucune fausse image. Chaque emplacement est un **cadre nommé** qui affiche, tant que la
photo n'existe pas, un fond tonal sobre (grain de matière + ligne d'horizon) et une
légende indiquant le sujet attendu et le nom du fichier. Déposer le fichier dans
`assets/images/` suffit à le remplacer. Voir `assets/images/README.md`.

Priorité : de vraies photographies de Wallis, de Futuna et de leurs habitants, prises
avec leur accord. Une grande image forte plutôt que plusieurs moyennes.

## 7. Interactions

- En-tête minimal, qui prend la teinte de la section survolée, se retire quand on
  descend et revient quand on remonte.
- Menu plein écran listant les escales.
- Programme en onglets (navigation clavier ← → Début Fin).
- Index des participants : au survol (souris), les autres lignes s'estompent et une
  image flotte, avec un léger retard, comme un objet sur l'eau.

## 8. Animations

Une seule animation « signature » : **le tracé de la traversée**. Tout le reste est discret :

- apparition lente des textes (1,4 s ; 2,2 s dans « Transmission ») ;
- courbe de mouvement « houle » : départ doux, longue arrivée ;
- houle en perspective qui dérive en 60 à 150 s ;
- parallaxe plafonnée à ±6 % ;
- lettres de FAI FOLAU qui montent comme une marée.

Sans JavaScript, ou avec `prefers-reduced-motion`, **tout le contenu est visible et
complet** : le voyage devient une suite de phrases, la route est déjà tracée.

## 9. Mobile

Recomposé, pas réduit :

- FAI / FOLAU sur deux lignes, pleine largeur, l'horizon sous FOLAU ;
- le voyage en plein écran, carte en haut, phrase en bas, sous le pouce ;
- Wallis et Futuna en images 4:5 bord à bord ;
- programme : heure et lieu sur une ligne, titre en dessous ;
- portraits décalés, index sans survol ;
- menu plein écran, bouton d'appel pleine largeur.
