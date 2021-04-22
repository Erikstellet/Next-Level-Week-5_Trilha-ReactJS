// import { useEffect } from "react";

export default function Home(props)
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
    <h1>Index</h1>
  )
}

// SSR getServerSideProps() -> props
// SSG getStaticProps() -> props -> revalidate -> *Só funciona em produção.

export async function getStaticProps()
{
  const res = await fetch('http://localhost:3333/episodes');
  const data = await res.json();

  return {
    props: 
    {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}


