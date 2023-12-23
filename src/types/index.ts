export type User = {
  id: number;
  name: string;
};

export interface Provider {
  name: string;
  id: string;
}

export type SelectedPlaylist = {
  playlist: {
    id: string;
    name?: string | null;
  };
  setPlaylist: (id: string) => void;
};

export type PlaylistStore = {
  playlist: Playlist;
  setPlaylist: (playlist: Playlist) => void;
};

export type Playlist = {
  id: string | null;
  collaborative: boolean;
  description: string;
  external_urls: ExternalURLs;
  href: string;
  images: Array<Image>;
  name: string;
  owner: Owner;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
} | null;

export type ExternalURLs = {
  spotify: string;
};

export type Owner = {
  display_name: string;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  type: string;
  uri: string;
};

export type Image = {
  height: number | null;
  url: string;
  width: number | null;
};

export type Tracks = {
  href: string;
  total: number;
  limit: number | null;
  next: string | null;
  offset: number | null;
  previous: string | null;
  items: Array<Track>;
};

export type Track = {
  added_at: string;
  added_by: Owner;
  is_local: boolean;
  primary_color: string | null;
  track: TrackDetails;
  video_thumbnail: VideoThumbnail | null;
};

export type TrackDetails = {
  album: Album;
  artists: Array<Artist>;
  available_markets: Array<string>;
  context: {
    type: string;
    uri: string;
  };
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIDs;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  offset: number;
  popularity: number;
  preview_url: string | null;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
};

export type VideoThumbnail = {
  url: string | null;
};

export type Album = {
  album_type: string;
  artists: Array<Artist>;
  available_markets: Array<string>;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: Array<Image>;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

export type Artist = {
  external_urls: ExternalURLs;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type ExternalIDs = {
  isrc: string;
};

export type ActiveState = {
  timestamp: number;
  context: {
    uri: string;
    metadata: Record<string, unknown>;
  };
  disallows: {
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  loading: boolean;
  paused: boolean;
  playback_features: {
    hifi_status: string;
    playback_speed: Record<string, unknown>;
  };
  playback_id: string;
  playback_quality: string;
  playback_speed: number;
  position: number;
  repeat_mode: number;
  restrictions: {
    disallow_seeking_reasons: string[];
    disallow_skipping_next_reasons: string[];
    disallow_skipping_prev_reasons: string[];
  };
  shuffle: boolean;
  track_window: TrackWindow;
};

export type TrackWindow = {
  current_track: PlaybackSong;
  next_tracks: PlaybackSong[];
  previous_tracks: PlaybackSong[];
};

export type PlaybackSong = {
  album: {
    name: string;
    uri: string;
    images: Spotify.Image[];
  };
  artists: PlaybackArtist[];
  duration_ms: number;
  id: string;
  is_playable: boolean;
  linked_from: {
    uri: string | null;
    id: string | null;
  };
  media_type: string;
  name: string;
  track_type: string;
  type: string;
  uid: string;
  uri: string;
};

export type PlaybackAlbum = {
  height?: number;
  width: number;
  url: string;
  size: string;
};

export type PlaybackArtist = {
  name: string;
  uri: string;
  url: string;
};
