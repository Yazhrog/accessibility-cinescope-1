import { useMemo, useState } from "react";
import posterAube from "./assets/aube.svg";
import posterMemoire from "./assets/memoire.svg";
import posterOrbite from "./assets/orbite.svg";

interface Film {
  id: number;
  title: string;
  genre: string;
  time: string;
  available: boolean;
  poster: string;
}

const films: Film[] = [
  { id: 1, title: "Après l’aube", genre: "Drame", time: "18 h 10", available: true, poster: posterAube },
  { id: 2, title: "La mémoire des murs", genre: "Documentaire", time: "19 h 30", available: false, poster: posterMemoire },
  { id: 3, title: "Orbite 9", genre: "Science-fiction", time: "21 h 00", available: true, poster: posterOrbite },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredFilms = useMemo(
    () => films.filter((film) => film.title.toLowerCase().includes(query.toLowerCase().trim())),
    [query],
  );

  const toggleFavorite = (id: number) => {
    setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  return (
    <>
      {/* 1. Lien d'évitement pour les utilisateurs au clavier et lecteurs d'écran */}
      <a href="#programme" className="skip-link">
        Passer directement au programme des films
      </a>

      {/* 2. En-tête sémantique */}
      <header className="topbar" role="banner">
        <button
          type="button"
          className="brand brand-btn"
          onClick={() => setQuery("")}
          aria-label="CinéScope — Réinitialiser la recherche"
        >
          CinéScope
        </button>
        <nav className="menu" aria-label="Navigation principale">
          <a href="#programme">Programme</a>
          <a href="#infos">Informations</a>
        </nav>
      </header>

      {/* 3. Contenu principal */}
      <main id="main-content" className="page">
        <h1>Films à l’affiche</h1>
        <p className="intro">Découvrez la programmation de cette semaine.</p>

        {/* 4. Formulaire de recherche avec label accessible */}
        <section className="search-section" aria-label="Recherche de séances">
          <label htmlFor="film-search" className="search-label">
            Rechercher un film
          </label>
          <input
            id="film-search"
            type="search"
            className="search"
            placeholder="Ex : Après l’aube, Orbite 9..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby="search-feedback"
          />
          <p id="search-feedback" className="sr-only" aria-live="polite">
            {filteredFilms.length === 0
              ? "Aucun film ne correspond à votre recherche"
              : `${filteredFilms.length} film${filteredFilms.length > 1 ? "s" : ""} trouvé${filteredFilms.length > 1 ? "s" : ""}`}
          </p>
        </section>

        {/* 5. Liste des films structurée avec balisage sémantique */}
        <section id="programme" aria-labelledby="programme-heading">
          <h2 id="programme-heading" className="sr-only">
            Grille des films
          </h2>

          <div className="film-grid">
            {filteredFilms.map((film) => {
              const isFavorite = favorites.includes(film.id);
              const isSelected = selected === film.title;

              return (
                <article
                  className={`film-card ${isSelected ? "film-card-selected" : ""}`}
                  key={film.id}
                  aria-labelledby={`film-title-${film.id}`}
                >
                  {/* Bouton d'action principal pour sélectionner le film */}
                  <button
                    type="button"
                    className="film-card-action"
                    onClick={() => setSelected(film.title)}
                    aria-label={`Sélectionner la séance du film ${film.title}`}
                  >
                    <img
                      src={film.poster}
                      alt={`Affiche officielle du film ${film.title}`}
                    />

                    <div className="film-content">
                      {/* Statut de disponibilité avec texte alternatif pour l'accessibilité */}
                      <div
                        className={film.available ? "availability available" : "availability unavailable"}
                        title={film.available ? "Séance disponible" : "Séance complète"}
                      >
                        <span className="sr-only">
                          {film.available ? "Séance disponible" : "Séance complète"}
                        </span>
                      </div>

                      <h3 id={`film-title-${film.id}`} className="film-title">
                        {film.title}
                      </h3>
                      <p className="film-meta">
                        <span>{film.genre}</span> · <span>{film.time}</span>
                      </p>
                    </div>
                  </button>

                  {/* Bouton Favori accessible et indépendant */}
                  <button
                    type="button"
                    className={`favorite ${isFavorite ? "favorite-active" : ""}`}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Retirer "${film.title}" des favoris`
                        : `Ajouter "${film.title}" aux favoris`
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(film.id);
                    }}
                  >
                    <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* 6. Notification live de sélection pour lecteur d'écran */}
        <div className="selection-container" aria-live="polite" aria-atomic="true">
          {selected && (
            <p className="selection" role="status">
              Film sélectionné : <strong>{selected}</strong>
            </p>
          )}
        </div>

        {/* 7. Section Informations */}
        <section id="infos" className="infos-section" aria-labelledby="infos-heading">
          <h2 id="infos-heading">Informations pratiques</h2>
          <p>
            CinéScope vous accueille du mardi au dimanche. Réservations en ligne recommandées pour les séances du soir.
          </p>
        </section>
      </main>

      {/* 8. Pied de page accessible identifiant le binôme */}
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <p><strong>CinéScope</strong> — Projet Accessibilité Web (A11y)</p>
          <p>
            Réalisé par le binôme :{" "}
            <span className="author-name">Thomas Polverelli</span> &amp;{" "}
            <span className="author-name">Clément Pasteau</span>
          </p>
        </div>
      </footer>
    </>
  );
}
