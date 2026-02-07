import { useMemo } from "react";
import type { Movie, Filters } from "../types/movie";
import "./FilterPanel.css";

interface FilterPanelProps {
  movies: Movie[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  resultCount: number;
}

export default function FilterPanel({
  movies,
  filters,
  onFilterChange,
  resultCount,
}: FilterPanelProps) {
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((m) => m.genre.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [movies]);

  const allMoods = useMemo(() => {
    const moods = new Set<string>();
    movies.forEach((m) => m.mood.forEach((md) => moods.add(md)));
    return Array.from(moods).sort();
  }, [movies]);

  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    movies.forEach((m) => langs.add(m.language));
    return Array.from(langs).sort();
  }, [movies]);

  const allActors = useMemo(() => {
    const actors = new Set<string>();
    movies.forEach((m) => m.actors.forEach((a) => actors.add(a)));
    return Array.from(actors).sort();
  }, [movies]);

  const yearMin = useMemo(
    () => Math.min(...movies.map((m) => m.releaseYear)),
    [movies]
  );
  const yearMax = useMemo(
    () => Math.max(...movies.map((m) => m.releaseYear)),
    [movies]
  );

  const update = (key: keyof Filters, value: string | [number, number]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      genre: "",
      mood: "",
      yearRange: [yearMin, yearMax],
      language: "",
      actor: "",
    });
  };

  const hasFilters =
    filters.genre ||
    filters.mood ||
    filters.language ||
    filters.actor ||
    filters.yearRange[0] !== yearMin ||
    filters.yearRange[1] !== yearMax;

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        {hasFilters && (
          <button className="clear-btn" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="genre-select">Genre</label>
        <select
          id="genre-select"
          value={filters.genre}
          onChange={(e) => update("genre", e.target.value)}
        >
          <option value="">All Genres</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="mood-select">Mood</label>
        <select
          id="mood-select"
          value={filters.mood}
          onChange={(e) => update("mood", e.target.value)}
        >
          <option value="">All Moods</option>
          {allMoods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>
          Release Year: {filters.yearRange[0]} &ndash; {filters.yearRange[1]}
        </label>
        <div className="year-range">
          <input
            type="range"
            min={yearMin}
            max={yearMax}
            value={filters.yearRange[0]}
            onChange={(e) =>
              update("yearRange", [
                Math.min(Number(e.target.value), filters.yearRange[1]),
                filters.yearRange[1],
              ])
            }
          />
          <input
            type="range"
            min={yearMin}
            max={yearMax}
            value={filters.yearRange[1]}
            onChange={(e) =>
              update("yearRange", [
                filters.yearRange[0],
                Math.max(Number(e.target.value), filters.yearRange[0]),
              ])
            }
          />
        </div>
        <div className="year-labels">
          <span>{yearMin}</span>
          <span>{yearMax}</span>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="language-select">Language</label>
        <select
          id="language-select"
          value={filters.language}
          onChange={(e) => update("language", e.target.value)}
        >
          <option value="">All Languages</option>
          {allLanguages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="actor-select">Actor</label>
        <select
          id="actor-select"
          value={filters.actor}
          onChange={(e) => update("actor", e.target.value)}
        >
          <option value="">All Actors</option>
          {allActors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="result-count">
        <span className="count">{resultCount}</span> movie
        {resultCount !== 1 ? "s" : ""} found
      </div>
    </aside>
  );
}
