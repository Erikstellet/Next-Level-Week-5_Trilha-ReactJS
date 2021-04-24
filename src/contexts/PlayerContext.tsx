import { createContext, useState, ReactNode } from 'react';

type Episode =
{
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
}

type PlayerContextProviderProps =
{
  children: ReactNode;
}

type PlayerContextData =
{
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps)
{
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode)
  {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
    playNext();
    playPrevious();
  }

  function playList(list: Array<Episode>, index: number)
  {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay()
  {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean)
  {
    setIsPlaying(state);
  }

  function playNext()
  {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if(nextEpisodeIndex < episodeList.length)
    {
      setCurrentEpisodeIndex(nextEpisodeIndex);  
    }
  }

  function playPrevious()
  {
    if(currentEpisodeIndex > 0)
    {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  
  return (
    <PlayerContext.Provider 
      value=
      {{
          episodeList,
          currentEpisodeIndex,
          isPlaying,
          play,
          togglePlay,
          setPlayingState,
          playList,
          playNext,
          playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}