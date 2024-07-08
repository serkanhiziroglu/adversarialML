import Image from 'next/image';
import Head from 'next/head';

const ImageHeader = () => {
    return (
        <>
            <Head>
                <link
                    rel="preload"
                    href="/faq-bg-1.png"
                    as="image"
                />
            </Head>
            <div className="w-full shadow-lg rounded-lg relative h-[300px]">
                <Image
                    src="/faq-bg-1.png"
                    alt="Mona Lisa"
                    fill
                    className="rounded-lg object-cover object-center"
                    priority
                />
            </div>
        </>
    );
};

export default ImageHeader;