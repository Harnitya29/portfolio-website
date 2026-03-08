'use client';

import { useEffect, useState } from 'react';

interface SpotifyTrack {
  item: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
    external_urls: {
      spotify: string;
    };
    duration_ms: number;
  };
  is_playing: boolean;
  progress_ms: number;
}

export default function NowPlaying() {
  const [song, setSong] = useState<SpotifyTrack | null>({
    item: {
      id: "4mHW3A0p2U2KxWcMibZJ6w",
      name: "Forever Young",
      artists: [{ name: "Alphaville" }],
      album: {
        images: [{ url: "https://upload.wikimedia.org/wikipedia/en/e/e0/Alphaville_-_Forever_Young_%28song%29_single_cover.jpg" }]
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/4mHW3A0p2U2KxWcMibZJ6w"
      },
      duration_ms: 226000
    },
    is_playing: true,
    progress_ms: 50000
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate playing progress
    const interval = setInterval(() => {
      setSong(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          progress_ms: (prev.progress_ms + 1000) % prev.item.duration_ms
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-green-300 text-sm font-bold tracking-wider mb-4">
          NOW PLAYING
        </h3>
        <div className="flex items-center justify-center h-16">
          <div className="text-gray-500">Loading song...</div>
        </div>
      </div>
    );
  }

  if (error || !song || !song.item || !song.item.external_urls || !song.item.duration_ms) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-green-300 text-sm font-bold tracking-wider mb-4">
          NOW PLAYING
        </h3>
        <div className="flex items-center gap-3 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
          <div className="text-green-300/70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
          <div className="text-xs text-gray-400">
            Not playing anything right now
          </div>
        </div>
      </div>
    );
  }

  const progress = song.progress_ms / song.item.duration_ms;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-green-300 text-sm font-bold tracking-wider mb-4">
        NOW PLAYING
      </h3>
      
      <a
        href={song.item.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-3 rounded-lg backdrop-blur-sm border border-zinc-800/50 hover:border-green-300/30 transition-colors"
      >
        {/* Album art */}
        <div className="w-12 h-12 relative overflow-hidden rounded-md">
          {song.item.album.images[0] && (
            <img 
              src={song.item.album.images[0].url} 
              alt={song.item.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Track info */}
        <div className="flex flex-col">
          <div className="text-xs font-medium text-white">
            {song.item.name.length > 25 
              ? `${song.item.name.substring(0, 25)}...` 
              : song.item.name}
          </div>
          <div className="text-[10px] text-gray-400">
            {song.item.artists.map(a => a.name).join(", ")}
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 w-full relative h-1">
            <div className="absolute inset-0 rounded-full bg-zinc-800/50" />
            <div 
              className="absolute h-full rounded-full bg-green-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        
        {/* Play/pause indicator */}
        <div className="ml-2 w-6 h-6 flex items-center justify-center">
          {song.is_playing ? (
            <div className="w-4 h-4 text-green-300 flex gap-1">
              <div className="w-1 bg-current rounded animate-pulse" />
              <div className="w-1 bg-current rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          ) : (
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </a>
      
      {/* Spotify logo */}
      <a 
        href="https://open.spotify.com/user/31rvwbxlgn5qgxrxcw6jhatbxrsy"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 opacity-50 flex items-center gap-1 text-[10px] text-gray-500 hover:opacity-100 hover:text-green-400 transition-all"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.5576 16.6777C16.3638 16.9991 15.9055 17.1066 15.5841 16.9128C13.3539 15.5981 10.5356 15.3094 6.96163 16.1315C6.59093 16.2158 6.22175 15.9793 6.13744 15.6086C6.05313 15.2379 6.28809 14.8687 6.65879 14.7844C10.5655 13.8889 13.7155 14.2343 16.2225 15.7042C16.5439 15.898 16.6514 16.3563 16.5576 16.6777ZM17.7679 13.7346C17.5226 14.1329 17.0425 14.2665 16.6442 14.0212C14.0865 12.4933 10.1913 12.0889 6.85284 13.0762C6.40475 13.2089 5.93268 12.9579 5.79999 12.5098C5.66729 12.0617 5.91832 11.5897 6.36641 11.457C10.1512 10.3389 14.4758 10.7969 17.4813 12.6109C17.8796 12.8562 18.0132 13.3363 17.7679 13.7346ZM17.8641 10.7138C14.8126 8.95682 9.4462 8.76153 6.3809 9.76067C5.84816 9.91767 5.28365 9.61267 5.12665 9.07993C4.96965 8.54719 5.27465 7.98268 5.80739 7.82568C9.34763 6.68384 15.2854 6.91518 18.8389 8.96144C19.3249 9.24344 19.4784 9.86144 19.1964 10.3459C18.9144 10.8304 18.2979 10.9854 17.8134 10.7034L17.8641 10.7138Z"/>
        </svg>
        <span>SPOTIFY</span>
      </a>
    </div>
  );
}