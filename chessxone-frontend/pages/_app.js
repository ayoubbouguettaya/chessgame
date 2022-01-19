import Head from 'next/head'
import Layout from '../components/Layout'
import {UserContextProvider} from '../store/user/context';

import '../styles/globals.css'

const MyApp = ({ Component, pageProps }) => (
  <>
      <Head>
        <title> chessxone | online chess game</title>
        <meta name="description" content="online chess game multiplayer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  <UserContextProvider>
  <Layout> <Component {...pageProps} /></Layout>
  </UserContextProvider>
  </>
)

export default MyApp
