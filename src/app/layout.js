// src/app/layout.js
import './globals.css';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import PageWrapper from './PageWrapper';
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable}`}  >
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <PageWrapper>{children}</PageWrapper>
        </main>
        <Footer />
      </body>
    </html>
  );
}