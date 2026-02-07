import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";
import "./MovieGrid.css";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">&#127916;</div>
        <h3>No movies found</h3>
        <p>Try adjusting your filters to discover more movies.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}
