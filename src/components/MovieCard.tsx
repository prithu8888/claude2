import type { Movie } from "../types/movie";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} loading="lazy" />
        <div className="movie-rating">{movie.rating}</div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{movie.releaseYear}</span>
          <span className="movie-lang">{movie.language}</span>
        </div>
        <div className="movie-tags">
          {movie.genre.map((g) => (
            <span key={g} className="tag tag-genre">
              {g}
            </span>
          ))}
          {movie.mood.slice(0, 2).map((m) => (
            <span key={m} className="tag tag-mood">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
