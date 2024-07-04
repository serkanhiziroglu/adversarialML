import Link from 'next/link'

export const Header = () => (
    <header className="bg-neutral-700 shadow-sm mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center py-4">
                <Link href="/" className="text-3xl font-bold text-white cursor-pointer relative group">
                    <span className="relative z-10">Adversarial Image Protection</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out"></span>
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link href="/faq" className="text-white hover:text-gray-300">FAQ</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
)