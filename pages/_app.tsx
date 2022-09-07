import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head"

import dynamic from "next/dynamic"
import { ThemeProvider } from "@mui/material/styles"
import theme from "theme"

require("@solana/wallet-adapter-react-ui/styles.css")
const WalletConnectionProvider = dynamic(
  () => import("components/WalletConnection/WalletConnectionProvider"),
  {
    ssr: false,
  }
)

function MyApp({ Component, pageProps }: AppProps) {
  const pageUrl = "https://www.gnesis.com/"
  const logoImg = "https://www.gnesis.com/logo.png"
  const title = "JackPot"
  const description = "JackPot "

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/logo192.png" />
        <meta name="description" key="description" content={description} />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:url" key="og:url" content={pageUrl} />
        <meta property="og:image" key="og:image" content={logoImg} />
        <meta property="og:description" key="og:description" content={description} />
        <meta property="twitter:title" key="twitter:title" content={title} />
        <meta property="twitter:site_name" key="twitter:site_name" content={pageUrl} />
        <meta property="twitter:url" key="twitter:url" content={pageUrl} />
        <meta property="twitter:image" key="twitter:image" content={logoImg} />
      </Head>
      <ThemeProvider theme={theme}>
        <WalletConnectionProvider>
          <Component {...pageProps} />
        </WalletConnectionProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
