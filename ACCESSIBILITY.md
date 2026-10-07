# Rapport d'Audit et de Correction d'Accessibilité (A11y) — CinéScope

**Projet :** CinéScope (Programmation de cinéma)  
**Binôme :** Thomas Polverelli & Clément Pasteau  
**Date :** 7 octobre 2026  
**Référentiel :** WCAG 2.1 (Niveaux A, AA et AAA) / RGAA  

---

## 1. Cinq Constats Majeurs d'Inaccessibilité sur le Code Initial

| N° | Composant / Code initial | Constat & Problème A11y | Impact Utilisateur |
|:---|:---|:---|:---|
| **1** | `button:focus, input:focus, a:focus { outline: none; }` | **Suppression totale des indicateurs de focus visuels.** | **Critique / Bloquant** : Tout utilisateur naviguant au clavier (personnes avec handicap moteur ou n'utilisant pas de souris) navigue « à l'aveugle », sans savoir quel élément est sélectionné. |
| **2** | `<div className="brand" onClick="...">` et `<div className="film-card" onClick="...">` | **Composants interactifs construits avec de simples `<div>`.** | **Critique** : Les `<div>` ne sont ni focalisables avec la touche `Tab`, ni activables avec `Enter` ou `Espace`, et ne possèdent aucun rôle dans l'arbre d'accessibilité pour les lecteurs d'écran (VoiceOver, NVDA). |
| **3** | `<input className="search" placeholder="Rechercher un film" />` | **Champ de formulaire sans balise `<label>` associée.** | **Majeur** : Le placeholder disparaît dès la saisie et n'est pas lu de manière fiable comme nom accessible par les technologies d'assistance. |
| **4** | `<img src={film.poster} />` et pastille `<div className="availability available" />` | **Absence d'attributs `alt` sur les affiches et information de disponibilité transmise uniquement par la couleur (cercle rouge/vert).** | **Majeur** : Violation du critère **WCAG 1.4.1 (Use of Color)**. Les personnes aveugles n'ont aucune information sur l'affiche, et les personnes daltoniennes (protanopie, deutéranopie, achromatopsie) ne peuvent pas distinguer la disponibilité. |
| **5** | `<button className="favorite">{favorites.includes(film.id) ? "★" : "☆"}</button>` | **Bouton d'état sans nom accessible (`aria-label`) ni attribut d'état (`aria-pressed`).** | **Moyen / Majeur** : Le lecteur d'écran prononce uniquement « étoile noire » ou « étoile blanche », sans indiquer l'action (« Ajouter aux favoris ») ni à quel film elle se rapporte. |

---

## 2. Justification Détaillée des Trois Corrections les Plus Marquantes

### A. Rétablissement du Focus Visuel (`:focus-visible`) et Skip-Link
- **Pourquoi :** Le retrait du contour de focus (`outline: none`) est l'une des pires régressions d'accessibilité web. Pour les utilisateurs navigant sans souris (handicap moteur, tremblements, utilisation de switch controls ou tabulation), le focus ring est le seul repère visuel de positionnement.
- **Correction apportée :**
  1. Suppression du `outline: none`.
  2. Implémentation d'un style `:focus-visible` net et contrasté (`outline: 3px solid #3b82f6; outline-offset: 3px;`).
  3. Ajout d'un **Lien d'évitement (*Skip Link*)** en haut de page (`<a href="#programme" className="skip-link">`) permettant de sauter directement l'en-tête pour accéder au contenu principal sans tabuler inutilement.

### B. Remplacement des `<div>` Cliquables par des `<button>` Natifs
- **Pourquoi :** Transformer une `<div>` en bouton via `onClick` casse tout le comportement natif du navigateur :
  - Pas de focus clavier par défaut (`tabindex`).
  - Pas de déclenchement sur les touches `Enter` ou `Space`.
  - Pas de rôle `button` exposé à l'API d'accessibilité de l'OS.
- **Correction apportée :**
  1. `.brand` transformé en `<button type="button" className="brand brand-btn">` avec réinitialisation de la recherche.
  2. La sélection des cartes transformée en `<button type="button" className="film-card-action">` encapsulé dans un élément sémantique `<article>`.
  3. Chaque bouton dispose d'un nom accessible explicite (`aria-label="Sélectionner la séance du film Après l'aube"`).

### C. Restructuration Sémantique des Formulaires, Images et Badges Textuels Explicites (WCAG 1.4.1)
- **Pourquoi :** L'accessibilité d'un formulaire repose sur l'association programmatique explicite entre le libellé et le champ de saisie (`for` / `id`). De plus, **la couleur ne doit jamais être le seul vecteur d'information**.
- **Correction apportée :**
  1. Création d'un vrai `<label htmlFor="film-search">` associé à l'<`input id="film-search">`.
  2. Ajout d'attributs `alt="Affiche officielle du film [Titre]"` sur chaque image.
  3. **Remplacement du simple rond de couleur par un badge textuel complet et visible** : `● Places disponibles` (sur fond vert clair avec texte vert foncé `#14532d`, contraste **> 9:1**) et `● Séance complète` (sur fond rouge clair avec texte rouge foncé `#7f1d1d`, contraste **> 9:1**). Cela garantit une lisibilité immédiate pour tous les types de daltonisme et une restitution parfaite aux lecteurs d'écran.

---

## 3. Tableau d'Impact Avant / Après

| Fonctionnalité | Avant Correction | Après Correction | Impact Utilisateur |
|:---|:---|:---|:---|
| **Navigation Clavier (`Tab`)** | Impossible de cibler les films ou la marque ; focus invisible sur les inputs. | Navigation séquentielle fluide avec focus bleu contrasté et lien d'évitement rapide. | Les personnes à mobilité réduite ou sans souris peuvent utiliser 100% du site. |
| **Recherche de films** | `input` isolé, placeholder volatil, aucun retour vocal sur le nombre de résultats. | `<label>` permanent, description dynamique masquée (`aria-live="polite"`) annonçant le nombre de résultats trouvés. | Compréhension immédiate pour les personnes déficientes visuelles ou cognitives. |
| **Sélection d'un film** | Simple affichage textuel non notifié aux technologies d'assistance. | Zone de notification avec `role="status"` et `aria-live="polite"`. | Le lecteur d'écran annonce vocalement la sélection dès qu'elle se produit, sans interrompre l'utilisateur. |
| **Bouton Favori** | Symbole Unicode ambigu (`★` / `☆`) sans contexte. | `aria-pressed="true|false"` + `aria-label="Ajouter / Retirer [Film] des favoris"`. | L'utilisateur sait exactement quel film il met en favori et quel est l'état actuel du bouton. |
| **Disponibilité des séances** | Simple pastille ronde de couleur verte ou rouge (illisible pour les daltoniens). | **Badge textuel complet visible (`● Places disponibles` / `● Séance complète`)** avec contrastes WCAG AAA. | Information compréhensible à 100% par tous (daltoniens, basse vision, lecteurs d'écran). |
| **Structure globale** | `div` imbriquées, hiérarchie de titres incohérente (`h1` vers `h4`). | Balises HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<h1>`, `<h3>`). | Permet la navigation par régions et par niveaux de titres sur lecteur d'écran. |

---

## 4. Pourquoi Privilégier le HTML Natif plutôt qu'ARIA ?

La règle fondamentale édictée par le W3C (*First Rule of ARIA Use*) stipule :

> **« Si vous pouvez utiliser un élément HTML natif ayant déjà la sémantique et le comportement requis, faites-le plutôt que de réécrire un élément avec ARIA. »**

### Raisons techniques et ergonomiques :
1. **Comportements Clavier Gratuits et Robustes** :
   - Un `<button>` natif gère automatiquement le focus (`Tab`), l'activation par les touches `Enter` et `Espace`, ainsi que l'état désactivé (`disabled`).
   - Une `<div role="button" tabindex="0">` nécessite d'écrire manuellement des écouteurs d'événements `onKeyDown` pour `Enter` et `Space`, ce qui introduit des bugs fréquents et une lourdeur de maintenance.
2. **Compatibilité Universelle** :
   - Les éléments HTML5 natifs sont supportés à 100% par tous les navigateurs, systèmes d'exploitation, moteurs de rendu et technologies d'assistance sans délai d'interprétation.
3. **Usage d'ARIA Ciblé et Raisonné** :
   - ARIA ne doit intervenir **que lorsque le HTML natif ne suffit pas** pour communiquer un état dynamique ou une relation complexe (ex : `aria-live="polite"` pour les annonces asynchrones, `aria-pressed` pour un bouton bascule, `aria-describedby` pour lier un message d'aide).

---

## 5. Préservation de l'Apparence Visuelle

Toutes les améliorations ont été intégrées en respectant scrupuleusement la charte graphique et la disposition d'origine :
- Utilisation de badges modernes au design soigné (fond pastel, typographie nette, pastille colorée de repère).
- Utilisation de la classe utilitaire standard `.sr-only` (*Screen Reader Only*) pour enrichir le flux sémantique sans modifier l'alignement visuel quand nécessaire.
- Réinitialisation propre des styles de boutons (`.film-card-action`, `.brand-btn`) pour conserver l'aspect moderne des cartes et de la topbar.
- Ajout harmonieux du pied de page (*footer*) identifiant le projet et le binôme **Thomas Polverelli & Clément Pasteau**.
