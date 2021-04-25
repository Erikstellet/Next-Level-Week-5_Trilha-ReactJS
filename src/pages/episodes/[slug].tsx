import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../../services/api';
import { parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import  Head  from 'next/head';

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

type EpisodeProps = 
{
    episode: Episode,
}

export default function Episode({ episode }: EpisodeProps)
{
    const { play } = usePlayer();
    const filterTitle = episode.title.substr(0, 12);    //Diminui o tamalho do title no Head

    return (
        <div className={styles.episode}>

            <Head>
                <title> {filterTitle} | Podcastr </title>
            </Head> 
            
            <div className={styles.thumbnailContainer}>

                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" 
                             className={styles.thumb} >
                        </img>
                    </button>
                </Link>

                <Image width={700}
                       height={160}
                       src={episode.thumbnail}
                       objectFit="cover"
                />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar Episódio" 
                         className={styles.thumbPlay}>
                    </img>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>

                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} 
                 dangerouslySetInnerHTML={{__html: episode.description}}
            />
            
        </div>
    )
}

/*
   client(browser) - true 
   next.js(node.js) - blocking 
   server(back-end)
*/
// Toda rota que tiver getStaticProps e colchetes precisa desse metodo.
export const getStaticPaths: GetStaticPaths = async () =>
{
    const { data } = await api.get('episodes',
    {
        params:
        {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    });

    const paths = data.map(ep =>
    {
        return {
            params: 
            {
                slug: ep.id
            }
        }
    }) 

    return {
        paths,
        fallback: 'blocking',       // Incremental  Static Regeneration
    }
}

export const getStaticProps: GetStaticProps = async (ctx) =>
{
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = 
     {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'dd MMM yy', { locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };

    return {
        props:
        {
            episode,
        },
        revalidate: 60 * 60 * 168, // 7 days
    }
}