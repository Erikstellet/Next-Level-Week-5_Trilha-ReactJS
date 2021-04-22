// import { useEffect } from "react";
import { GetStaticProps } from 'next';
import {format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './home.module.scss';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

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

export default function Home({ allEpisodes, latestEpisodes }: HomeProps)
{
  // SPA
  /*
    useEffect(() => 
    {
      fetch('http://localhost:3333/episodes').then(res => res.json())
                                            .then(data => console.log(data));
    }, [])
  */

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>

        <h2>Últimos Lançamentos</h2>
        
        <ul>
          {
            latestEpisodes.map(episode =>
            {
              return (
                <li key={episode.id}>

                  <a href="">{episode.title}</a>
                  <img src={episode.thumbnail} alt="Thumbnail"/> 

                  <div className={styles.episodeDetails}>
                    <a href="">{episode.title}</a>
                    <p>{episode.members}</p>

                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button>
                    <img src="/play-green.svg" alt="Tocar Episódio"/>
                  </button>

                </li>
              )
            })
          }
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        <h2>Últimos Lançamentos</h2>
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


