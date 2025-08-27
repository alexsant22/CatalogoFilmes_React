const apiKey = import.meta.env.VITE_OMDB_API_KEY;

export async function buscarFilmes(termo) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(termo)}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Nenhum filme encontrado!");
  }

  return data.Search;
}

export async function buscarFilmePorId(id) {
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Filme não encontrado!");
  }

  return data;
}