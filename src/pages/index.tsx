// import { useEffect } from "react";
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './home.module.scss';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

type Episode =
{
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = 
{
  episodes: Episode[];
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

// SPA
/*
  useEffect(() => 
  {
    fetch('http://localhost:3333/episodes').then(res => res.json())
                                          .then(data => console.log(data));
  }, [])
*/

export default function Home({ allEpisodes, latestEpisodes }: HomeProps)
{
  const { playList } = useContext(PlayerContext);
  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>

        <h2>Últimos Lançamentos</h2>
        
        <ul>
          {
            latestEpisodes.map((episode, i) =>
            {
              return (
                <li key={episode.id}>

                  <Image width={192} height={192}
                         objectFit="cover"
                         src={episode.thumbnail}
                         alt="Thumbnail"
                  /> 

                  <div className={styles.episodesDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    
                    <p>{episode.members}</p>

                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button className={styles.button}
                          onClick={() => playList(episodeList, i)}
                  >
                    <img className={styles.imageButton} 
                         src="/play-green.svg" alt="Tocar Episódio"/>
                  </button>

                </li>
              )
            })
          }
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        
        <h2>Todos os Episódios</h2>

        <table cellSpacing={0}>

          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((ep, i) =>
            {
              return (
                <tr key={ep.id}>
                  <td style={{width: 140}}>
                    <Image width={120}
                           height={120}
                           src={ep.thumbnail}
                           alt={ep.title}
                           objectFit="cover"
                    />
                  </td>

                  <td> <a href={`/episodes/${ep.id}`}>{ep.title}</a> </td>
                  <td>{ep.members}</td>
                  <td style={{width: 100}}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>

                  <td>
                    <button type="button" onClick={() => playList(episodeList, i + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>
    </div>
  )
}

// SSR getServerSideProps() -> props
// SSG getStaticProps() -> props -> revalidate -> *Só funciona em produção.

export const getStaticProps: GetStaticProps = async () =>
{
  const { data } = await api.get('episodes',
  {
    params:
    {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });
 
  const episodes = data.map(episode => 
  {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'dd MMM yy', { locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(latestEpisodes.length, episodes.length);

  return {
    props: 
    {
      episodes,
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}


