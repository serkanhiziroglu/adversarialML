import Link from 'next/link'

export const Header = () => (
    <header className="bg-neutral-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center py-4">
                <Link href="/" className="rounded-xl active:bg-gray-700 text-3xl font-bold text-white cursor-pointer relative group hover:bg-gray-600 px-4 py-2 rounded transition duration-200">
                    Adversarial Image Protection
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li className="relative group">
                            <Link href="/" className="rounded-lg  active:bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded transition duration-200">
                                Home
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/advanced-testing" className="rounded-lg  active:bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded transition duration-200">
                                Advanced Testing
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/faq" className="rounded-lg  active:bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded transition duration-200">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
)