import "./globals.css";
import Link from "next/link";

const Header = ({ handleTryAgain }) => (
  <header className="bg-white shadow-sm mb-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Link href="/" onClick={handleTryAgain}>
          <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">
            Adversarial Image Protection
          </h1>
        </Link>
      </div>
    </div>
  </header>
);

export default function RootLayout({ children, handleTryAgain }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header handleTryAgain={handleTryAgain} />
        <main>
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}