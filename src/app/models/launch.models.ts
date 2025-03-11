export interface Launch {
  id: string;
  flight_number: number;
  date_utc: string;
  rocket: {
    id: string;
    name: string;
  };
  details: string;
  links: Record<string, string | null>;
}

export interface LaunchLinks {
  youtube_id?: string;
  webcast?: string;
  article?: string;
  wikipedia?: string;
  presskit?: string;
  patch?: {
    small?: string;
    large?: string;
  };
  reddit?: {
    campaign?: string;
    launch?: string;
    media?: string;
    recovery?: string;
  };
  flickr?: {
    small?: string[];
    original?: string[];
  };
}

export interface LaunchQueryOptions {
  query: {
    date_precision?: { $in: string[] };
    tbd?: boolean;
  };
  options: {
    page: number;
    limit: number;
    sort?: { date_utc: number };
    select: string[];
    populate: {
      path: string;
      select: string[];
    };
  };
}

export interface Pagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface LaunchResponse extends Pagination {
  docs: Launch[];
}