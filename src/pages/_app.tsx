import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import MagicProvider from '@/hooks/MagicProvider'
import { UniversalAccountProvider } from '@/hooks/UniversalAccountProvider'
import { ToastContainer } from 'react-toastify'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <MagicProvider>
        <UniversalAccountProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </UniversalAccountProvider>
      </MagicProvider>
    </div>
  )
}
