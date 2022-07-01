const API_KEY = "a50e121bc04c7d1378ba62c07d96ff2a";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovieResults {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovieResults[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  return await response.json();
}
