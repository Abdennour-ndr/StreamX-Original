import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMDB_BASE_URL = 'https://imdb-api.com/en/API';

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  imdb_id?: string;
}

export interface SearchResults {
  results: MovieDetails[];
  total_pages: number;
  total_results: number;
}

class MovieDBService {
  private tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
      language: 'ar-SA',
    },
  });

  async searchMovies(query: string, page: number = 1): Promise<SearchResults> {
    try {
      const response = await this.tmdbClient.get('/search/movie', {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    try {
      const response = await this.tmdbClient.get(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<SearchResults> {
    try {
      const response = await this.tmdbClient.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getMovieCredits(id: number) {
    try {
      const response = await this.tmdbClient.get(`/movie/${id}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  }

  async getSimilarMovies(id: number) {
    try {
      const response = await this.tmdbClient.get(`/movie/${id}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  }
}

export const movieDBService = new MovieDBService(); 