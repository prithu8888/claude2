import type { Movie } from "../types/movie";
import "./MovieDetail.css";

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieDetail({ movie, onClose }: MovieDetailProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <div className="modal-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <div className="modal-rating">
              <span className="star">&#9733;</span> {movie.rating} / 10
            </div>
            <p className="modal-description">{movie.description}</p>
            <div className="modal-details">
              <div className="detail-row">
                <strong>Year:</strong> {movie.releaseYear}
              </div>
              <div className="detail-row">
                <strong>Language:</strong> {movie.language}
              </div>
              <div className="detail-row">
                <strong>Genre:</strong> {movie.genre.join(", ")}
              </div>
              <div className="detail-row">
                <strong>Mood:</strong> {movie.mood.join(", ")}
              </div>
              <div className="detail-row">
                <strong>Cast:</strong> {movie.actors.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
