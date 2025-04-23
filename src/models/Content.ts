import { ObjectId } from 'mongodb';

export type ContentType = 'movie' | 'series' | 'documentary' | 'course';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export interface IEpisode {
  _id?: ObjectId;
  title: string;
  description: string;
  duration: number;  // in seconds
  videoUrl: string;
  thumbnailUrl?: string;
  episodeNumber: number;
  seasonNumber: number;
}

export interface IContent {
  _id?: ObjectId;
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  rating: ContentRating;
  releaseDate: Date;
  duration?: number;  // in seconds (for movies)
  videoUrl?: string;  // for movies
  thumbnailUrl: string;
  bannerUrl?: string;
  trailerUrl?: string;
  genres: string[];
  cast: string[];
  director?: string;
  producer?: string;
  episodes?: IEpisode[];  // for series
  seasons?: number;  // for series
  averageRating?: number;
  totalRatings?: number;
  views: number;
  premium: boolean;  // whether this content is only for premium users
  tags: string[];
  language: string;
  subtitles: string[];  // available subtitle languages
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentCreate extends Omit<IContent, '_id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalRatings' | 'views'> {
  createdAt?: Date;
  updatedAt?: Date;
  averageRating?: number;
  totalRatings?: number;
  views?: number;
}

export const createContent = (data: IContentCreate): IContent => {
  const now = new Date();
  return {
    ...data,
    views: data.views || 0,
    averageRating: data.averageRating || 0,
    totalRatings: data.totalRatings || 0,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}; 