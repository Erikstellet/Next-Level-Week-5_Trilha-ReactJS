import { createContext } from 'react';

type Episode =
{
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
}

type PlayerContextData =
{
    episodeList: Episode[];
    currentEpisode: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);