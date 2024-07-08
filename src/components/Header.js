"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export const Header = () => {
    const pathname = usePathname();
    const [clickedLink, setClickedLink] = useState(null);

    const handleClick = (href) => {
        setClickedLink(href);
    };

    useEffect(() => {
        if (clickedLink) {
            const timer = setTimeout(() => setClickedLink(null), 300);
            return () => clearTimeout(timer);
        }
    }, [clickedLink]);

    return (
        <header className={`shadow-sm ${styles.curvedHeader}`} style={{ background: 'linear-gradient(90deg, #1a237e, #004d40)', color: 'white' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                <div className="flex justify-between items-center py-2">
                    <Link href="/" className="rounded-xl text-3xl font-bold text-white cursor-pointer relative group hover:bg-gray-600 px-4 py-2 rounded transition duration-200">
                        Adversarial Image Protection
                    </Link>
                    <nav>
                        <ul className="flex space-x-4">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/analyze', label: 'Analyze' },
                                { href: '/faq', label: 'FAQ' },
                            ].map(({ href, label }) => (
                                <li key={href} className="relative group">
                                    <Link
                                        href={href}
                                        className={`rounded-lg text-white px-4 py-2 rounded
                                            ${styles.navLink}
                                            ${pathname === href ? styles.active : ''}
                                            ${clickedLink === href ? styles.clicked : ''}`}
                                        onClick={() => handleClick(href)}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;