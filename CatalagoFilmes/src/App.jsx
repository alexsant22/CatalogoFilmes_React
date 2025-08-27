import { useState } from "react";
import { buscarFilmes, buscarFilmePorId } from "./services/omdbService";
import "./App.css";

export default function App() {
  const [termo, setTermo] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async () => {
    if (!termo.trim()) return;
    setCarregando(true);
    setErro("");
    setFilmes([]);
    setFilmeSelecionado(null);

    try {
      const data = await buscarFilmes(termo);
      setFilmes(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelecionarFilme = async (id) => {
    setCarregando(true);
    setErro("");
    try {
      const data = await buscarFilmePorId(id);
      setFilmeSelecionado(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarFavorito = (filme) => {
    if (!favoritos.some((f) => f.imdbID === filme.imdbID)) {
      setFavoritos([...favoritos, { ...filme }]);
    }
  };

  const removerFavorito = (id) => {
    setFavoritos(favoritos.filter((f) => f.imdbID !== id));
  };

  return (
    <div className="app">
      <h1>🎬 Catálogo de Filmes</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="error">{erro}</p>}

      {filmes.length > 0 && (
        <div className="movie-list">
          {filmes.map((filme) => (
            <div key={filme.imdbID} className="movie-card">
              <img
                src={
                  filme.Poster !== "N/A"
                    ? filme.Poster
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={filme.Title}
              />
              <h3>
                {filme.Title} ({filme.Year})
              </h3>
              <button onClick={() => handleSelecionarFilme(filme.imdbID)}>
                Detalhes
              </button>
              {favoritos.some((f) => f.imdbID === filme.imdbID) ? (
                <button onClick={() => removerFavorito(filme.imdbID)}>
                  Remover Favorito
                </button>
              ) : (
                <button onClick={() => adicionarFavorito(filme)}>
                  Adicionar Favorito
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {filmeSelecionado && (
        <div className="movie-details">
          <h2>
            {filmeSelecionado.Title} ({filmeSelecionado.Year})
          </h2>
          <p>
            <strong>Gênero:</strong> {filmeSelecionado.Genre}
          </p>
          <p>
            <strong>Nota IMDb:</strong> {filmeSelecionado.imdbRating}
          </p>
          <p>
            <strong>Sinopse:</strong> {filmeSelecionado.Plot}
          </p>
          <img
            src={
              filmeSelecionado.Poster !== "N/A"
                ? filmeSelecionado.Poster
                : "https://via.placeholder.com/200x300?text=No+Image"
            }
            alt={filmeSelecionado.Title}
          />
          {favoritos.some((f) => f.imdbID === filmeSelecionado.imdbID) ? (
            <button onClick={() => removerFavorito(filmeSelecionado.imdbID)}>
              Remover Favorito
            </button>
          ) : (
            <button onClick={() => adicionarFavorito(filmeSelecionado)}>
              Adicionar Favorito
            </button>
          )}
        </div>
      )}

      <div className="favorites">
        <h2>Meus Favoritos</h2>
        {favoritos.length === 0 ? (
          <p>Nenhum filme favorito ainda.</p>
        ) : (
          <div className="favorites-list">
            {favoritos.map((filme) => (
              <div key={filme.imdbID} className="favorite-card">
                <img
                  src={
                    filme.Poster !== "N/A"
                      ? filme.Poster
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={filme.Title}
                />
                <h3>
                  {filme.Title} ({filme.Year})
                </h3>
                <button onClick={() => removerFavorito(filme.imdbID)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
