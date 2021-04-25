import { createContext, useState, ReactNode, useContext } from 'react';

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
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps)
{
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

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

  function toggleLoop()
  {
    setIsLooping(!isLooping);
  }

  function toggleShuffle()
  {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean)
  {
    setIsPlaying(state);
  }

  function clearPlayerState()
  {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext()
  {
    if(isShuffling)
    {
      const nextRandomEpIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpIndex);
    } 
    else if(hasNext)
    {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);  
    }
  }

  function playPrevious()
  {
    if(hasPrevious)
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
          hasNext,
          hasPrevious,
          isLooping,
          isShuffling,
          play,
          togglePlay,
          setPlayingState,
          playList,
          playNext,
          playPrevious,
          toggleLoop,
          toggleShuffle,
          clearPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () =>
{
  return useContext(PlayerContext);
}