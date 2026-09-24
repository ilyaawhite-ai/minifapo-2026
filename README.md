# Fai Folau — site officiel du festival

Site du festival **Fai Folau**, à Wallis-et-Futuna.
Une page, huit escales, une traversée de Wallis à Futuna.

> La mer ne sépare pas. Elle relie.

## Lancer le site

Site statique, sans dépendance ni étape de compilation.

```bash
npx http-server -c-1 .
# ou
python3 -m http.server 8080
```

Puis ouvrir http://localhost:8080. Le fichier `index.html` s'ouvre aussi directement
dans un navigateur.

Pour la mise en ligne, n'importe quel hébergement statique convient (GitHub Pages,
Netlify, un serveur Apache ou Nginx) : publier le dossier tel quel.

## Structure

```
index.html              toute la page — contenu éditable, commenté par section
assets/css/main.css     palette, typographie, mises en page, mouvement
assets/js/main.js       interactions (le site reste complet sans ce fichier)
assets/fonts/           Archivo + Instrument Serif, auto-hébergées (OFL)
assets/images/          photographies à déposer — voir assets/images/README.md
docs/DIRECTION.md       la direction artistique
docs/CONTENU.md         ce qui reste à fournir ou à valider avant publication
```

## Modifier le contenu

- **Textes** : directement dans `index.html`. Chaque section commence par un
  commentaire qui décrit son rôle et ses images.
- **Programme** : un bloc `.day` par jour, un `<li class="slot">` par moment
  (heure · titre · description · île · lieu).
- **Participants** : un `<li class="index__row">` par discipline ou par artiste ;
  `data-preview` indique l'image affichée au survol.
- **Le voyage** : un `<li class="voyage__step">` par phrase ; le compteur et le tracé
  s'adaptent au nombre d'étapes.
- **Images** : déposer les fichiers dans `assets/images/` avec les noms attendus.

## Principes

- Moins d'éléments, plus d'émotion.
- Mobile d'abord : chaque section est recomposée pour le téléphone.
- Accessibilité : structure sémantique, navigation clavier, contrastes, `lang` sur les
  mots wallisiens (`wls`) et futuniens (`fud`), respect de `prefers-reduced-motion`.
- Sans JavaScript, tout le contenu reste lisible.
