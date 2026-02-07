import { useState, useMemo } from "react";
import { movies } from "./data/movies";
import type { Movie, Filters } from "./types/movie";
import FilterPanel from "./components/FilterPanel";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";
import "./App.css";

function App() {
  const yearMin = Math.min(...movies.map((m) => m.releaseYear));
  const yearMax = Math.max(...movies.map((m) => m.releaseYear));

  const [filters, setFilters] = useState<Filters>({
    genre: "",
    mood: "",
    yearRange: [yearMin, yearMax],
    language: "",
    actor: "",
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (filters.genre && !movie.genre.includes(filters.genre)) return false;
      if (filters.mood && !movie.mood.includes(filters.mood)) return false;
      if (
        movie.releaseYear < filters.yearRange[0] ||
        movie.releaseYear > filters.yearRange[1]
      )
        return false;
      if (filters.language && movie.language !== filters.language) return false;
      if (filters.actor && !movie.actors.includes(filters.actor)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="header-icon">&#127916;</span> Movie Selector
        </h1>
        <p className="header-sub">
          Find the perfect movie by genre, mood, year, language, and cast
        </p>
      </header>
      <main className="app-main">
        <FilterPanel
          movies={movies}
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filteredMovies.length}
        />
        <MovieGrid movies={filteredMovies} onMovieClick={setSelectedMovie} />
      </main>
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
