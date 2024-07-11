import React from 'react';

const ImageText = ({ imageSrc, title, description, imagePosition }) => (
    <div className={`mb-8 flex flex-col ${imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 my-8`}>
        <div className="w-full md:w-1/2">
            <img src={imageSrc} alt={title} className="rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-gray-700">{description}</p>
        </div>
    </div>
);

export default ImageText;