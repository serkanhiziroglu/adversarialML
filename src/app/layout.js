// src/app/layout.js

import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-playwrite">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+GB+S&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}