import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../components/MainMap"), {
  ssr: false
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Leaflet &amp; ODS</title>
        <meta name="description" content="Leaflet &amp; ODS tests" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapWithNoSSR />
    </div>
  )
}
