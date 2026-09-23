# MINIFAPO 2026 · Site du festival

Site officiel du festival MINIFAPO 2026 à Wallis-et-Futuna, à partir du **6 décembre 2026**.

Le site est **statique** : du HTML, du CSS et un peu de JavaScript, sans outil de compilation. Il s'ouvre directement dans un navigateur et peut être hébergé gratuitement (GitHub Pages, Netlify…).

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : compte à rebours jusqu'à l'ouverture, temps forts, accès rapides, partenaires |
| `festival.html` | Présentation du festival, valeurs, les trois royaumes (Uvea, Alo, Sigave), déroulé, organisation |
| `participants.html` | Délégations et artistes, avec filtres (région, discipline) |
| `programme.html` | Programme jour par jour, en onglets |
| `activites.html` | Spectacles, ateliers, village des arts, saveurs, sports, excursions, rencontres |
| `partenaires.html` | Logos des partenaires et offres pour devenir partenaire |
| `infos-pratiques.html` | Venir, se loger, se déplacer, climat, coutumes, questions fréquentes |
| `contact.html` | Formulaire de contact et coordonnées |
| `mentions-legales.html` | Mentions légales (à compléter) |
| `404.html` | Page d'erreur |

## Voir le site en local

Ouvrez `index.html` dans votre navigateur, ou lancez un petit serveur :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Mettre le site en ligne avec GitHub Pages

1. Sur GitHub, ouvrez le dépôt, puis **Settings → Pages**.
2. Dans **Build and deployment**, choisissez **Deploy from a branch**.
3. Sélectionnez la branche `main` et le dossier `/ (root)`, puis **Save**.
4. Le site est publié quelques minutes plus tard à l'adresse indiquée par GitHub.

## Personnaliser le contenu

Les textes se modifient directement dans les fichiers `.html`. En-tête et pied de page sont répétés dans chaque page : pour les modifier, faites un « rechercher-remplacer » sur tous les fichiers.

### Compte à rebours

Dans `index.html`, l'élément `.countdown` porte les dates :

```html
<div class="countdown" data-countdown
     data-start="2026-12-06T00:00:00+12:00"
     data-end="2026-12-10T23:59:59+12:00">
```

- `data-start` : ouverture du festival, en heure de Wallis (`+12:00`).
- `data-end` : fin du festival. Entre les deux dates, le compteur affiche « Le festival a commencé » ; après, un message de remerciement.

Les visiteurs situés dans un autre fuseau horaire voient aussi l'heure d'ouverture convertie chez eux (Nouméa, Paris…).

### Coordonnées

Remplacez dans tous les fichiers :

- `contact@minifapo.wf` par la vraie adresse e-mail ;
- `+681 00 00 00` et `tel:+681000000` par le vrai numéro ;
- les liens des réseaux sociaux (`https://www.facebook.com/`…) dans le pied de page.

### Formulaire de contact

Sans configuration, le bouton « Envoyer » ouvre la messagerie du visiteur avec le message pré-rempli. Pour recevoir les messages directement, créez un formulaire sur un service comme [Formspree](https://formspree.io) puis renseignez son adresse dans `contact.html` :

```html
<form class="contact-form" data-contact-form data-endpoint="https://formspree.io/f/votre-identifiant" …>
```

### Logos des partenaires

Placez les logos dans `assets/img/partenaires/`, puis remplacez chaque emplacement :

```html
<li><span class="logo-slot">Logo partenaire</span></li>
```

par :

```html
<li><img src="assets/img/partenaires/nom.png" alt="Nom du partenaire"></li>
```

### Photos

Les visuels des activités sont des panneaux à motifs tapa. Pour y mettre une photo, ajoutez une image dans le bloc `.activity__visual` concerné :

```html
<div class="activity__visual activity__visual--night" aria-hidden="true">
  <img src="assets/img/photos/danse.jpg" alt="">
  …
</div>
```

### Participants et programme

- **Participants** : chaque carte est un `<li class="person" data-tags="…">`. Les mots de `data-tags` alimentent les filtres : `wf` ou `pacifique`, puis `danse`, `musique`, `artisanat`, `arts-visuels`. Le badge d'état passe de `status--attente` (« À confirmer ») à `status--confirme` (« Confirmée »).
- **Programme** : chaque journée est un bloc `.day-panel`, chaque rendez-vous un `<li class="event">`. Le jour affiché par défaut est le jour même pendant le festival.

### Partage sur les réseaux sociaux

Une fois l'adresse définitive du site connue, remplacez dans chaque page `content="assets/img/og-image.png"` par l'adresse complète (par exemple `https://www.minifapo.wf/assets/img/og-image.png`) pour que l'image s'affiche lors des partages.

## Contenus à valider

Les textes suivants sont des exemples réalistes, à confirmer ou à remplacer :

- les dates de fin (10 décembre) et le programme détaillé ;
- la liste des délégations invitées (indiquées « À confirmer ») ;
- la citation du comité d'organisation, les offres de partenariat et les réponses de la FAQ ;
- les coordonnées et les mentions légales (champs entre crochets).

## Structure

```
├── index.html, festival.html, …   Pages du site
├── assets/
│   ├── css/style.css              Styles (couleurs et polices en tête de fichier)
│   ├── js/main.js                 Menu, compte à rebours, filtres, onglets, formulaire
│   ├── img/                       Médaillon tapa, frise, motifs, icônes, image de partage
│   └── minifapo-2026.ics          Fichier « Ajouter à mon agenda »
└── .nojekyll                      Publication telle quelle sur GitHub Pages
```

## Identité visuelle

- **Couleurs** : nuit du lagon (`#0B2A33`), lagon (`#0E7C7B`), rouge du drapeau du Territoire (`#C8102E`), écorce de tapa (`#EBDCC0`) et son encre (`#3B2416`).
- **Polices** : Marcellus pour les titres, Figtree pour le texte (Google Fonts).
- **Motifs** : médaillon, frise et motifs géométriques inspirés du tapa ; emblème à quatre triangles inspiré du drapeau de Wallis-et-Futuna.
