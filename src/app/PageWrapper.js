// src/app/PageWrapper.js
"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export default function PageWrapper({ children }) {
    const pathname = usePathname();

    return (
        <motion.main
            key={pathname}
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.main>
    );
}