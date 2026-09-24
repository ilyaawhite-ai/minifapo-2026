# Contenu — à valider et à compléter

Ce document liste **tout ce qui doit être confirmé par l'organisation du festival**
avant la mise en ligne. Rien n'a été inventé sur la culture de Wallis-et-Futuna :
le site s'en tient à des faits géographiques et institutionnels établis, et le reste
est clairement signalé comme provisoire.

## 1. À fournir par l'organisation (prioritaire)

| Élément | Où | État actuel |
|---|---|---|
| Dates du festival | `index.html` → section `#festival` (« Infos pratiques ») et onglets du programme | « dates à annoncer » |
| Programme réel (titres, heures, lieux) | `index.html` → section `#programme` | **Indicatif** — structure d'exemple, à remplacer entièrement |
| Artistes et participants | `index.html` → section `#participants` | « Artiste à annoncer » ; index par disciplines |
| Lien d'inscription / participation | bouton « Participer au festival » (`href="#contact"`) | pointe vers le pied de page |
| Adresse de contact, réseaux sociaux | pied de page `#contact` | « à venir » |
| Photographies | `assets/images/` | voir `assets/images/README.md` |
| Crédits photo | pied de page | « à compléter » |
| Mentions légales / partenaires / logos institutionnels | pied de page | absents |

## 2. À faire valider par un référent culturel

| Texte | Question |
|---|---|
| « Fai Folau : faire le voyage. » | La traduction proposée est-elle celle que le festival souhaite porter ? Faut-il nuancer (navigation, traversée, expédition) ? |
| Orthographe : *ʻUvea* (avec ʻokina) | Graphie souhaitée par l'organisation ? |
| « Sculpture, tressage, tapa » (index des participants) | Les disciplines présentes au festival, et leurs noms en wallisien / futunien si souhaité. |
| « Pirogues, pêche, savoirs de navigation » | Idem. |
| Section Transmission (« Un chant appris d'une grand-mère… ») | Le ton est-il juste pour les communautés concernées ? |
| Toute image de personnes | Consentement des personnes photographiées ; pertinence des lieux et des gestes montrés. |

Si des mots en wallisien ou en futunien sont ajoutés, les baliser :
`<span lang="wls">…</span>` (wallisien) ou `<span lang="fud">…</span>` (futunien).

## 3. Faits utilisés sur le territoire (établis)

- Wallis-et-Futuna : collectivité française d'outre-mer du Pacifique Sud.
- **Trois royaumes coutumiers** : ʻUvea (Wallis), Alo et Sigave (Futuna).
- Wallis (ʻUvea) : île basse, entourée d'un lagon et d'îlots, lacs de cratère ;
  chef-lieu Mata-Utu ; ~13°17′S · 176°10′O.
- Futuna et Alofi : îles hautes (îles de Horn) ; point culminant du territoire,
  le mont Puke (524 m) ; ~14°17′S · 178°09′O ; Leava (Sigave).
- Distance Wallis – Futuna : environ 230 km.
- Langues : wallisien, futunien, français.
- Une part importante de la communauté vit en Nouvelle-Calédonie.

Si l'un de ces faits doit être formulé autrement, le modifier directement dans `index.html`.
Les coordonnées de la traversée animée sont aussi définies dans `assets/js/main.js`
(constantes `FROM` et `TO`).
