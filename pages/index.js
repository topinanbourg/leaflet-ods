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
        <title>ODS &amp; Leaflet</title>
        <meta name="description" content="ODS &amp; Leaflet tests" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapWithNoSSR />
    </div>
  )
}
